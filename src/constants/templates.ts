import type { Template } from '../types';

/**
 * テンプレート設計ルール:
 * - 座標(x,y,w,h)は半畳(910mm)グリッド単位
 * - 重なりNG、隙間NG（長方形を完全に埋める）
 * - トイレ: 必ず 1×2（910×1820mm）
 * - 浴室・洗面脱衣室: 必ず隣り合わせ（辺を共有）
 * - バルコニー: 建物外周の最外側のみ、階段と隣接しない
 * - 階段: 廊下/ホール/LDKに面する、1F=2F同位置
 * - 動線: 玄関→廊下→各部屋、洗面→浴室
 */

export const TEMPLATES: Template[] = [
  {
    id: '2ldk-25',
    name: '2LDK（平屋）',
    description: '夫婦2人向け。LDK16畳+洋室2部屋',
    thumbnail: '',
    floors: [
      {
        // 10×7 footprint
        level: 1,
        rooms: [
          //--- 北側 y:0-4 ---
          { type: 'bathroom',     label: '浴室',       x: 0, y: 0, width: 2, height: 2 },  // (0-2, 0-2)
          { type: 'washroom',     label: '洗面脱衣室',  x: 0, y: 2, width: 2, height: 2 },  // (0-2, 2-4) ← 浴室と隣接
          { type: 'ldk',          label: 'LDK',        x: 2, y: 0, width: 8, height: 4 },  // (2-10, 0-4)
          //--- 廊下 y:4-5 ---
          { type: 'hallway',      label: '廊下',        x: 0, y: 4, width: 10, height: 1 }, // (0-10, 4-5)
          //--- 南側 y:5-7 ---
          { type: 'entrance',     label: '玄関',        x: 0, y: 5, width: 2, height: 2 },  // (0-2, 5-7)
          { type: 'toilet',       label: 'トイレ',      x: 2, y: 5, width: 1, height: 2 },  // (2-3, 5-7) ← 1×2
          { type: 'western_room', label: '洋室1',       x: 3, y: 5, width: 4, height: 2 },  // (3-7, 5-7)
          { type: 'western_room', label: '洋室2',       x: 7, y: 5, width: 3, height: 2 },  // (7-10, 5-7)
        ],
      },
    ],
  },
  {
    id: '3ldk-30',
    name: '3LDK（2階建て）',
    description: 'ファミリー向け。LDK16畳+主寝室+洋室+子供部屋',
    thumbnail: '',
    floors: [
      {
        // 1F: 10×7 footprint
        level: 1,
        rooms: [
          //--- 北側 y:0-4 ---
          { type: 'bathroom',       label: '浴室',           x: 0, y: 0, width: 2, height: 2 },  // (0-2, 0-2)
          { type: 'washroom',       label: '洗面脱衣室',      x: 0, y: 2, width: 2, height: 2 },  // (0-2, 2-4) ← 浴室と隣接
          { type: 'ldk',            label: 'LDK',            x: 2, y: 0, width: 8, height: 4 },  // (2-10, 0-4)
          //--- 廊下 y:4-5 （階段はここに面する）---
          { type: 'hallway',        label: '廊下',            x: 0, y: 4, width: 10, height: 1 }, // (0-10, 4-5)
          //--- 南側 y:5-7 ---
          { type: 'entrance',       label: '玄関',            x: 0, y: 5, width: 2, height: 2 },  // (0-2, 5-7)
          { type: 'toilet',         label: 'トイレ',           x: 2, y: 5, width: 1, height: 2 },  // (2-3, 5-7) ← 1×2
          { type: 'shoes_cloak',    label: 'シューズクローク',  x: 3, y: 5, width: 2, height: 2 },  // (3-5, 5-7)
          { type: 'hall',           label: 'ホール',           x: 5, y: 5, width: 3, height: 2 },  // (5-8, 5-7)
          { type: 'stairs_turning', label: '階段',             x: 8, y: 5, width: 2, height: 2 },  // (8-10, 5-7) ← 廊下(y:4-5)に面する
        ],
      },
      {
        // 2F: 10×8 footprint（バルコニー分の張り出し含む）
        level: 2,
        rooms: [
          //--- 北側 y:0-4 ---
          { type: 'master_bedroom', label: '主寝室',     x: 0, y: 0, width: 4, height: 4 },  // (0-4, 0-4)
          { type: 'walk_in_closet', label: 'WIC',        x: 4, y: 0, width: 2, height: 2 },  // (4-6, 0-2) ← 主寝室に隣接
          { type: 'toilet',         label: 'トイレ',      x: 4, y: 2, width: 1, height: 2 },  // (4-5, 2-4) ← 1×2
          { type: 'storage',        label: '収納',        x: 5, y: 2, width: 1, height: 2 },  // (5-6, 2-4)
          { type: 'western_room',   label: '洋室',        x: 6, y: 0, width: 4, height: 4 },  // (6-10, 0-4)
          //--- 廊下 y:4-5 ---
          { type: 'hallway',        label: '廊下',         x: 0, y: 4, width: 10, height: 1 }, // (0-10, 4-5)
          //--- 南側 y:5-8 ---
          { type: 'children_room',  label: '子供部屋',     x: 0, y: 5, width: 8, height: 2 },  // (0-8, 5-7)
          { type: 'stairs_turning', label: '階段',          x: 8, y: 5, width: 2, height: 2 },  // (8-10, 5-7) ← 1Fと同位置、廊下に面する
          { type: 'balcony',        label: 'バルコニー',    x: 0, y: 7, width: 8, height: 1 },  // (0-8, 7-8) ← 最外周南端、階段と隣接しない
          { type: 'storage',        label: '納戸',          x: 8, y: 7, width: 2, height: 1 },  // (8-10, 7-8) ← 階段とバルコニーを分離
        ],
      },
    ],
  },
  {
    id: '4ldk-35',
    name: '4LDK（2階建て）',
    description: 'ゆとりの4部屋。LDK16畳+和室+洋室2+子供部屋',
    thumbnail: '',
    floors: [
      {
        // 1F: 10×8 footprint
        level: 1,
        rooms: [
          //--- 北側 y:0-4 ---
          { type: 'bathroom',       label: '浴室',           x: 0, y: 0, width: 2, height: 2 },  // (0-2, 0-2)
          { type: 'washroom',       label: '洗面脱衣室',      x: 0, y: 2, width: 2, height: 2 },  // (0-2, 2-4) ← 浴室と隣接
          { type: 'ldk',            label: 'LDK',            x: 2, y: 0, width: 8, height: 4 },  // (2-10, 0-4)
          //--- 廊下 y:4-5 ---
          { type: 'hallway',        label: '廊下',            x: 0, y: 4, width: 10, height: 1 }, // (0-10, 4-5)
          //--- 南側 y:5-8 ---
          { type: 'entrance',       label: '玄関',            x: 0, y: 5, width: 2, height: 3 },  // (0-2, 5-8)
          { type: 'toilet',         label: 'トイレ',           x: 2, y: 5, width: 1, height: 2 },  // (2-3, 5-7) ← 1×2
          { type: 'storage',        label: '収納',             x: 2, y: 7, width: 1, height: 1 },  // (2-3, 7-8)
          { type: 'japanese_room',  label: '和室',             x: 3, y: 5, width: 4, height: 3 },  // (3-7, 5-8)
          { type: 'pantry',         label: 'パントリー',       x: 7, y: 5, width: 1, height: 3 },  // (7-8, 5-8)
          { type: 'stairs_turning', label: '階段',             x: 8, y: 5, width: 2, height: 2 },  // (8-10, 5-7) ← 廊下に面する
          { type: 'shoes_cloak',    label: 'シューズクローク',  x: 8, y: 7, width: 2, height: 1 },  // (8-10, 7-8)
        ],
      },
      {
        // 2F: 10×8 footprint
        level: 2,
        rooms: [
          //--- 北側 y:0-4 ---
          { type: 'master_bedroom', label: '主寝室',     x: 0, y: 0, width: 4, height: 4 },  // (0-4, 0-4)
          { type: 'walk_in_closet', label: 'WIC',        x: 4, y: 0, width: 2, height: 2 },  // (4-6, 0-2) ← 主寝室に隣接
          { type: 'toilet',         label: 'トイレ',      x: 4, y: 2, width: 1, height: 2 },  // (4-5, 2-4) ← 1×2
          { type: 'storage',        label: '収納',        x: 5, y: 2, width: 1, height: 2 },  // (5-6, 2-4)
          { type: 'western_room',   label: '洋室1',       x: 6, y: 0, width: 4, height: 4 },  // (6-10, 0-4)
          //--- 廊下 y:4-5 ---
          { type: 'hallway',        label: '廊下',         x: 0, y: 4, width: 10, height: 1 }, // (0-10, 4-5)
          //--- 南側 y:5-8 ---
          { type: 'children_room',  label: '子供部屋',     x: 0, y: 5, width: 4, height: 2 },  // (0-4, 5-7)
          { type: 'western_room',   label: '洋室2',        x: 4, y: 5, width: 4, height: 2 },  // (4-8, 5-7)
          { type: 'stairs_turning', label: '階段',          x: 8, y: 5, width: 2, height: 2 },  // (8-10, 5-7) ← 1Fと同位置、廊下に面する
          { type: 'balcony',        label: 'バルコニー',     x: 0, y: 7, width: 8, height: 1 },  // (0-8, 7-8) ← 最外周南端、階段と隣接しない
          { type: 'storage',        label: '納戸',          x: 8, y: 7, width: 2, height: 1 },  // (8-10, 7-8) ← 階段とバルコニーを分離
        ],
      },
    ],
  },
  {
    id: '5ldk-40',
    name: '5LDK（3階建て）',
    description: '二世帯対応。LDK16畳+和室+主寝室+洋室2+子供部屋',
    thumbnail: '',
    floors: [
      {
        // 1F: 10×7 footprint — 玄関・水回り・和室
        level: 1,
        rooms: [
          //--- 北側 y:0-4 ---
          { type: 'bathroom',       label: '浴室',           x: 0, y: 0, width: 2, height: 2 },  // (0-2, 0-2)
          { type: 'washroom',       label: '洗面脱衣室',      x: 0, y: 2, width: 2, height: 2 },  // (0-2, 2-4) ← 浴室と隣接
          { type: 'ldk',            label: 'LDK',            x: 2, y: 0, width: 8, height: 4 },  // (2-10, 0-4)
          //--- 廊下 y:4-5 ---
          { type: 'hallway',        label: '廊下',            x: 0, y: 4, width: 10, height: 1 }, // (0-10, 4-5)
          //--- 南側 y:5-7 ---
          { type: 'entrance',       label: '玄関',            x: 0, y: 5, width: 2, height: 2 },  // (0-2, 5-7)
          { type: 'toilet',         label: 'トイレ',           x: 2, y: 5, width: 1, height: 2 },  // (2-3, 5-7) ← 1×2
          { type: 'japanese_room',  label: '和室',             x: 3, y: 5, width: 5, height: 2 },  // (3-8, 5-7)
          { type: 'stairs_turning', label: '階段',             x: 8, y: 5, width: 2, height: 2 },  // (8-10, 5-7) ← 廊下に面する
        ],
      },
      {
        // 2F: 10×7 footprint — LDK2・主寝室
        level: 2,
        rooms: [
          //--- 北側 y:0-4 ---
          { type: 'master_bedroom', label: '主寝室',     x: 0, y: 0, width: 4, height: 4 },  // (0-4, 0-4)
          { type: 'walk_in_closet', label: 'WIC',        x: 4, y: 0, width: 2, height: 2 },  // (4-6, 0-2) ← 主寝室に隣接
          { type: 'toilet',         label: 'トイレ',      x: 4, y: 2, width: 1, height: 2 },  // (4-5, 2-4) ← 1×2
          { type: 'storage',        label: '収納',        x: 5, y: 2, width: 1, height: 2 },  // (5-6, 2-4)
          { type: 'western_room',   label: '洋室1',       x: 6, y: 0, width: 4, height: 4 },  // (6-10, 0-4)
          //--- 廊下 y:4-5 ---
          { type: 'hallway',        label: '廊下',         x: 0, y: 4, width: 10, height: 1 }, // (0-10, 4-5)
          //--- 南側 y:5-7 ---
          { type: 'western_room',   label: '洋室2',        x: 0, y: 5, width: 4, height: 2 },  // (0-4, 5-7)
          { type: 'laundry',        label: 'ランドリー',    x: 4, y: 5, width: 2, height: 2 },  // (4-6, 5-7)
          { type: 'hall',           label: 'ホール',        x: 6, y: 5, width: 2, height: 2 },  // (6-8, 5-7)
          { type: 'stairs_turning', label: '階段',          x: 8, y: 5, width: 2, height: 2 },  // (8-10, 5-7) ← 同位置
        ],
      },
      {
        // 3F: 10×8 footprint — 子供部屋・書斎・バルコニー
        level: 3,
        rooms: [
          //--- 北側 y:0-4 ---
          { type: 'children_room',  label: '子供部屋1',    x: 0, y: 0, width: 5, height: 4 },  // (0-5, 0-4)
          { type: 'children_room',  label: '子供部屋2',    x: 5, y: 0, width: 5, height: 4 },  // (5-10, 0-4)
          //--- 廊下 y:4-5 ---
          { type: 'hallway',        label: '廊下',         x: 0, y: 4, width: 10, height: 1 }, // (0-10, 4-5)
          //--- 南側 y:5-8 ---
          { type: 'study',          label: '書斎',         x: 0, y: 5, width: 3, height: 2 },  // (0-3, 5-7)
          { type: 'toilet',         label: 'トイレ',        x: 3, y: 5, width: 1, height: 2 },  // (3-4, 5-7) ← 1×2
          { type: 'storage',        label: '納戸',          x: 4, y: 5, width: 4, height: 2 },  // (4-8, 5-7)
          { type: 'stairs_turning', label: '階段',          x: 8, y: 5, width: 2, height: 2 },  // (8-10, 5-7) ← 同位置
          { type: 'balcony',        label: 'バルコニー',     x: 0, y: 7, width: 8, height: 1 },  // (0-8, 7-8) ← 最外周、階段と隣接しない
          { type: 'storage',        label: '収納',          x: 8, y: 7, width: 2, height: 1 },  // (8-10, 7-8) ← 階段とバルコニー分離
        ],
      },
    ],
  },
];
