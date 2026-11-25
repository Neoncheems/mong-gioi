import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorlds } from '../store/useWorlds';
import { useToast } from '../store/useToast';
import { T } from '../utils/strings';
import { Plus, Upload, Play, Edit, Trash2, Download, Clock, User } from 'lucide-react';
import { CharacterEditor } from '../components/CharacterEditor';
import type { World } from '../types';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export function HomePage() {
  const { worlds, isLoading, init, create, remove, importWorld } = useWorlds();
  const [playingWorld, setPlayingWorld] = useState<World | null>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tự động lấy danh sách các ván chơi (saves) từ database
  const saves = useLiveQuery(() => db.saves.orderBy('updatedAt').reverse().toArray(), []) || [];

  useEffect(() => {
    init();
  }, []);

  const handleCreate = async () => {
    const w = await create({});
    navigate(`/world/${w.id}/edit`);
  };

  const handleDeleteWorld = async (id: string) => {
    if (window.confirm(T.home.confirmDeleteWorld)) {
      await remove(id);
      toast.success('Đã xoá thế giới');
    }
  };

  const handleDeleteSave = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xoá phiên chơi này? Không thể hoàn tác.')) {
      await db.saves.delete(id);
      toast.success('Đã xoá phiên chơi');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const w = JSON.parse(ev.target?.result as string);
        if (!w.name || !w.locations) throw new Error('File không đúng định dạng');
        await importWorld(w);
        toast.success('Nhập thế giới thành công!');
      } catch (err: any) {
        toast.error('Lỗi khi nhập file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExport = (world: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(world, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${world.name}.json`;
    a.click();
  };

  if (isLoading) return <div className="text-center py-20 text-text-2">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-10 pb-10">
      
      {/* PHẦN 1: CÁC VÁN CHƠI ĐANG DỞ (NẾU CÓ) */}
      {saves.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-accent flex items-center gap-2">
            <Clock size={20} /> {T.home.recentSaves}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {saves.map((s) => {
              const w = worlds.find(x => x.id === s.worldId);
              return (
                <div 
                  key={s.id} 
                  className="relative bg-bg-2 border border-border rounded-xl p-4 flex flex-col hover:border-success/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/play/${s.id}`)}
                >
                  <button 
                    onClick={(e) => handleDeleteSave(s.id, e)} 
                    className="absolute top-3 right-3 text-text-2 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Xoá ván chơi"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <h3 className="font-bold text-success truncate pr-6 mb-1">{s.name}</h3>
                  <p className="text-xs text-text-2 mb-3">Thế giới: {w?.name || 'Không rõ'}</p>
                  
                  <div className="text-sm text-text flex items-center gap-2 mb-1">
                    <User size={14} className="text-accent"/> {s.character.name}
                  </div>
                  <div className="text-xs text-text-2 flex items-center gap-2 mt-auto pt-3 border-t border-border">
                    <Clock size={12}/> Cập nhật: {new Date(s.updatedAt).toLocaleString('vi-VN')}
                  </div>
                  
                  <div className="mt-3 w-full bg-success/10 text-success text-center py-1.5 rounded text-sm font-medium group-hover:bg-success group-hover:text-white transition-colors">
                    Tiếp tục chơi
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PHẦN 2: DANH SÁCH THẾ GIỚI */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold">{T.home.yourWorlds}</h2>
          <div className="flex gap-2">
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-bg-3 hover:bg-bg-2 border border-border px-4 py-2 rounded-lg text-sm transition-colors">
              <Upload size={16} /> {T.home.importWorld}
            </button>
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
            
            <button onClick={handleCreate} className="flex items-center gap-2 bg-accent hover:bg-accent-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus size={16} /> {T.home.createWorld}
            </button>
          </div>
        </div>

        {worlds.length === 0 ? (
          <div className="text-center py-20 bg-bg-2 rounded-xl border border-border text-text-2">
            {T.home.noWorlds}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {worlds.map((w) => (
              <div key={w.id} className="bg-bg-2 border border-border rounded-xl p-5 flex flex-col hover:border-accent/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-text">{w.name}</h3>
                  {w.isPreset && <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Mẫu</span>}
                </div>
                <p className="text-sm text-text-2 line-clamp-3 mb-4 flex-1">{w.description || 'Chưa có mô tả.'}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border">
                  <button onClick={() => setPlayingWorld(w)} className="flex items-center gap-1 bg-accent hover:bg-accent-2 text-white px-3 py-1.5 rounded text-sm transition-colors">
                    <Play size={14} /> Chơi mới
                  </button>
                  <button onClick={() => navigate(`/world/${w.id}/edit`)} className="flex items-center gap-1 bg-bg-3 hover:bg-bg-2 border border-border px-3 py-1.5 rounded text-sm transition-colors">
                    <Edit size={14} /> Sửa
                  </button>
                  <button onClick={() => handleExport(w)} className="flex items-center gap-1 bg-bg-3 hover:bg-bg-2 border border-border px-3 py-1.5 rounded text-sm transition-colors" title="Xuất JSON">
                    <Download size={14} />
                  </button>
                  <button onClick={() => handleDeleteWorld(w.id)} className="flex items-center gap-1 bg-bg-3 hover:bg-error/20 border border-border text-error px-3 py-1.5 rounded text-sm transition-colors ml-auto">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hộp thoại tạo nhân vật */}
      {playingWorld && (
        <CharacterEditor world={playingWorld} onClose={() => setPlayingWorld(null)} />
      )}
    </div>
  );
}