import { create } from 'zustand';
import { db } from '../db/db';
import type { World } from '../types';
import { newId } from '../utils/id';
import { presetWorlds } from '../data/presets';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

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
    const user = useAuth.getState().user;
    
    // 1. Tải dữ liệu từ máy (Offline)
    let all = await db.worlds.toArray();
    
    if (all.length === 0) {
      await db.worlds.bulkAdd(presetWorlds);
      all = await db.worlds.toArray();
    }

    // 2. Nếu đã đăng nhập, kéo dữ liệu từ Mây về
    if (user) {
      try {
        const { data: cloudData, error } = await supabase.from('worlds').select('data').eq('user_id', user.id);
        if (!error && cloudData) {
          const cloudWorlds = cloudData.map(d => d.data as World);
          
          // Gộp dữ liệu mây vào máy (nếu trùng ID thì lấy bản mới nhất)
          for (const cw of cloudWorlds) {
            await db.worlds.put(cw);
          }
          all = await db.worlds.toArray();
        }
      } catch (e) {
        console.error("Lỗi đồng bộ thế giới:", e);
      }
    }
    
    all.sort((a, b) => b.updatedAt - a.updatedAt);
    set({ worlds: all, isLoading: false });
  },

  create: async (partial) => {
    const user = useAuth.getState().user;
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
    
    // Lưu máy
    await db.worlds.add(newWorld);
    set((s) => ({ worlds: [newWorld, ...s.worlds] }));

    // Lưu mây
    if (user) {
      await supabase.from('worlds').insert({ id: newWorld.id, user_id: user.id, data: newWorld });
    }
    return newWorld;
  },

  update: async (id, updates) => {
    const user = useAuth.getState().user;
    const current = get().worlds.find(w => w.id === id);
    if (!current) return;
    
    if (current.isPreset) {
      // Nếu là world mẫu, tạo bản copy
      const copy = { ...current, ...updates, id: newId(), name: current.name + ' (Bản sao)', isPreset: false, updatedAt: Date.now() };
      await db.worlds.add(copy);
      set((s) => ({ worlds: [copy, ...s.worlds] }));
      if (user) await supabase.from('worlds').insert({ id: copy.id, user_id: user.id, data: copy });
    } else {
      // Cập nhật bình thường
      const updated = { ...current, ...updates, updatedAt: Date.now() };
      await db.worlds.put(updated);
      set((s) => ({
        worlds: s.worlds.map(w => w.id === id ? updated : w).sort((a, b) => b.updatedAt - a.updatedAt)
      }));
      if (user) await supabase.from('worlds').upsert({ id: updated.id, user_id: user.id, data: updated });
    }
  },

  remove: async (id) => {
    const user = useAuth.getState().user;
    await db.worlds.delete(id);
    set((s) => ({ worlds: s.worlds.filter(w => w.id !== id) }));
    if (user) await supabase.from('worlds').delete().eq('id', id);
  },

  importWorld: async (world) => {
    const user = useAuth.getState().user;
    const imported = { ...world, id: newId(), isPreset: false, updatedAt: Date.now() };
    await db.worlds.add(imported);
    set((s) => ({ worlds: [imported, ...s.worlds] }));
    if (user) await supabase.from('worlds').insert({ id: imported.id, user_id: user.id, data: imported });
  }
}));