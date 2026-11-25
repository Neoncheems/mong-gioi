import Dexie, { type Table } from 'dexie';
import type { World, Save } from '../types';

// Khởi tạo cơ sở dữ liệu IndexedDB chạy ngầm trong trình duyệt
export class MongGioiDB extends Dexie {
  worlds!: Table<World, string>;
  saves!: Table<Save, string>;

  constructor() {
    super('mong-gioi-db'); // Tên database
    this.version(1).stores({
      // Khai báo các trường có thể tìm kiếm/sắp xếp
      worlds: 'id, name, updatedAt, isPreset',
      saves: 'id, worldId, updatedAt',
    });
  }
}

export const db = new MongGioiDB();