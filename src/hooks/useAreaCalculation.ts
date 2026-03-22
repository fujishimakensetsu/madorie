import { useMemo } from 'react';
import { useFloorPlanStore } from '../stores/useFloorPlanStore';
import { calculateRoomArea, calculateTotalArea } from '../utils/area';
import type { AreaInfo } from '../types';

/** 面積計算の結果を返すフック */
export function useAreaCalculation() {
  const floorPlan = useFloorPlanStore((s) => s.floorPlan);

  const allRooms = useMemo(
    () => floorPlan.floors.flatMap((f) => f.rooms),
    [floorPlan],
  );

  /** 延床面積 */
  const totalArea: AreaInfo = useMemo(
    () => calculateTotalArea(allRooms),
    [allRooms],
  );

  /** 階別面積 */
  const floorAreas: { level: number; area: AreaInfo }[] = useMemo(
    () =>
      floorPlan.floors.map((f) => ({
        level: f.level,
        area: calculateTotalArea(f.rooms),
      })),
    [floorPlan],
  );

  /** 個別部屋面積を取得 */
  const getRoomAreaById = (roomId: string): AreaInfo => {
    const room = allRooms.find((r) => r.id === roomId);
    if (!room) return { sqm: 0, tsubo: 0, jou: 0 };
    return calculateRoomArea(room);
  };

  return {
    totalArea,
    floorAreas,
    getRoomAreaById,
  };
}
