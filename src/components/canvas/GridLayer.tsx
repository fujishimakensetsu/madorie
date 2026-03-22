import { useMemo } from 'react';
import { Layer, Line } from 'react-konva';
import { GRID_PX, HALF_GRID_PX } from '../../constants/grid';
import { useUIStore } from '../../stores/useUIStore';

interface GridLayerProps {
  visible: boolean;
  stageWidth: number;
  stageHeight: number;
}

export function GridLayer({ visible, stageWidth, stageHeight }: GridLayerProps) {
  const zoom = useUIStore((s) => s.zoom);
  const panOffset = useUIStore((s) => s.panOffset);

  const lines = useMemo(() => {
    if (!visible) return [];

    const result: React.JSX.Element[] = [];

    // 半グリッド（455mm）単位で範囲を計算
    const startHX = Math.floor(-panOffset.x / (HALF_GRID_PX * zoom)) - 2;
    const endHX = Math.ceil((stageWidth - panOffset.x) / (HALF_GRID_PX * zoom)) + 2;
    const startHY = Math.floor(-panOffset.y / (HALF_GRID_PX * zoom)) - 2;
    const endHY = Math.ceil((stageHeight - panOffset.y) / (HALF_GRID_PX * zoom)) + 2;

    const topPx = startHY * HALF_GRID_PX;
    const bottomPx = endHY * HALF_GRID_PX;
    const leftPx = startHX * HALF_GRID_PX;
    const rightPx = endHX * HALF_GRID_PX;

    // 縦線
    for (let i = startHX; i <= endHX; i++) {
      const xPx = i * HALF_GRID_PX;
      const is910 = i % 2 === 0; // 偶数 = 910mmピッチ
      result.push(
        <Line
          key={`v-${i}`}
          points={[xPx, topPx, xPx, bottomPx]}
          stroke={is910 ? '#D0D0D0' : '#E8E8E8'}
          strokeWidth={is910 ? 0.8 : 0.5}
          dash={is910 ? undefined : [4, 4]}
          listening={false}
        />,
      );
    }

    // 横線
    for (let j = startHY; j <= endHY; j++) {
      const yPx = j * HALF_GRID_PX;
      const is910 = j % 2 === 0;
      result.push(
        <Line
          key={`h-${j}`}
          points={[leftPx, yPx, rightPx, yPx]}
          stroke={is910 ? '#D0D0D0' : '#E8E8E8'}
          strokeWidth={is910 ? 0.8 : 0.5}
          dash={is910 ? undefined : [4, 4]}
          listening={false}
        />,
      );
    }

    return result;
  }, [visible, stageWidth, stageHeight, zoom, panOffset]);

  if (!visible) return null;

  return (
    <Layer id="grid-layer" listening={false}>
      {lines}
    </Layer>
  );
}
