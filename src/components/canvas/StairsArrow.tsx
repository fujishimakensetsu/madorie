import { Line, Arrow, Text } from 'react-konva';
import { GRID_PX } from '../../constants/grid';

interface StairsArrowProps {
  type: string;
  rotation: number;
  width: number;
  height: number;
}

const ARROW_COLOR = '#888888';
const STEP_COLOR = '#CCCCCC';

export function StairsArrow({ type, rotation, width, height }: StairsArrowProps) {
  const g = GRID_PX;
  const pw = width * g;
  const ph = height * g;

  if (type === 'stairs_straight') {
    return <StraightArrow rotation={rotation} pw={pw} ph={ph} g={g} />;
  }
  if (type === 'stairs_turning') {
    return <TurningArrow rotation={rotation} pw={pw} ph={ph} g={g} />;
  }
  return null;
}

/** ストレート階段: 段線 + 上り矢印 */
function StraightArrow({ rotation, pw, ph, g }: { rotation: number; pw: number; ph: number; g: number }) {
  const isVertical = rotation === 0 || rotation === 180;
  const length = isVertical ? ph : pw;
  const breadth = isVertical ? pw : ph;
  const stepCount = 7;
  const elements: React.JSX.Element[] = [];

  for (let i = 1; i < stepCount; i++) {
    const pos = (length / stepCount) * i;
    if (isVertical) {
      elements.push(
        <Line key={`step-${i}`} points={[2, pos, breadth - 2, pos]} stroke={STEP_COLOR} strokeWidth={0.8} listening={false} />
      );
    } else {
      elements.push(
        <Line key={`step-${i}`} points={[pos, 2, pos, breadth - 2]} stroke={STEP_COLOR} strokeWidth={0.8} listening={false} />
      );
    }
  }

  const margin = 4;
  const cx = pw / 2;
  const cy = ph / 2;
  let arrowPoints: number[];
  switch (rotation) {
    case 90:  arrowPoints = [margin, cy, pw - margin, cy]; break;
    case 180: arrowPoints = [cx, margin, cx, ph - margin]; break;
    case 270: arrowPoints = [pw - margin, cy, margin, cy]; break;
    default:  arrowPoints = [cx, ph - margin, cx, margin]; break;
  }

  elements.push(
    <Arrow key="arrow" points={arrowPoints} stroke={ARROW_COLOR} fill={ARROW_COLOR} strokeWidth={1.5} pointerLength={5} pointerWidth={4} listening={false} />
  );

  const upX = rotation === 90 ? pw - g + 2 : rotation === 270 ? 2 : 1;
  const upY = rotation === 0 ? 2 : rotation === 180 ? ph - 12 : (ph / 2) - 10;
  elements.push(
    <Text key="up" x={upX} y={upY} text="UP" fontSize={8} fill={ARROW_COLOR} listening={false} />
  );

  return <>{elements}</>;
}

/**
 * 回り階段: 2回折れ曲がりクランク矢印 + 段線
 *
 * 90°+90° = 180°回って上がる。4点の折れ線（3辺、2ターン）。
 *
 * 0°の例:
 *   4(UP)←─3
 *          │
 *   1──→──2
 *  (start)
 */
function TurningArrow({ rotation, pw, ph, g }: { rotation: number; pw: number; ph: number; g: number }) {
  const elements: React.JSX.Element[] = [];
  const m = 6;

  // 段線（格子状）
  const stepCount = 4;
  for (let i = 1; i < stepCount; i++) {
    const yPos = (ph / stepCount) * i;
    elements.push(
      <Line key={`sh-${i}`} points={[2, yPos, pw - 2, yPos]} stroke={STEP_COLOR} strokeWidth={0.6} listening={false} />
    );
  }
  for (let i = 1; i < stepCount; i++) {
    const xPos = (pw / stepCount) * i;
    elements.push(
      <Line key={`sv-${i}`} points={[xPos, 2, xPos, ph - 2]} stroke={STEP_COLOR} strokeWidth={0.6} listening={false} />
    );
  }

  // 4点クランク矢印（2ターン）
  let arrowPts: number[];
  let upPos: { x: number; y: number };

  switch (rotation) {
    case 90:
      // start(左上) → 左下 → 右下 → 右上(UP)
      arrowPts = [m, m, m, ph - m, pw - m, ph - m, pw - m, m];
      upPos = { x: pw - 18, y: 2 };
      break;
    case 180:
      // start(右上) → 左上 → 左下 → 右下(UP)
      arrowPts = [pw - m, m, m, m, m, ph - m, pw - m, ph - m];
      upPos = { x: pw - 18, y: ph - 12 };
      break;
    case 270:
      // start(右下) → 右上 → 左上 → 左下(UP)
      arrowPts = [pw - m, ph - m, pw - m, m, m, m, m, ph - m];
      upPos = { x: 2, y: ph - 12 };
      break;
    default: // 0°
      // start(左下) → 右下 → 右上 → 左上(UP)
      arrowPts = [m, ph - m, pw - m, ph - m, pw - m, m, m, m];
      upPos = { x: 2, y: 2 };
      break;
  }

  elements.push(
    <Arrow key="arrow" points={arrowPts} stroke={ARROW_COLOR} fill={ARROW_COLOR} strokeWidth={1.5} pointerLength={5} pointerWidth={4} listening={false} />
  );

  elements.push(
    <Text key="up" x={upPos.x} y={upPos.y} text="UP" fontSize={8} fill={ARROW_COLOR} listening={false} />
  );

  return <>{elements}</>;
}

/**
 * L字階段用の矢印（LStairsShape内で使用）
 *
 * L字の形状内に収まるクランク矢印を描画。
 * 矢印は長い辺（3グリッド）の端から折れ曲がり点を通って
 * 短い辺（1グリッド）の端へ向かう。
 *
 * 0°の形状:
 * ┌──┐
 * │↑ │
 * │  │
 * │  ├──┐
 * └──→──┘
 */
export function LStairsArrow({ rotation, g }: { rotation: number; g: number }) {
  const elements: React.JSX.Element[] = [];
  const m = 6;
  const hg = g / 2; // 折れ点のオフセット

  // 矢印: L字の内側に沿った折れ線
  // 始点（入口）→ 折れ点 → 終点（出口=矢先）
  let arrowPts: number[];
  let upPos: { x: number; y: number };

  // 段線の配置も回転ごとに定義
  let stepLines: { x1: number; y1: number; x2: number; y2: number }[] = [];

  switch (rotation) {
    case 90:
      // 形状: 上に横長、右下に1マス
      // ┌─────────┐
      // │         │
      // └─────┐   │
      //       └───┘
      // 矢印: 右下 → 右上 → 左上
      arrowPts = [2 * g + hg, 2 * g - m, 2 * g + hg, m, m, m];
      upPos = { x: 2, y: 2 };
      for (let i = 1; i <= 5; i++) {
        const x = (3 * g / 6) * i;
        stepLines.push({ x1: x, y1: 2, x2: x, y2: g - 2 });
      }
      break;

    case 180:
      // 形状: 左上に1マス付き
      // ┌──┬──┐
      // │  │  │
      // ├──┘  │
      // └─────┘
      // 矢印: 左上 → 左下 → 右下
      arrowPts = [m, hg, m, 2 * g - m, 2 * g - m, 2 * g - m];
      upPos = { x: 2 * g - 18, y: 2 * g - 12 };
      for (let i = 1; i <= 5; i++) {
        const y = (3 * g / 6) * i;
        stepLines.push({ x1: g + 2, y1: y, x2: 2 * g - 2, y2: y });
      }
      break;

    case 270:
      // 形状: 右上に1マス付き
      // ┌────┐
      // │    └────┐
      // │         │
      // └─────────┘
      // 矢印: 左上 → 左下 → 右下
      arrowPts = [hg, m, hg, g + m, 3 * g - m, g + m];
      upPos = { x: 3 * g - 18, y: g + 2 };
      for (let i = 1; i <= 5; i++) {
        const x = (3 * g / 6) * i;
        stepLines.push({ x1: x, y1: g + 2, x2: x, y2: 2 * g - 2 });
      }
      break;

    default: // 0°
      // 形状: 左縦長、右下に1マス
      // ┌──┐
      // │  │
      // │  │
      // │  ├──┐
      // └──┴──┘
      // 矢印: 右下 → 左下(折れ点) → 左上
      arrowPts = [2 * g - m, 2 * g + hg, m, 2 * g + hg, m, m];
      upPos = { x: 2, y: 2 };
      for (let i = 1; i <= 5; i++) {
        const y = (3 * g / 6) * i;
        stepLines.push({ x1: 2, y1: y, x2: g - 2, y2: y });
      }
      break;
  }

  // 段線
  for (let i = 0; i < stepLines.length; i++) {
    const s = stepLines[i];
    elements.push(
      <Line key={`s-${i}`} points={[s.x1, s.y1, s.x2, s.y2]} stroke={STEP_COLOR} strokeWidth={0.6} listening={false} />
    );
  }

  elements.push(
    <Arrow key="arrow" points={arrowPts} stroke={ARROW_COLOR} fill={ARROW_COLOR} strokeWidth={1.5} pointerLength={5} pointerWidth={4} listening={false} />
  );

  elements.push(
    <Text key="up" x={upPos.x} y={upPos.y} text="UP" fontSize={8} fill={ARROW_COLOR} listening={false} />
  );

  return <>{elements}</>;
}
