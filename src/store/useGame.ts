import { create } from 'zustand';
import { db } from '../db/db';
import type { Save, World, Character, Message, GameState } from '../types';
import { newId } from '../utils/id';
import { streamChat, type ChatMessage } from '../ai/client';
import { buildSystemPrompt } from '../ai/prompts';
import { parseAIResponse } from '../ai/parser';
import { useSettings } from './useSettings';
import { useToast } from './useToast';

interface GameStore {
  currentSave: Save | null;
  currentWorld: World | null;
  isStreaming: boolean;
  streamingContent: string;
  abortController: AbortController | null;

  startNewGame: (world: World, character: Character) => Promise<string>;
  loadSave: (saveId: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  stopStreaming: () => void;
}

export const useGame = create<GameStore>((set, get) => ({
  currentSave: null,
  currentWorld: null,
  isStreaming: false,
  streamingContent: '',
  abortController: null,

  // Khởi tạo một Save mới khi bấm nút "Bắt đầu"
  startNewGame: async (world, character) => {
    const initialState: GameState = {
      currentLocationId: world.startLocationId,
      hp: character.stats['Máu'] || 100,
      maxHp: character.stats['Máu'] || 100,
      inventory: [],
      flags: {},
      timeOfDay: 'sáng',
    };

    const newSave: Save = {
      id: newId(),
      name: `Hành trình của ${character.name}`,
      worldId: world.id,
      character,
      messages: [],
      state: initialState,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.saves.add(newSave);
    return newSave.id;
  },

  // Tải dữ liệu Save lên bộ nhớ khi vào màn hình chơi
  loadSave: async (saveId) => {
    const save = await db.saves.get(saveId);
    if (!save) throw new Error('Không tìm thấy dữ liệu game');
    const world = await db.worlds.get(save.worldId);
    if (!world) throw new Error('Không tìm thấy thế giới');

    set({ currentSave: save, currentWorld: world });
  },

  // Hàm cốt lõi: Gửi tin nhắn và nhận AI trả lời
  sendMessage: async (text) => {
    const { currentSave, currentWorld, isStreaming } = get();
    if (!currentSave || !currentWorld || isStreaming) return;

    const settings = useSettings.getState();
    const toast = useToast.getState();

    // 1. Tạo tin nhắn của User
    const userMsg: Message = { id: newId(), role: 'user', content: text, timestamp: Date.now() };
    const newMessages = [...currentSave.messages, userMsg];
    
    // Cập nhật UI ngay lập tức
    set({
      currentSave: { ...currentSave, messages: newMessages },
      isStreaming: true,
      streamingContent: '',
      abortController: new AbortController(),
    });

    try {
      // 2. Chuẩn bị Context gửi cho AI
      const systemPrompt = buildSystemPrompt(currentWorld, currentSave.character, currentSave.state, currentSave.summary);
      
      // Lấy N tin nhắn gần nhất (contextWindow)
      const contextMessages = newMessages.slice(-settings.contextWindow).map(m => ({
        role: m.role,
        content: m.content
      })) as ChatMessage[];

      const apiMessages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...contextMessages
      ];

      // 3. Gọi AI (Streaming)
      let fullText = '';
      await streamChat(
        apiMessages,
        settings,
        (chunk) => {
          fullText += chunk;
          set({ streamingContent: fullText });
        },
        get().abortController!.signal
      );

      // 4. Xử lý kết quả AI trả về (Tách truyện và JSON)
      const { narrative, statePatch, parseError } = parseAIResponse(fullText, currentWorld, currentSave.state);

      if (parseError) toast.warning(parseError);

      // 5. Áp dụng thay đổi trạng thái (Máu, Địa điểm, Túi đồ...)
      const newState = { ...currentSave.state, ...statePatch };

      const aiMsg: Message = {
        id: newId(),
        role: 'assistant',
        content: narrative,
        rawContent: fullText,
        timestamp: Date.now(),
        statePatch
      };

      const finalSave: Save = {
        ...currentSave,
        messages: [...newMessages, aiMsg],
        state: newState,
        updatedAt: Date.now(),
      };

      // 6. Lưu vào Database và cập nhật UI
      await db.saves.put(finalSave);
      set({ currentSave: finalSave, isStreaming: false, streamingContent: '' });

      // 7. Đọc thành tiếng nếu bật TTS
      if (settings.ttsEnabled && narrative) {
        import('../utils/tts').then(tts => tts.speak(narrative, settings.ttsVoiceURI, settings.ttsRate));
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Người dùng bấm Dừng
        const aiMsg: Message = { id: newId(), role: 'assistant', content: get().streamingContent, timestamp: Date.now() };
        const finalSave = { ...currentSave, messages: [...newMessages, aiMsg] };
        await db.saves.put(finalSave);
        set({ currentSave: finalSave, isStreaming: false, streamingContent: '', abortController: null });
      } else {
        // Lỗi mạng hoặc API
        toast.error(error.message);
        // Xoá tin nhắn user vừa gửi đi để họ thử lại
        set({ 
          currentSave: { ...currentSave }, 
          isStreaming: false, 
          streamingContent: '', 
          abortController: null 
        });
      }
    }
  },

  stopStreaming: () => {
    get().abortController?.abort();
  }
}));