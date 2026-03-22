/** 部屋タイプ */
export type RoomType =
  | 'ldk'
  | 'living'
  | 'dining'
  | 'kitchen'
  | 'master_bedroom'
  | 'western_room'
  | 'japanese_room'
  | 'children_room'
  | 'study'
  | 'bathroom'
  | 'washroom'
  | 'toilet'
  | 'laundry'
  | 'walk_in_closet'
  | 'shoes_cloak'
  | 'pantry'
  | 'storage'
  | 'entrance'
  | 'hall'
  | 'hallway'
  | 'stairs_turning'
  | 'stairs_straight'
  | 'stairs_l'
  | 'balcony'
  | 'deck'
  | 'garage';

/** 部屋カテゴリ */
export type RoomCategory = 'living' | 'water' | 'storage' | 'other';

/** 部屋パーツ */
export interface Room {
  id: string;
  type: RoomType;
  label: string;
  x: number;       // グリッド座標X
  y: number;       // グリッド座標Y
  width: number;   // グリッド幅（半畳単位）
  height: number;  // グリッド高さ（半畳単位）
  rotation: 0 | 90 | 180 | 270;
  flipH: boolean;   // 横反転
  flipV: boolean;   // 縦反転
  color: string;
  floorLevel: number;
}

/** 部屋パーツ定義マスター */
export interface RoomDefinition {
  type: RoomType;
  label: string;
  category: RoomCategory;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  color: string;
  icon: string;
  resizable?: boolean; // false の場合リサイズ不可（デフォルトtrue）
}

/** ドア */
export interface Door {
  id: string;
  type: 'sliding' | 'hinged';
  x: number;
  y: number;
  width: number;
  wallSide: 'top' | 'bottom' | 'left' | 'right';
  hingeSide?: 'left' | 'right';
  parentRoomId: string;
}

/** 窓 */
export interface FloorWindow {
  id: string;
  type: 'double_sliding' | 'fix' | 'bay';
  x: number;
  y: number;
  width: number;
  wallSide: 'top' | 'bottom' | 'left' | 'right';
  parentRoomId: string;
}
