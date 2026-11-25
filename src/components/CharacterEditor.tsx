import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { World, Character } from '../types';
import { useGame } from '../store/useGame';
import { useToast } from '../store/useToast';
import { X } from 'lucide-react';

interface Props {
  world: World;
  onClose: () => void;
}

export function CharacterEditor({ world, onClose }: Props) {
  const navigate = useNavigate();
  const toast = useToast();
  const { startNewGame } = useGame();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    appearance: '',
    personality: '',
    backstory: '',
    inventoryStr: '',
    hp: 100,
  });

  const handleStart = async () => {
    if (!form.name.trim()) {
      toast.warning('Vui lòng nhập tên nhân vật!');
      return;
    }
    
    setLoading(true);
    try {
      const character: Character = {
        id: 'char-1',
        name: form.name,
        appearance: form.appearance,
        personality: form.personality,
        backstory: form.backstory,
        inventory: form.inventoryStr.split(',').map(s => s.trim()).filter(Boolean),
        stats: { 'Máu': form.hp, 'Thể lực': 100, 'Trí tuệ': 50 },
      };

      const saveId = await startNewGame(world, character);
      navigate(`/play/${saveId}`);
    } catch (e: any) {
      toast.error('Lỗi tạo nhân vật: ' + e.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-2 w-full max-w-2xl rounded-xl border border-border shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-accent">Tạo nhân vật mới</h2>
          <button onClick={onClose} className="text-text-2 hover:text-text p-1"><X size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-sm text-text-2 mb-1">Tên nhân vật <span className="text-error">*</span></label>
            <input autoFocus type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-accent" placeholder="Ví dụ: Lâm Phong..." />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-2 mb-1">Ngoại hình</label>
              <textarea value={form.appearance} onChange={e => setForm({...form, appearance: e.target.value})} className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-accent" rows={3} placeholder="Cao ráo, tóc đen, mặc áo choàng..." />
            </div>
            <div>
              <label className="block text-sm text-text-2 mb-1">Tính cách</label>
              <textarea value={form.personality} onChange={e => setForm({...form, personality: e.target.value})} className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-accent" rows={3} placeholder="Lạnh lùng, thông minh, thích phiêu lưu..." />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-2 mb-1">Xuất thân / Lý lịch</label>
            <textarea value={form.backstory} onChange={e => setForm({...form, backstory: e.target.value})} className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-accent" rows={2} placeholder="Mồ côi từ nhỏ, lớn lên trong rừng..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-2 mb-1">Túi đồ khởi đầu (cách nhau bằng phẩy)</label>
              <input type="text" value={form.inventoryStr} onChange={e => setForm({...form, inventoryStr: e.target.value})} className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-accent" placeholder="Dao găm, Bánh mì, Bản đồ" />
            </div>
            <div>
              <label className="block text-sm text-text-2 mb-1">Lượng máu ban đầu (HP)</label>
              <input type="number" value={form.hp} onChange={e => setForm({...form, hp: parseInt(e.target.value) || 0})} className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-3 bg-bg-2/50 rounded-b-xl">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-text-2 hover:bg-bg-3 transition-colors">Huỷ</button>
          <button onClick={handleStart} disabled={loading} className="bg-accent hover:bg-accent-2 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
            {loading ? 'Đang tạo...' : 'Bắt đầu phiêu lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}