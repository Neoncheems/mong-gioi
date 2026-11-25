import { nanoid } from 'nanoid';

// Hàm tạo ID ngẫu nhiên duy nhất (dùng cho World, Save, Message...)
export function newId(): string {
  return nanoid();
}