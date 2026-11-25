import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../store/useGame';
import { useToast } from '../store/useToast';
import { ChatBubble } from '../components/ChatBubble';
import { Composer } from '../components/Composer';
import { ArrowLeft, User, Package, MapPin, Clock, Heart } from 'lucide-react';
import { T } from '../utils/strings';

export function PlayPage() {
  const { saveId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { 
    currentSave, currentWorld, isStreaming, streamingContent,
    loadSave, sendMessage, stopStreaming 
  } = useGame();

  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false); // Chống gọi AI mở đầu 2 lần

  // 1. Tải dữ liệu khi vào trang
  useEffect(() => {
    if (!saveId) return;
    loadSave(saveId)
      .catch((err) => {
        toast.error(err.message);
        navigate('/');
      })
      .finally(() => setIsLoading(false));
  }, [saveId, loadSave, navigate, toast]);

  // 2. Tự động gọi AI mở đầu nếu là game mới (chưa có tin nhắn nào)
  useEffect(() => {
    if (
      !isLoading && 
      currentSave && 
      currentSave.messages.length === 0 && 
      !hasStartedRef.current
    ) {
      hasStartedRef.current = true;
      sendMessage("Hãy mô tả khung cảnh mở đầu và đặt nhân vật vào bối cảnh.");
    }
  }, [isLoading, currentSave, sendMessage]);

  // 3. Cuộn xuống cuối khi có tin nhắn mới hoặc AI đang gõ
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSave?.messages, streamingContent]);

  if (isLoading) return <div className="p-10 text-center text-accent">Đang tải cuộc phiêu lưu...</div>;
  if (!currentSave || !currentWorld) return null;

  const currentLoc = currentWorld.locations.find(l => l.id === currentSave.state.currentLocationId) || currentWorld.locations[0];
  const npcsHere = currentWorld.entities.filter(e => e.locationId === currentLoc.id);
  
  // Tìm NPC đầu tiên và địa điểm lân cận đầu tiên cho Nút bấm nhanh
  const firstNpcName = npcsHere.length > 0 ? npcsHere[0].name : undefined;
  const neighborLocs = currentWorld.locations.filter(l => currentLoc.connections.includes(l.id));
  const firstNeighborName = neighborLocs.length > 0 ? neighborLocs[0].name : undefined;

  return (
    <div className="fixed inset-0 top-16 flex bg-bg text-text overflow-hidden">
      
      {/* CỘT TRÁI: NHÂN VẬT & ĐỒ ĐẠC (Ẩn trên đt) */}
      <div className="w-64 bg-bg-2 border-r border-border flex flex-col flex-shrink-0 hidden md:flex">
        <div className="p-4 border-b border-border">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-text-2 hover:text-accent mb-4 transition-colors">
            <ArrowLeft size={16} /> {T.play.exitToMenu}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 text-accent rounded-full flex items-center justify-center font-bold text-lg">
              {currentSave.character.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold">{currentSave.character.name}</div>
              <div className="text-xs text-text-2">Lữ khách</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div>
            <div className="text-sm font-semibold text-accent flex items-center gap-2 mb-2"><Heart size={14}/> {T.play.stats}</div>
            <div className="bg-bg-3 p-3 rounded-lg border border-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{T.play.hp}:</span> <span className="text-error font-bold">{currentSave.state.hp} / {currentSave.state.maxHp}</span>
              </div>
              <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                <div className="bg-error h-full transition-all duration-500" style={{ width: `${(currentSave.state.hp / currentSave.state.maxHp) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-accent flex items-center gap-2 mb-2"><Package size={14}/> {T.play.inventory}</div>
            <div className="bg-bg-3 p-3 rounded-lg border border-border text-sm">
              {currentSave.state.inventory.length === 0 ? (
                <span className="text-text-2 italic">Trống</span>
              ) : (
                <ul className="list-disc pl-4 space-y-1">
                  {currentSave.state.inventory.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CỘT GIỮA: KHUNG CHAT (Dùng Flexbox để không bị đè) */}
      <div className="flex-1 flex flex-col min-w-0 bg-bg h-full relative">
        {/* Vùng cuộn tin nhắn */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            {currentSave.messages.length === 0 && !isStreaming ? (
              <div className="text-center py-20 text-text-2 italic">{T.play.emptyState}</div>
            ) : (
              currentSave.messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))
            )}
            
            {isStreaming && (
              <ChatBubble 
                message={{ id: 'streaming', role: 'assistant', content: streamingContent, timestamp: Date.now() }} 
                isStreaming={true} 
              />
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
        
        {/* Ô nhập liệu luôn nằm ở đáy */}
        <div className="flex-shrink-0">
          <Composer 
            onSend={sendMessage} 
            onStop={stopStreaming} 
            isStreaming={isStreaming} 
            firstNpcName={firstNpcName}
            firstNeighborName={firstNeighborName}
          />
        </div>
      </div>

      {/* CỘT PHẢI: THÔNG TIN ĐỊA ĐIỂM (Ẩn trên đt và máy tính bảng) */}
      <div className="w-72 bg-bg-2 border-l border-border flex flex-col flex-shrink-0 hidden lg:flex">
        <div className="p-4 border-b border-border">
          <div className="text-sm font-semibold text-accent flex items-center gap-2 mb-2"><MapPin size={14}/> {T.play.location}</div>
          <div className="font-bold text-lg">{currentLoc.name}</div>
          <p className="text-sm text-text-2 mt-1">{currentLoc.description}</p>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <div className="text-sm font-semibold text-accent flex items-center gap-2 mb-2"><Clock size={14}/> {T.play.time}</div>
            <span className="inline-block bg-bg-3 border border-border px-3 py-1 rounded-full text-sm capitalize">
              {currentSave.state.timeOfDay}
            </span>
          </div>

          <div>
            <div className="text-sm font-semibold text-accent flex items-center gap-2 mb-2"><User size={14}/> {T.play.npcsHere}</div>
            {npcsHere.length === 0 ? (
              <span className="text-sm text-text-2 italic">Không có ai xung quanh.</span>
            ) : (
              <div className="space-y-2">
                {npcsHere.map(npc => (
                  <div key={npc.id} className="bg-bg-3 p-2 rounded border border-border text-sm flex items-center gap-2">
                    <div className="w-6 h-6 bg-bg rounded-full flex items-center justify-center text-xs font-bold text-accent">{npc.name.charAt(0)}</div>
                    {npc.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}