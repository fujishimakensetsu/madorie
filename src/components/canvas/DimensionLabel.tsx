import { Group, Text, Line } from 'react-konva';
import { GRID_PX, GRID_MM } from '../../constants/grid';
import type { Room } from '../../types';

interface DimensionLabelProps {
  room: Room;
  visible: boolean;
}

/** 部屋の寸法線を表示するコンポーネント */
export function DimensionLabel({ room, visible }: DimensionLabelProps) {
  if (!visible) return null;

  const isLStairs = room.type === 'stairs_l';

  // L字階段は専用表示
  if (isLStairs) {
    return <LStairsDimension room={room} />;
  }

  const px = room.x * GRID_PX;
  const py = room.y * GRID_PX;
  const pw = room.width * GRID_PX;
  const ph = room.height * GRID_PX;

  // 寸法は回転前の元サイズで表示（storeで幅高が入れ替わるので現在値でOK）
  const widthMM = room.width * GRID_MM;
  const heightMM = room.height * GRID_MM;

  return (
    <Group>
      {/* 上辺の寸法（横幅） */}
      <Line
        points={[px, py - 10, px + pw, py - 10]}
        stroke="#666"
        strokeWidth={0.8}
        listening={false}
      />
      {/* 上辺 端線 */}
      <Line points={[px, py - 16, px, py - 4]} stroke="#666" strokeWidth={0.5} listening={false} />
      <Line points={[px + pw, py - 16, px + pw, py - 4]} stroke="#666" strokeWidth={0.5} listening={false} />
      <Text
        x={px}
        y={py - 26}
        width={pw}
        text={`${widthMM}mm`}
        fontSize={10}
        fill="#666"
        align="center"
        listening={false}
      />

      {/* 左辺の寸法（高さ） */}
      <Line
        points={[px - 10, py, px - 10, py + ph]}
        stroke="#666"
        strokeWidth={0.8}
        listening={false}
      />
      {/* 左辺 端線 */}
      <Line points={[px - 16, py, px - 4, py]} stroke="#666" strokeWidth={0.5} listening={false} />
      <Line points={[px - 16, py + ph, px - 4, py + ph]} stroke="#666" strokeWidth={0.5} listening={false} />
      <Text
        x={px - 46}
        y={py + ph / 2 - 5}
        width={40}
        text={`${heightMM}mm`}
        fontSize={10}
        fill="#666"
        align="right"
        listening={false}
      />
    </Group>
  );
}

/** L字階段の寸法線 */
function LStairsDimension({ room }: { room: Room }) {
  const g = GRID_PX;
  const px = room.x * g;
  const py = room.y * g;

  // 回転に応じてバウンディングボックスを計算
  const pw = room.width * g;
  const ph = room.height * g;

  // L字の実寸（回転前基準: 縦910×2730 + 横910×910）
  // 回転ごとに表記が変わるので、バウンディングボックスの外周寸法を表示
  const widthMM = room.width * GRID_MM;
  const heightMM = room.height * GRID_MM;

  return (
    <Group>
      {/* 上辺 */}
      <Line points={[px, py - 10, px + pw, py - 10]} stroke="#666" strokeWidth={0.8} listening={false} />
      <Line points={[px, py - 16, px, py - 4]} stroke="#666" strokeWidth={0.5} listening={false} />
      <Line points={[px + pw, py - 16, px + pw, py - 4]} stroke="#666" strokeWidth={0.5} listening={false} />
      <Text
        x={px}
        y={py - 26}
        width={pw}
        text={`${widthMM}mm`}
        fontSize={10}
        fill="#666"
        align="center"
        listening={false}
      />

      {/* 左辺 */}
      <Line points={[px - 10, py, px - 10, py + ph]} stroke="#666" strokeWidth={0.8} listening={false} />
      <Line points={[px - 16, py, px - 4, py]} stroke="#666" strokeWidth={0.5} listening={false} />
      <Line points={[px - 16, py + ph, px - 4, py + ph]} stroke="#666" strokeWidth={0.5} listening={false} />
      <Text
        x={px - 46}
        y={py + ph / 2 - 5}
        width={40}
        text={`${heightMM}mm`}
        fontSize={10}
        fill="#666"
        align="right"
        listening={false}
      />
    </Group>
  );
}
