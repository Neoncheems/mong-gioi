import type { Message } from '../types';
import { Volume2, User, Drama } from 'lucide-react';
import { useSettings } from '../store/useSettings';
import { speak } from '../utils/tts';

interface Props {
  message: Message;
  isStreaming?: boolean;
}

export function ChatBubble({ message, isStreaming }: Props) {
  const isUser = message.role === 'user';
  const settings = useSettings();

  const handleSpeak = () => {
    speak(message.content, settings.ttsVoiceURI, settings.ttsRate);
  };

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-accent text-white' : 'bg-bg-3 text-accent border border-accent/30'}`}>
          {isUser ? <User size={16} /> : <Drama size={16} />}
        </div>

        {/* Nội dung tin nhắn */}
        <div className="flex flex-col gap-1">
          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser 
              ? 'bg-accent text-white rounded-tr-sm' 
              : 'bg-bg-2 border border-border text-text rounded-tl-sm'
          }`}>
            {message.content}
            {/* Hiệu ứng con trỏ nhấp nháy khi đang tải */}
            {isStreaming && <span className="cursor-blink text-accent ml-1"></span>}
          </div>
          
          {/* Nút đọc lại (chỉ dành cho AI) */}
          {!isUser && !isStreaming && settings.ttsEnabled && (
            <button onClick={handleSpeak} className="text-xs text-text-2 hover:text-accent flex items-center gap-1 self-start px-2">
              <Volume2 size={12} /> Đọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
}