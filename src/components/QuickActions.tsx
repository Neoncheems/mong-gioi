import { Eye, MessageSquare, Footprints, Package } from 'lucide-react';
import { T } from '../utils/strings';

interface Props {
  onAction: (text: string) => void;
  disabled: boolean;
  firstNpcName?: string;
  firstNeighborName?: string;
}

export function QuickActions({ onAction, disabled, firstNpcName, firstNeighborName }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-2 bg-bg-2 border-t border-border">
      <button
        onClick={() => onAction(T.play.lookAround)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-3 hover:bg-bg border border-border rounded-full text-xs text-text-2 hover:text-accent transition-colors disabled:opacity-50"
      >
        <Eye size={14} /> {T.play.lookAround}
      </button>

      {firstNpcName && (
        <button
          onClick={() => onAction(`${T.play.talkTo} ${firstNpcName}`)}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-3 hover:bg-bg border border-border rounded-full text-xs text-text-2 hover:text-accent transition-colors disabled:opacity-50"
        >
          <MessageSquare size={14} /> {T.play.talkTo} {firstNpcName}
        </button>
      )}

      {firstNeighborName && (
        <button
          onClick={() => onAction(`${T.play.goTo} ${firstNeighborName}`)}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-3 hover:bg-bg border border-border rounded-full text-xs text-text-2 hover:text-accent transition-colors disabled:opacity-50"
        >
          <Footprints size={14} /> {T.play.goTo} {firstNeighborName}
        </button>
      )}

      <button
        onClick={() => onAction(T.play.openBag)}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-3 hover:bg-bg border border-border rounded-full text-xs text-text-2 hover:text-accent transition-colors disabled:opacity-50"
      >
        <Package size={14} /> {T.play.openBag}
      </button>
    </div>
  );
}