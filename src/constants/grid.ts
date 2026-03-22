/** 1グリッド = 910mm（半畳） */
export const GRID_MM = 910;

/** Canvas上の1グリッドのピクセル数（デフォルトズーム時） */
export const GRID_PX = 40;

/** 半グリッド = 455mm */
export const HALF_GRID_MM = 455;
export const HALF_GRID_PX = GRID_PX / 2; // 20px

/** スナップ単位（455mm = 半グリッド） */
export const SNAP_PX = HALF_GRID_PX;

/** ズーム範囲 */
export const MIN_ZOOM = 0.3;
export const MAX_ZOOM = 2.5;
export const ZOOM_STEP = 0.1;

/** デフォルトのキャンバスサイズ（グリッド数） */
export const CANVAS_GRID_WIDTH = 30;
export const CANVAS_GRID_HEIGHT = 24;
