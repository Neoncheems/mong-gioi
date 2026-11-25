// Hàm đọc văn bản thành tiếng Việt
export function speak(text: string, voiceURI: string, rate: number) {
  if (!('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel(); // Dừng câu đang đọc (nếu có)
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = rate;
  
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
  if (selectedVoice) utterance.voice = selectedVoice;
  
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

// Lấy danh sách giọng đọc tiếng Việt có sẵn trên máy
export function getVietnameseVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices().filter(v => v.lang.includes('vi'));
}