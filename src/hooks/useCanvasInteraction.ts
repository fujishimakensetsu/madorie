import { useCallback } from 'react';
import type Konva from 'konva';
import { useUIStore } from '../stores/useUIStore';
import { ZOOM_STEP } from '../constants/grid';

/** キャンバスのパン・ズーム操作を管理するフック */
export function useCanvasInteraction() {
  const zoom = useUIStore((s) => s.zoom);
  const setZoom = useUIStore((s) => s.setZoom);
  const panOffset = useUIStore((s) => s.panOffset);
  const setPanOffset = useUIStore((s) => s.setPanOffset);

  /** マウスホイールでズーム */
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = e.target.getStage();
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newZoom = zoom + direction * ZOOM_STEP;

      // ズーム中心をマウス位置に合わせる
      const mousePointTo = {
        x: (pointer.x - panOffset.x) / zoom,
        y: (pointer.y - panOffset.y) / zoom,
      };

      const clampedZoom = Math.max(0.3, Math.min(2.5, newZoom));

      const newPos = {
        x: pointer.x - mousePointTo.x * clampedZoom,
        y: pointer.y - mousePointTo.y * clampedZoom,
      };

      setZoom(clampedZoom);
      setPanOffset(newPos);
    },
    [zoom, panOffset, setZoom, setPanOffset],
  );

  /** ズームイン */
  const zoomIn = useCallback(() => {
    setZoom(zoom + ZOOM_STEP);
  }, [zoom, setZoom]);

  /** ズームアウト */
  const zoomOut = useCallback(() => {
    setZoom(zoom - ZOOM_STEP);
  }, [zoom, setZoom]);

  /** ズームリセット */
  const zoomReset = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 20, y: 20 });
  }, [setZoom, setPanOffset]);

  return {
    zoom,
    panOffset,
    setPanOffset,
    handleWheel,
    zoomIn,
    zoomOut,
    zoomReset,
  };
}
