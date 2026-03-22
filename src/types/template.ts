import type { RoomType } from './room';

/** テンプレート内の部屋データ（IDなし） */
export interface TemplateRoom {
  type: RoomType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** テンプレート内の階データ */
export interface TemplateFloor {
  level: number;
  rooms: TemplateRoom[];
}

/** テンプレート定義 */
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  floors: TemplateFloor[];
}
