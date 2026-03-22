import { useRef, useEffect, useCallback } from 'react';
import { Group, Rect, Text, Line, Transformer } from 'react-konva';
import type Konva from 'konva';
import type { Room } from '../../types';
import { GRID_PX, SNAP_PX } from '../../constants/grid';
import { getRoomDefinition } from '../../constants/rooms';
import { useFloorPlanStore } from '../../stores/useFloorPlanStore';
import { useUIStore } from '../../stores/useUIStore';
import { snapToGrid } from '../../utils/geometry';
import { calculateRoomArea } from '../../utils/area';
import { StairsArrow, LStairsArrow } from './StairsArrow';
import { isStairsType } from '../../constants/rooms';

interface RoomShapeProps {
  room: Room;
}

export function RoomShape({ room }: RoomShapeProps) {
  const shapeRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const moveRoom = useFloorPlanStore((s) => s.moveRoom);
  const resizeRoom = useFloorPlanStore((s) => s.resizeRoom);
  const pushHistory = useFloorPlanStore((s) => s.pushHistory);
  const selectedRoomId = useUIStore((s) => s.selectedRoomId);
  const setSelectedRoom = useUIStore((s) => s.setSelectedRoom);

  const isSelected = selectedRoomId === room.id;
  const area = calculateRoomArea(room);

  const def = getRoomDefinition(room.type);
  const canResize = def?.resizable !== false;
  const isLStairs = room.type === 'stairs_l';

  useEffect(() => {
    if (isSelected && canResize && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, canResize]);

  const handleDragStart = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    pushHistory();
    // ドラッグ中のパーツを最前面に
    const group = e.target.findAncestor('Group') ?? e.target;
    group.moveToTop();
  }, [pushHistory]);

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;
      // 中心基準オフセット: 左上座標 = x - offsetX (scaleは中心反転なので影響しない)
      const ox = node.offsetX();
      const oy = node.offsetY();
      const realX = node.x() - ox;
      const realY = node.y() - oy;

      const snappedX = snapToGrid(realX);
      const snappedY = snapToGrid(realY);

      // position を逆算して設定
      node.position({ x: snappedX + ox, y: snappedY + oy });

      const gridX = Math.round(snappedX / SNAP_PX) * 0.5;
      const gridY = Math.round(snappedY / SNAP_PX) * 0.5;
      moveRoom(room.id, gridX, gridY);
    },
    [room.id, moveRoom],
  );

  const handleTransformEnd = useCallback(() => {
    if (!canResize) return;
    const node = shapeRef.current;
    const group = node?.getParent();
    if (!node || !group) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // 半グリッド（0.5単位）でリサイズ
    const newWidth = Math.max(0.5, Math.round((node.width() * scaleX) / SNAP_PX) * 0.5);
    const newHeight = Math.max(0.5, Math.round((node.height() * scaleY) / SNAP_PX) * 0.5);

    const newPw = newWidth * GRID_PX;
    const newPh = newHeight * GRID_PX;

    // 中心基準オフセットを考慮して左上座標を算出
    // group.x() - group.offsetX() = 左上のx → それに Rect のローカル移動分を加算
    const topLeftX = group.x() - group.offsetX() + node.x();
    const topLeftY = group.y() - group.offsetY() + node.y();
    const snappedX = snapToGrid(topLeftX);
    const snappedY = snapToGrid(topLeftY);

    // Groupの位置を新サイズの中心基準で更新し、Rectはローカル(0,0)にリセット
    group.position({ x: snappedX + newPw / 2, y: snappedY + newPh / 2 });
    group.offsetX(newPw / 2);
    group.offsetY(newPh / 2);
    node.position({ x: 0, y: 0 });
    node.scaleX(1);
    node.scaleY(1);
    node.width(newPw);
    node.height(newPh);

    const gridX = Math.round(snappedX / SNAP_PX) * 0.5;
    const gridY = Math.round(snappedY / SNAP_PX) * 0.5;

    pushHistory();
    moveRoom(room.id, gridX, gridY);
    resizeRoom(room.id, newWidth, newHeight);
  }, [room.id, moveRoom, resizeRoom, pushHistory, canResize]);

  const handleClick = useCallback(() => {
    setSelectedRoom(isSelected ? null : room.id);
  }, [room.id, isSelected, setSelectedRoom]);

  const px = room.x * GRID_PX;
  const py = room.y * GRID_PX;
  const pw = room.width * GRID_PX;
  const ph = room.height * GRID_PX;

  const labelFontSize = Math.min(14, Math.max(9, Math.min(pw, ph) / 4));
  const areaFontSize = Math.max(7, labelFontSize - 2);
  const jouText = `${area.jou}畳 / ${area.sqm}㎡`;

  // L字階段: 特殊形状で描画
  if (isLStairs) {
    return (
      <LStairsShape
        room={room}
        isSelected={isSelected}
        labelFontSize={labelFontSize}
        areaFontSize={areaFontSize}
        jouText={jouText}
        onDragStart={handleDragStart}
        moveRoom={moveRoom}
        onClick={handleClick}
      />
    );
  }

  return (
    <>
      <Group
        x={px + pw / 2}
        y={py + ph / 2}
        offsetX={pw / 2}
        offsetY={ph / 2}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onTap={handleClick}
        scaleX={room.flipH ? -1 : 1}
        scaleY={room.flipV ? -1 : 1}
      >
        <Rect
          ref={shapeRef}
          width={pw}
          height={ph}
          fill={room.color}
          stroke={isSelected ? '#32373c' : '#555555'}
          strokeWidth={isSelected ? 2.5 : 2}
          onTransformEnd={handleTransformEnd}
          cornerRadius={1}
        />
        <Text
          x={room.flipH ? pw : 0}
          y={room.flipV ? ph / 2 + labelFontSize : ph / 2 - labelFontSize}
          width={pw}
          text={room.label}
          fontSize={labelFontSize}
          fontFamily="'Noto Sans JP', sans-serif"
          fontStyle="bold"
          fill="#333333"
          align="center"
          scaleX={room.flipH ? -1 : 1}
          scaleY={room.flipV ? -1 : 1}
          listening={false}
        />
        <Text
          x={room.flipH ? pw : 0}
          y={room.flipV ? ph / 2 - 2 : ph / 2 + 2}
          width={pw}
          text={jouText}
          fontSize={areaFontSize}
          fontFamily="'Noto Sans JP', sans-serif"
          fill="#888888"
          align="center"
          scaleX={room.flipH ? -1 : 1}
          scaleY={room.flipV ? -1 : 1}
          listening={false}
        />
        {isStairsType(room.type) && (
          <StairsArrow type={room.type} rotation={room.rotation} width={room.width} height={room.height} />
        )}
      </Group>
      {isSelected && canResize && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={false}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
            'middle-left',
            'middle-right',
            'top-center',
            'bottom-center',
          ]}
          boundBoxFunc={(_, newBox) => {
            const minSize = SNAP_PX;
            return {
              ...newBox,
              width: Math.max(minSize, newBox.width),
              height: Math.max(minSize, newBox.height),
            };
          }}
          anchorSize={8}
          anchorCornerRadius={2}
          borderStroke="#32373c"
          anchorStroke="#32373c"
          anchorFill="#fff"
        />
      )}
    </>
  );
}

/**
 * L字階段の専用描画コンポーネント
 *
 * 回転ごとにポリゴン頂点を直接定義し、Konva rotation は使わない。
 * これにより寸法線の位置と完全に一致する。
 *
 * 0°:        90°:         180°:       270°:
 * ┌──┐      ┌─────────┐  ┌──┬──┐     ┌────┐
 * │  │      │         │  │  │  │     │    └────┐
 * │  │      └────┐    │  ├──┘  │     │         │
 * │  ├──┐        └────┘  └─────┘     └─────────┘
 * └──┴──┘
 */
interface LStairsShapeProps {
  room: Room;
  isSelected: boolean;
  labelFontSize: number;
  areaFontSize: number;
  jouText: string;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  moveRoom: (id: string, x: number, y: number) => void;
  onClick: () => void;
}

/** 回転ごとのL字ポリゴン頂点を返す（ローカル座標） */
function getLStairsPoints(rotation: number, g: number): number[] {
  switch (rotation) {
    case 90:
      // 3w × 2h: 上に横長、左下に1マス欠け
      return [0, 0, 3 * g, 0, 3 * g, 2 * g, 2 * g, 2 * g, 2 * g, g, 0, g];
    case 180:
      // 2w × 3h: 右上に1マス付き
      return [0, 0, 2 * g, 0, 2 * g, 3 * g, g, 3 * g, g, g, 0, g];
    case 270:
      // 3w × 2h: 右上に1マス付き
      return [2 * g, 0, 3 * g, 0, 3 * g, 2 * g, 0, 2 * g, 0, g, 2 * g, g];
    default:
      // 0°: 2w × 3h: 左上に縦長、右下に1マス付き
      return [0, 0, g, 0, g, 2 * g, 2 * g, 2 * g, 2 * g, 3 * g, 0, 3 * g];
  }
}

/** 回転ごとのテキスト配置位置を返す */
function getLStairsTextPos(rotation: number, g: number): { x: number; y: number; w: number } {
  switch (rotation) {
    case 90:
      return { x: g * 0.5, y: 0, w: 2 * g };
    case 180:
      return { x: g, y: g * 1.2, w: g };
    case 270:
      return { x: g * 0.5, y: g, w: 2 * g };
    default:
      return { x: 0, y: g * 1.2, w: g };
  }
}

function LStairsShape({
  room,
  isSelected,
  labelFontSize,
  areaFontSize,
  jouText,
  onDragStart,
  moveRoom,
  onClick,
}: LStairsShapeProps) {
  const g = GRID_PX;
  const px = room.x * g;
  const py = room.y * g;

  const points = getLStairsPoints(room.rotation, g);
  const textPos = getLStairsTextPos(room.rotation, g);

  const handleLDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;
      const ox = node.offsetX();
      const oy = node.offsetY();
      const realX = node.x() - ox;
      const realY = node.y() - oy;

      const snappedX = snapToGrid(realX);
      const snappedY = snapToGrid(realY);
      node.position({ x: snappedX + ox, y: snappedY + oy });

      const gridX = Math.round(snappedX / SNAP_PX) * 0.5;
      const gridY = Math.round(snappedY / SNAP_PX) * 0.5;
      moveRoom(room.id, gridX, gridY);
    },
    [room.id, moveRoom],
  );

  const bw = room.width * g;
  const bh = room.height * g;

  return (
    <Group
      x={px + bw / 2}
      y={py + bh / 2}
      offsetX={bw / 2}
      offsetY={bh / 2}
      draggable
      onDragStart={onDragStart}
      onDragEnd={handleLDragEnd}
      onClick={onClick}
      onTap={onClick}
      scaleX={room.flipH ? -1 : 1}
      scaleY={room.flipV ? -1 : 1}
    >
      <Line
        points={points}
        fill={room.color}
        stroke={isSelected ? '#32373c' : '#555555'}
        strokeWidth={isSelected ? 2.5 : 2}
        closed
        listening={true}
      />
      <Text
        x={room.flipH ? textPos.x + textPos.w : textPos.x}
        y={room.flipV ? textPos.y + Math.min(labelFontSize, 11) : textPos.y}
        width={textPos.w}
        text={room.label}
        fontSize={Math.min(labelFontSize, 11)}
        fontFamily="'Noto Sans JP', sans-serif"
        fontStyle="bold"
        fill="#333333"
        align="center"
        scaleX={room.flipH ? -1 : 1}
        scaleY={room.flipV ? -1 : 1}
        listening={false}
      />
      <Text
        x={room.flipH ? textPos.x + textPos.w : textPos.x}
        y={room.flipV ? textPos.y + labelFontSize + Math.min(areaFontSize, 9) : textPos.y + labelFontSize}
        width={textPos.w}
        text={jouText}
        fontSize={Math.min(areaFontSize, 9)}
        fontFamily="'Noto Sans JP', sans-serif"
        fill="#888888"
        align="center"
        scaleX={room.flipH ? -1 : 1}
        scaleY={room.flipV ? -1 : 1}
        listening={false}
      />
      <LStairsArrow rotation={room.rotation} g={g} />
    </Group>
  );
}
