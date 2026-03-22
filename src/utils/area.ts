import { GRID_MM } from '../constants/grid';
import type { AreaInfo, Room, RoomType } from '../types';

const SQM_PER_TSUBO = 3.30579;
const SQM_PER_JOU = 1.62; // 中京間基準

/** 延床面積から除外する部屋タイプ */
const EXCLUDED_TYPES: RoomType[] = ['balcony', 'deck', 'garage'];

/** 0.25刻みに丸める */
function roundToQuarter(value: number): number {
  return Math.round(value * 4) / 4;
}

/** 部屋の実グリッド数を取得（L字階段は特殊） */
function getRoomGridCount(room: Room): number {
  if (room.type === 'stairs_l') {
    // L字: 1×3 + 1×1 = 4グリッド
    return 4;
  }
  return room.width * room.height;
}

/** 部屋の面積を計算（0.25刻み） */
export function calculateRoomArea(room: Room): AreaInfo {
  const gridCount = getRoomGridCount(room);
  const sqm = (gridCount * GRID_MM * GRID_MM) / 1_000_000;
  return {
    sqm: roundToQuarter(sqm),
    tsubo: roundToQuarter(sqm / SQM_PER_TSUBO),
    jou: roundToQuarter(sqm / SQM_PER_JOU),
  };
}

/** 部屋リストの合計面積を計算（バルコニー・デッキ・ガレージ除外、0.25刻み） */
export function calculateTotalArea(rooms: Room[]): AreaInfo {
  const targetRooms = rooms.filter((r) => !EXCLUDED_TYPES.includes(r.type));
  const totalSqm = targetRooms.reduce((sum, room) => {
    const gridCount = getRoomGridCount(room);
    return sum + (gridCount * GRID_MM * GRID_MM) / 1_000_000;
  }, 0);
  return {
    sqm: roundToQuarter(totalSqm),
    tsubo: roundToQuarter(totalSqm / SQM_PER_TSUBO),
    jou: roundToQuarter(totalSqm / SQM_PER_JOU),
  };
}

/** 面積のフォーマット表示 */
export function formatArea(value: number, unit: string): string {
  return `${value}${unit}`;
}
