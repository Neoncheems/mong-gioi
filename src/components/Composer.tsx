import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { T } from '../utils/strings';
import { QuickActions } from './QuickActions';

interface Props {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  firstNpcName?: string;
  firstNeighborName?: string;
}

export function Composer({ onSend, onStop, isStreaming, firstNpcName, firstNeighborName }: Props) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || isStreaming) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-bg-2 border-t border-border pb-4">
      {/* Nút bấm nhanh */}
      <QuickActions 
        onAction={onSend} 
        disabled={isStreaming} 
        firstNpcName={firstNpcName}
        firstNeighborName={firstNeighborName}
      />

      <div className="p-4">
        <div className="max-w-4xl mx-auto relative bg-bg-3 border border-border rounded-xl focus-within:ring-2 focus-within:ring-accent transition-all">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder={T.play.inputPlaceholder}
            className="w-full bg-transparent text-text px-4 py-3 outline-none resize-none min-h-[50px] max-h-[150px] overflow-y-auto"
            rows={1}
          />
          
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            {isStreaming ? (
              <button
                onClick={onStop}
                className="p-2 bg-bg-2 text-error rounded-lg hover:bg-error/20 transition-colors border border-border"
                title={T.play.stop}
              >
                <Square size={18} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!text.trim()}
                className="p-2 bg-accent text-white rounded-lg hover:bg-accent-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={T.play.send}
              >
                <Send size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}