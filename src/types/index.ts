export type EntityRole = 'npc' | 'creature' | 'item' | 'faction';
export type TimeOfDay = 'sáng' | 'trưa' | 'chiều' | 'tối' | 'đêm';

export interface Entity {
  id: string;
  name: string;
  role: EntityRole;
  description: string;
  traits: string[];
  locationId?: string;
  relations?: Record<string, string>;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  connections: string[];
  ambient?: string;
}

export interface World {
  id: string;
  name: string;
  description: string;
  lore: string;
  startLocationId: string;
  entities: Entity[];
  locations: Location[];
  createdAt: number;
  updatedAt: number;
  isPreset?: boolean;
  
  // 5 trường mới thêm (Dấu ? nghĩa là có thể bỏ trống)
  genre?: string;
  tone?: string;
  magicLevel?: string;
  worldRules?: string;
  factions?: string;
}

export interface Character {
  id: string;
  name: string;
  appearance: string;
  personality: string;
  backstory: string;
  inventory: string[];
  stats: Record<string, number>;
}

export interface GameState {
  currentLocationId: string;
  hp: number;
  maxHp: number;
  inventory: string[];
  flags: Record<string, string | number | boolean>;
  timeOfDay: TimeOfDay;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  rawContent?: string;
  timestamp: number;
  statePatch?: Partial<GameState>;
}

export interface Save {
  id: string;
  name: string;
  worldId: string;
  character: Character;
  messages: Message[];
  state: GameState;
  summary?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  apiBaseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  contextWindow: number;
  ttsEnabled: boolean;
  ttsVoiceURI: string;
  ttsRate: number;
  theme: 'dark' | 'light';
}