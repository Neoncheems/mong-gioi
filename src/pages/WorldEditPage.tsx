import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorlds } from '../store/useWorlds';
import { useToast } from '../store/useToast';
import { newId } from '../utils/id';
import type { World, Location, Entity } from '../types';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export function WorldEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { worlds, update } = useWorlds();
  const [world, setWorld] = useState<World | null>(null);
  const [tab, setTab] = useState<'info' | 'locations' | 'entities'>('info');

  useEffect(() => {
    const found = worlds.find(w => w.id === id);
    if (found) setWorld(found);
    else navigate('/');
  }, [id, worlds, navigate]);

  if (!world) return null;

  const handleSave = async () => {
    await update(world.id, world);
    toast.success('Đã lưu thế giới!');
    navigate('/');
  };

  // --- Xử lý Địa điểm ---
  const addLocation = () => {
    const newLoc: Location = { id: newId(), name: 'Địa điểm mới', description: '', connections: [] };
    setWorld({ ...world, locations: [...world.locations, newLoc] });
  };
  const updateLocation = (idx: number, key: keyof Location, val: any) => {
    const newLocs = [...world.locations];
    newLocs[idx] = { ...newLocs[idx], [key]: val };
    setWorld({ ...world, locations: newLocs });
  };
  const removeLocation = (idx: number) => {
    const locId = world.locations[idx].id;
    if (locId === world.startLocationId) return toast.warning('Không thể xoá địa điểm bắt đầu!');
    setWorld({ ...world, locations: world.locations.filter((_, i) => i !== idx) });
  };

  // --- Xử lý NPC ---
  const addEntity = () => {
    const newEnt: Entity = { id: newId(), name: 'NPC mới', role: 'npc', description: '', traits: [] };
    setWorld({ ...world, entities: [...world.entities, newEnt] });
  };
  const updateEntity = (idx: number, key: keyof Entity, val: any) => {
    const newEnts = [...world.entities];
    newEnts[idx] = { ...newEnts[idx], [key]: val };
    setWorld({ ...world, entities: newEnts });
  };
  const removeEntity = (idx: number) => {
    setWorld({ ...world, entities: world.entities.filter((_, i) => i !== idx) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-text-2 hover:text-text transition-colors">
          <ArrowLeft size={18} /> Về trang chủ
        </button>
        <button onClick={handleSave} className="flex items-center gap-2 bg-success hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Save size={18} /> Lưu thay đổi
        </button>
      </div>

      <div className="flex border-b border-border">
        {['info', 'locations', 'entities'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${tab === t ? 'border-accent text-accent' : 'border-transparent text-text-2 hover:text-text'}`}
          >
            {t === 'info' ? 'Thông tin chung' : t === 'locations' ? 'Địa điểm' : 'NPC / Thực thể'}
          </button>
        ))}
      </div>

      <div className="bg-bg-2 p-6 rounded-xl border border-border">
        {/* TAB INFO */}
        {tab === 'info' && (
          <div className="space-y-6">
            
            {/* Hàng 1: Tên & Địa điểm bắt đầu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-2 mb-1">Tên thế giới</label>
                <input type="text" value={world.name} onChange={e => setWorld({...world, name: e.target.value})} className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 text-text focus:ring-2 focus:ring-accent outline-none" />
              </div>
              <div>
                <label className="block text-sm text-text-2 mb-1">Địa điểm bắt đầu</label>
                <select value={world.startLocationId} onChange={e => setWorld({...world, startLocationId: e.target.value})} className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 text-text focus:ring-2 focus:ring-accent outline-none">
                  <option value="">-- Chọn địa điểm --</option>
                  {world.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            </div>

            {/* Hàng 2: 3 Thiết lập mới */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-bg-3/50 border border-border rounded-lg">
              <div>
                <label className="block text-sm text-accent font-semibold mb-1">Thể loại</label>
                <input type="text" value={world.genre || ''} onChange={e => setWorld({...world, genre: e.target.value})} className="w-full bg-bg-2 border border-border rounded-lg px-3 py-2 text-text text-sm focus:ring-2 focus:ring-accent outline-none" placeholder="VD: Tiên hiệp, Kinh dị..." />
              </div>
              <div>
                <label className="block text-sm text-accent font-semibold mb-1">Không khí / Tông giọng</label>
                <input type="text" value={world.tone || ''} onChange={e => setWorld({...world, tone: e.target.value})} className="w-full bg-bg-2 border border-border rounded-lg px-3 py-2 text-text text-sm focus:ring-2 focus:ring-accent outline-none" placeholder="VD: U tối, hài hước..." />
              </div>
              <div>
                <label className="block text-sm text-accent font-semibold mb-1">Mức độ siêu nhiên</label>
                <input type="text" value={world.magicLevel || ''} onChange={e => setWorld({...world, magicLevel: e.target.value})} className="w-full bg-bg-2 border border-border rounded-lg px-3 py-2 text-text text-sm focus:ring-2 focus:ring-accent outline-none" placeholder="VD: Phép thuật tràn lan..." />
              </div>
            </div>

            {/* Hàng 3: Mô tả & Lore */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-2 mb-1">Mô tả ngắn (Hiển thị ở trang chủ)</label>
                <textarea value={world.description} onChange={e => setWorld({...world, description: e.target.value})} className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 text-text focus:ring-2 focus:ring-accent outline-none" rows={4} />
              </div>
              <div>
                <label className="block text-sm text-text-2 mb-1">Lịch sử / Bối cảnh (Lore)</label>
                <textarea value={world.lore} onChange={e => setWorld({...world, lore: e.target.value})} className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 text-text focus:ring-2 focus:ring-accent outline-none" rows={4} />
              </div>
            </div>

            {/* Hàng 4: Quy tắc & Thế lực */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-error/5 border border-error/20 rounded-lg">
              <div>
                <label className="block text-sm text-error font-semibold mb-1">Quy tắc thế giới (AI bắt buộc tuân thủ)</label>
                <textarea value={world.worldRules || ''} onChange={e => setWorld({...world, worldRules: e.target.value})} className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 text-text focus:ring-2 focus:ring-accent outline-none text-sm" rows={3} placeholder="VD: Không ai có thể hồi sinh. Cấm sử dụng vũ khí hạt nhân..." />
              </div>
              <div>
                <label className="block text-sm text-text-2 mb-1">Các thế lực / Bang phái chính</label>
                <textarea value={world.factions || ''} onChange={e => setWorld({...world, factions: e.target.value})} className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2 text-text focus:ring-2 focus:ring-accent outline-none text-sm" rows={3} placeholder="VD: Hội Pháp Sư, Quân đội Đế chế, Bang Hắc Long..." />
              </div>
            </div>

          </div>
        )}

        {/* TAB LOCATIONS */}
        {tab === 'locations' && (
          <div className="space-y-4">
            {world.locations.map((loc, i) => (
              <div key={loc.id} className="bg-bg-3 p-4 rounded-lg border border-border space-y-3 relative">
                <button onClick={() => removeLocation(i)} className="absolute top-3 right-3 text-error hover:bg-error/20 p-1.5 rounded"><Trash2 size={16}/></button>
                <input type="text" value={loc.name} onChange={e => updateLocation(i, 'name', e.target.value)} className="w-[80%] bg-bg-2 border border-border rounded px-2 py-1 font-semibold text-text focus:ring-1 focus:ring-accent outline-none" placeholder="Tên địa điểm" />
                <textarea value={loc.description} onChange={e => updateLocation(i, 'description', e.target.value)} className="w-full bg-bg-2 border border-border rounded px-2 py-1 text-sm text-text focus:ring-1 focus:ring-accent outline-none" placeholder="Mô tả..." rows={2} />
                <input type="text" value={loc.ambient || ''} onChange={e => updateLocation(i, 'ambient', e.target.value)} className="w-full bg-bg-2 border border-border rounded px-2 py-1 text-sm text-text focus:ring-1 focus:ring-accent outline-none" placeholder="Không khí (âm thanh, mùi hương...)" />
              </div>
            ))}
            <button onClick={addLocation} className="w-full py-3 border-2 border-dashed border-border rounded-lg text-text-2 hover:text-accent hover:border-accent flex items-center justify-center gap-2 transition-colors"><Plus size={18}/> Thêm địa điểm</button>
          </div>
        )}

        {/* TAB ENTITIES */}
        {tab === 'entities' && (
          <div className="space-y-4">
            {world.entities.map((ent, i) => (
              <div key={ent.id} className="bg-bg-3 p-4 rounded-lg border border-border space-y-3 relative">
                <button onClick={() => removeEntity(i)} className="absolute top-3 right-3 text-error hover:bg-error/20 p-1.5 rounded"><Trash2 size={16}/></button>
                <div className="flex gap-2 w-[80%]">
                  <input type="text" value={ent.name} onChange={e => updateEntity(i, 'name', e.target.value)} className="flex-1 bg-bg-2 border border-border rounded px-2 py-1 font-semibold text-text focus:ring-1 focus:ring-accent outline-none" placeholder="Tên NPC" />
                  <select value={ent.role} onChange={e => updateEntity(i, 'role', e.target.value)} className="bg-bg-2 border border-border rounded px-2 py-1 text-sm text-text focus:ring-1 focus:ring-accent outline-none">
                    <option value="npc">NPC</option>
                    <option value="creature">Sinh vật</option>
                    <option value="faction">Thế lực</option>
                  </select>
                </div>
                <textarea value={ent.description} onChange={e => updateEntity(i, 'description', e.target.value)} className="w-full bg-bg-2 border border-border rounded px-2 py-1 text-sm text-text focus:ring-1 focus:ring-accent outline-none" placeholder="Mô tả..." rows={2} />
                <input type="text" value={ent.traits.join(', ')} onChange={e => updateEntity(i, 'traits', e.target.value.split(',').map(s=>s.trim()))} className="w-full bg-bg-2 border border-border rounded px-2 py-1 text-sm text-text focus:ring-1 focus:ring-accent outline-none" placeholder="Tính cách (cách nhau bằng dấu phẩy)" />
                <select value={ent.locationId || ''} onChange={e => updateEntity(i, 'locationId', e.target.value)} className="w-full bg-bg-2 border border-border rounded px-2 py-1 text-sm text-text focus:ring-1 focus:ring-accent outline-none">
                  <option value="">-- Không ở đâu cả --</option>
                  {world.locations.map(l => <option key={l.id} value={l.id}>Đang ở: {l.name}</option>)}
                </select>
              </div>
            ))}
            <button onClick={addEntity} className="w-full py-3 border-2 border-dashed border-border rounded-lg text-text-2 hover:text-accent hover:border-accent flex items-center justify-center gap-2 transition-colors"><Plus size={18}/> Thêm thực thể</button>
          </div>
        )}
      </div>
    </div>
  );
}