import { create } from 'zustand';
import { db } from '../db/db';
import type { World } from '../types';
import { newId } from '../utils/id';
import { presetWorlds } from '../data/presets';

interface WorldsStore {
  worlds: World[];
  isLoading: boolean;
  init: () => Promise<void>;
  create: (world: Partial<World>) => Promise<World>;
  update: (id: string, updates: Partial<World>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  importWorld: (world: World) => Promise<void>;
}

export const useWorlds = create<WorldsStore>((set, get) => ({
  worlds: [],
  isLoading: true,

  init: async () => {
    set({ isLoading: true });
    let all = await db.worlds.toArray();
    
    // Nếu database trống, nạp 3 thế giới mẫu
    if (all.length === 0) {
      await db.worlds.bulkAdd(presetWorlds);
      all = await db.worlds.toArray();
    }
    
    all.sort((a, b) => b.updatedAt - a.updatedAt);
    set({ worlds: all, isLoading: false });
  },

  create: async (partial) => {
    const newWorld: World = {
      id: newId(),
      name: partial.name || 'Thế giới mới',
      description: partial.description || '',
      lore: partial.lore || '',
      startLocationId: '',
      locations: [],
      entities: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPreset: false,
    };
    
    await db.worlds.add(newWorld);
    set((s) => ({ worlds: [newWorld, ...s.worlds] }));
    return newWorld;
  },

  update: async (id, updates) => {
    const current = get().worlds.find(w => w.id === id);
    if (!current) return;
    
    // Nếu là world mẫu, tạo bản copy thay vì ghi đè
    if (current.isPreset) {
      const copy = { ...current, ...updates, id: newId(), name: current.name + ' (Bản sao)', isPreset: false, updatedAt: Date.now() };
      await db.worlds.add(copy);
      set((s) => ({ worlds: [copy, ...s.worlds] }));
    } else {
      const updated = { ...current, ...updates, updatedAt: Date.now() };
      await db.worlds.put(updated);
      set((s) => ({
        worlds: s.worlds.map(w => w.id === id ? updated : w).sort((a, b) => b.updatedAt - a.updatedAt)
      }));
    }
  },

  remove: async (id) => {
    await db.worlds.delete(id);
    set((s) => ({ worlds: s.worlds.filter(w => w.id !== id) }));
  },

  importWorld: async (world) => {
    const imported = { ...world, id: newId(), isPreset: false, updatedAt: Date.now() };
    await db.worlds.add(imported);
    set((s) => ({ worlds: [imported, ...s.worlds] }));
  }
}));