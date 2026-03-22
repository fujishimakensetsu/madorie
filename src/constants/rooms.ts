import type { RoomDefinition } from '../types';

export const ROOM_DEFINITIONS: RoomDefinition[] = [
  // ── 居室系 ──（最小サイズ 0.5 = 455mm）
  { type: 'ldk',            label: 'LDK',             category: 'living',  defaultWidth: 8, defaultHeight: 6, minWidth: 0.5, minHeight: 0.5, color: '#FFF3E0', icon: 'sofa' },
  { type: 'living',         label: 'リビング',          category: 'living',  defaultWidth: 6, defaultHeight: 4, minWidth: 0.5, minHeight: 0.5, color: '#FFF8E1', icon: 'sofa' },
  { type: 'dining',         label: 'ダイニング',        category: 'living',  defaultWidth: 4, defaultHeight: 4, minWidth: 0.5, minHeight: 0.5, color: '#FFFDE7', icon: 'utensils' },
  { type: 'kitchen',        label: 'キッチン',          category: 'living',  defaultWidth: 4, defaultHeight: 3, minWidth: 0.5, minHeight: 0.5, color: '#F1F8E9', icon: 'chef-hat' },
  { type: 'master_bedroom', label: '主寝室',            category: 'living',  defaultWidth: 4, defaultHeight: 4, minWidth: 0.5, minHeight: 0.5, color: '#E8EAF6', icon: 'bed-double' },
  { type: 'western_room',   label: '洋室',             category: 'living',  defaultWidth: 4, defaultHeight: 3, minWidth: 0.5, minHeight: 0.5, color: '#E3F2FD', icon: 'bed-single' },
  { type: 'japanese_room',  label: '和室',             category: 'living',  defaultWidth: 4, defaultHeight: 4, minWidth: 0.5, minHeight: 0.5, color: '#E8F5E9', icon: 'lamp-floor' },
  { type: 'children_room',  label: '子供部屋',          category: 'living',  defaultWidth: 3, defaultHeight: 3, minWidth: 0.5, minHeight: 0.5, color: '#E1F5FE', icon: 'baby' },
  { type: 'study',          label: '書斎',             category: 'living',  defaultWidth: 3, defaultHeight: 2, minWidth: 0.5, minHeight: 0.5, color: '#EDE7F6', icon: 'book-open' },

  // ── 水回り系 ──
  { type: 'bathroom',       label: '浴室',             category: 'water',   defaultWidth: 2, defaultHeight: 2, minWidth: 0.5, minHeight: 0.5, color: '#E0F7FA', icon: 'bath' },
  { type: 'washroom',       label: '洗面脱衣室',        category: 'water',   defaultWidth: 2, defaultHeight: 2, minWidth: 0.5, minHeight: 0.5, color: '#E0F2F1', icon: 'droplets' },
  { type: 'toilet',         label: 'トイレ',            category: 'water',   defaultWidth: 1, defaultHeight: 2, minWidth: 0.5, minHeight: 0.5, color: '#F3E5F5', icon: 'toilet' },
  { type: 'laundry',        label: 'ランドリー',        category: 'water',   defaultWidth: 2, defaultHeight: 2, minWidth: 0.5, minHeight: 0.5, color: '#E0F7FA', icon: 'washing-machine' },

  // ── 収納系 ──
  { type: 'walk_in_closet', label: 'WIC',              category: 'storage', defaultWidth: 2, defaultHeight: 3, minWidth: 0.5, minHeight: 0.5, color: '#FBE9E7', icon: 'shirt' },
  { type: 'shoes_cloak',    label: 'シューズクローク',    category: 'storage', defaultWidth: 2, defaultHeight: 2, minWidth: 0.5, minHeight: 0.5, color: '#EFEBE9', icon: 'footprints' },
  { type: 'pantry',         label: 'パントリー',        category: 'storage', defaultWidth: 2, defaultHeight: 2, minWidth: 0.5, minHeight: 0.5, color: '#FFF3E0', icon: 'package' },
  { type: 'storage',        label: '納戸',             category: 'storage', defaultWidth: 2, defaultHeight: 2, minWidth: 0.5, minHeight: 0.5, color: '#ECEFF1', icon: 'warehouse' },

  // ── その他 ──
  { type: 'entrance',       label: '玄関',             category: 'other',   defaultWidth: 2, defaultHeight: 2, minWidth: 0.5, minHeight: 0.5, color: '#FBE9E7', icon: 'door-open' },
  { type: 'hall',           label: 'ホール',           category: 'other',   defaultWidth: 3, defaultHeight: 2, minWidth: 0.5, minHeight: 0.5, color: '#F5F0E8', icon: 'square' },
  { type: 'hallway',        label: '廊下',             category: 'other',   defaultWidth: 4, defaultHeight: 1, minWidth: 0.5, minHeight: 0.5, color: '#FAFAFA', icon: 'move-horizontal' },
  { type: 'stairs_turning',  label: '階段(回り)',        category: 'other',   defaultWidth: 2, defaultHeight: 2, minWidth: 2,   minHeight: 2,   color: '#F5F5F5', icon: 'stairs', resizable: false },
  { type: 'stairs_straight', label: '階段(ストレート)',  category: 'other',   defaultWidth: 1, defaultHeight: 4, minWidth: 1,   minHeight: 4,   color: '#F5F5F5', icon: 'stairs', resizable: false },
  { type: 'stairs_l',        label: '階段(L字)',        category: 'other',   defaultWidth: 2, defaultHeight: 3, minWidth: 2,   minHeight: 3,   color: '#F5F5F5', icon: 'stairs', resizable: false },
  { type: 'balcony',        label: 'バルコニー',        category: 'other',   defaultWidth: 6, defaultHeight: 2, minWidth: 0.5, minHeight: 0.5, color: '#DCEDC8', icon: 'fence' },
  { type: 'deck',           label: 'ウッドデッキ',      category: 'other',   defaultWidth: 4, defaultHeight: 3, minWidth: 0.5, minHeight: 0.5, color: '#D7CCC8', icon: 'trees' },
  { type: 'garage',         label: 'ガレージ',          category: 'other',   defaultWidth: 6, defaultHeight: 4, minWidth: 0.5, minHeight: 0.5, color: '#CFD8DC', icon: 'car' },
];

/** カテゴリ表示名 */
export const CATEGORY_LABELS: Record<string, string> = {
  living: '居室',
  water: '水回り',
  storage: '収納',
  other: 'その他',
};

/** 階段タイプかどうか */
export function isStairsType(type: string): boolean {
  return type.startsWith('stairs_');
}

/** RoomTypeからRoomDefinitionを検索 */
export function getRoomDefinition(type: string): RoomDefinition | undefined {
  return ROOM_DEFINITIONS.find((d) => d.type === type);
}
