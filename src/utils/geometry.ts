import { GRID_PX, SNAP_PX } from '../constants/grid';

/** 値を半グリッド（455mm）単位にスナップ */
export function snapToGrid(value: number, gridSize: number = SNAP_PX): number {
  return Math.round(value / gridSize) * gridSize;
}

/** ピクセル座標をグリッド座標に変換（0.5単位） */
export function pxToGrid(px: number): number {
  return Math.round(px / SNAP_PX) * 0.5;
}

/** グリッド座標をピクセル座標に変換 */
export function gridToPx(grid: number): number {
  return grid * GRID_PX;
}

/** 2つの矩形が重なっているかチェック */
export function isOverlapping(
  r1: { x: number; y: number; width: number; height: number },
  r2: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y
  );
}
