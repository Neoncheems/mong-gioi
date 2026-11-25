import type { Settings } from '../types';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function streamChat(
  messages: ChatMessage[],
  settings: Settings,
  onChunk: (delta: string) => void,
  signal: AbortSignal
): Promise<string> {
  // Tự động làm sạch Base URL: Xoá dấu gạch chéo ở cuối (nếu có) và xoá đuôi /chat/completions (nếu lỡ nhập dư)
  const cleanBaseUrl = settings.apiBaseUrl
    .replace(/\/$/, '') 
    .replace(/\/chat\/completions$/, ''); 
    
  const url = `${cleanBaseUrl}/chat/completions`;
  
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Thêm headers định danh theo yêu cầu của OpenRouter
        'HTTP-Referer': 'https://mong-gioi-blush.vercel.app', // Link web của bạn
        'X-Title': 'Mong Gioi RPG',
        ...(settings.apiKey ? { Authorization: `Bearer ${settings.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: settings.model,
        messages,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
        stream: true,
      }),
      signal,
    });
  } catch (e: any) {
    if (e.name === 'AbortError') throw e;
    throw new Error(`Không kết nối được tới AI. Kiểm tra: (1) Mạng có ổn không, (2) API Key có đúng không, (3) Tài khoản OpenRouter còn lượt không.`);
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`AI báo lỗi ${res.status}. Chi tiết: ${txt.slice(0, 200)}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith('data:')) continue;
        const d = t.slice(5).trim();
        if (d === '[DONE]') return full;
        
        try {
          const j = JSON.parse(d);
          const delta = j.choices?.[0]?.delta?.content;
          if (typeof delta === 'string' && delta) {
            full += delta;
            onChunk(delta);
          }
        } catch { /* Bỏ qua chunk lỗi */ }
      }
    }
  } catch (e: any) {
    if (e.name !== 'AbortError') throw new Error(`Lỗi đứt kết nối: ${e.message}`);
  }
  
  return full;
}

export async function testConnection(settings: Settings): Promise<string> {
  // Làm sạch URL tương tự hàm trên
  const cleanBaseUrl = settings.apiBaseUrl
    .replace(/\/$/, '') 
    .replace(/\/chat\/completions$/, ''); 
    
  const url = `${cleanBaseUrl}/models`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'HTTP-Referer': 'https://mong-gioi-blush.vercel.app',
        'X-Title': 'Mong Gioi RPG',
        ...(settings.apiKey ? { Authorization: `Bearer ${settings.apiKey}` } : {}),
      },
    });
    if (!res.ok) throw new Error(`Mã lỗi HTTP ${res.status}`);
    return `Kết nối thành công!`;
  } catch (e: any) {
    throw new Error(`Không kết nối được. Chi tiết: ${e.message}.`);
  }
}