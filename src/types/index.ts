export type {
  RoomType,
  RoomCategory,
  Room,
  RoomDefinition,
  Door,
  FloorWindow,
} from './room';

export type {
  TemplateRoom,
  TemplateFloor,
  Template,
} from './template';

/** 階 */
export interface Floor {
  id: string;
  level: number;
  rooms: import('./room').Room[];
  doors: import('./room').Door[];
  windows: import('./room').FloorWindow[];
}

/** 間取り全体 */
export interface FloorPlan {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  floors: Floor[];
  metadata: {
    templateId?: string;
    totalArea: number;
    totalTsubo: number;
  };
}

/** 面積情報 */
export interface AreaInfo {
  sqm: number;
  tsubo: number;
  jou: number;
}
