import type { GameState, World, TimeOfDay } from '../types';

export interface ParsedResponse {
  narrative: string;
  statePatch: Partial<GameState>;
  parseError?: string;
}

const STATE_BLOCK_RE = /```state\s*([\s\S]*?)```/i;
const VALID_TIMES: TimeOfDay[] = ['sáng', 'trưa', 'chiều', 'tối', 'đêm'];

export function parseAIResponse(raw: string, world: World, currentState: GameState): ParsedResponse {
  const match = raw.match(STATE_BLOCK_RE);
  
  // Nếu AI không trả về JSON, chỉ trả về câu chuyện
  if (!match) return { narrative: raw.trim(), statePatch: {} };
  
  const narrative = raw.replace(STATE_BLOCK_RE, '').trim();
  let patch: any = {};
  
  try {
    patch = match[1].trim() ? JSON.parse(match[1].trim()) : {};
  } catch {
    return { narrative, statePatch: {}, parseError: 'AI trả JSON không hợp lệ, bỏ qua cập nhật lượt này.' };
  }

  const out: Partial<GameState> = {};
  
  if (typeof patch.hp === 'number' && Number.isFinite(patch.hp)) {
    out.hp = Math.max(0, Math.min(currentState.maxHp, Math.round(patch.hp)));
  }
  if (patch.timeOfDay && VALID_TIMES.includes(patch.timeOfDay)) {
    out.timeOfDay = patch.timeOfDay;
  }
  if (typeof patch.locationId === 'string' && world.locations.some(l => l.id === patch.locationId)) {
    out.currentLocationId = patch.locationId;
  }
  
  if (Array.isArray(patch.inventoryAdd) || Array.isArray(patch.inventoryRemove)) {
    let inv = [...currentState.inventory];
    if (Array.isArray(patch.inventoryRemove)) {
      inv = inv.filter(i => !patch.inventoryRemove.includes(i));
    }
    if (Array.isArray(patch.inventoryAdd)) {
      for (const it of patch.inventoryAdd) {
        if (typeof it === 'string' && it.trim() && !inv.includes(it)) inv.push(it);
      }
    }
    out.inventory = inv;
  }
  
  if (patch.flagsSet && typeof patch.flagsSet === 'object') {
    out.flags = { ...currentState.flags, ...patch.flagsSet };
  }
  
  return { narrative, statePatch: out };
}