import { useRef, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import type Konva from 'konva';
import { useFloorPlanStore } from '../../stores/useFloorPlanStore';
import { useUIStore } from '../../stores/useUIStore';
import { useCanvasInteraction } from '../../hooks/useCanvasInteraction';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { exportAsPNG } from '../../utils/export';
import { GridLayer } from './GridLayer';
import { RoomShape } from './RoomShape';
import { DimensionLabel } from './DimensionLabel';

interface FloorPlanCanvasProps {
  width: number;
  height: number;
  stageRef?: React.RefObject<Konva.Stage | null>;
}

export function FloorPlanCanvas({ width, height, stageRef: externalStageRef }: FloorPlanCanvasProps) {
  const internalStageRef = useRef<Konva.Stage>(null);
  const stageRef = externalStageRef ?? internalStageRef;
  const containerRef = useRef<HTMLDivElement>(null);

  const currentFloor = useFloorPlanStore((s) => s.currentFloor);
  const floorPlan = useFloorPlanStore((s) => s.floorPlan);
  const showGrid = useUIStore((s) => s.showGrid);
  const showDimensions = useUIStore((s) => s.showDimensions);
  const selectedRoomId = useUIStore((s) => s.selectedRoomId);
  const setSelectedRoom = useUIStore((s) => s.setSelectedRoom);

  const { zoom, panOffset, setPanOffset, handleWheel } = useCanvasInteraction();
  const { handleDragOver, handleDrop } = useDragAndDrop();

  const handleExportPNG = useCallback(() => {
    exportAsPNG(stageRef);
  }, [stageRef]);

  useKeyboardShortcuts(handleExportPNG);

  const floorData = floorPlan.floors.find((f) => f.level === currentFloor);
  const rooms = floorData?.rooms ?? [];

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (e.target === e.target.getStage()) {
        setSelectedRoom(null);
      }
    },
    [setSelectedRoom],
  );

  const handleStageDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      if (e.target !== e.target.getStage()) return;
      setPanOffset({
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    [setPanOffset],
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-white overflow-hidden cursor-crosshair"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, containerRef.current)}
    >
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={zoom}
        scaleY={zoom}
        x={panOffset.x}
        y={panOffset.y}
        draggable
        onWheel={handleWheel}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onDragEnd={handleStageDragEnd}
      >
        <GridLayer visible={showGrid} stageWidth={width} stageHeight={height} />

        <Layer>
          {rooms.map((room) => (
            <RoomShape key={room.id} room={room} />
          ))}
        </Layer>

        <Layer listening={false}>
          {showDimensions &&
            rooms
              .filter((r) => r.id === selectedRoomId)
              .map((room) => (
                <DimensionLabel
                  key={`dim-${room.id}`}
                  room={room}
                  visible={true}
                />
              ))}
        </Layer>
      </Stage>
    </div>
  );
}
