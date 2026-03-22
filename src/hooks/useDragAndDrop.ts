import { useCallback } from 'react';
import type { RoomType } from '../types';
import { useFloorPlanStore } from '../stores/useFloorPlanStore';
import { useUIStore } from '../stores/useUIStore';
import { SNAP_PX } from '../constants/grid';

/** サイドバーからキャンバスへのドラッグ&ドロップを管理するフック */
export function useDragAndDrop() {
  const addRoom = useFloorPlanStore((s) => s.addRoom);
  const zoom = useUIStore((s) => s.zoom);
  const panOffset = useUIStore((s) => s.panOffset);
  const setDraggingFromPalette = useUIStore((s) => s.setDraggingFromPalette);

  /** パレットからドラッグ開始 */
  const handleDragStart = useCallback(
    (e: React.DragEvent, roomType: RoomType) => {
      e.dataTransfer.setData('roomType', roomType);
      e.dataTransfer.effectAllowed = 'copy';
      setDraggingFromPalette(true, roomType);
    },
    [setDraggingFromPalette],
  );

  /** キャンバス上でドラッグオーバー */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  /** キャンバスにドロップ */
  const handleDrop = useCallback(
    (e: React.DragEvent, canvasElement: HTMLElement | null) => {
      e.preventDefault();
      const roomType = e.dataTransfer.getData('roomType') as RoomType;
      if (!roomType || !canvasElement) {
        setDraggingFromPalette(false);
        return;
      }

      const rect = canvasElement.getBoundingClientRect();
      const pxX = (e.clientX - rect.left - panOffset.x) / zoom;
      const pxY = (e.clientY - rect.top - panOffset.y) / zoom;

      // 半グリッド（0.5単位）にスナップ
      const gridX = Math.round(pxX / SNAP_PX) * 0.5;
      const gridY = Math.round(pxY / SNAP_PX) * 0.5;

      addRoom(roomType, gridX, gridY);
      setDraggingFromPalette(false);
    },
    [addRoom, zoom, panOffset, setDraggingFromPalette],
  );

  /** ダブルクリック/タップでキャンバスの見える範囲の中央に配置 */
  const handleDoubleClickAdd = useCallback(
    (roomType: RoomType) => {
      // キャンバス要素の実際のサイズを取得
      const canvasEl = document.querySelector('.flex-1.overflow-hidden.relative.bg-white');
      const rect = canvasEl?.getBoundingClientRect();
      const viewW = rect ? rect.width : window.innerWidth;
      const viewH = rect ? rect.height : window.innerHeight;

      // 表示中央のピクセル座標をグリッド座標に変換
      const centerPxX = (viewW / 2 - panOffset.x) / zoom;
      const centerPxY = (viewH / 2 - panOffset.y) / zoom;

      const gridX = Math.round(centerPxX / SNAP_PX) * 0.5;
      const gridY = Math.round(centerPxY / SNAP_PX) * 0.5;

      addRoom(roomType, gridX, gridY);
    },
    [addRoom, zoom, panOffset],
  );

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDoubleClickAdd,
  };
}
