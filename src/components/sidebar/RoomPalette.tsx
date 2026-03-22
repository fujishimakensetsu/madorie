import { useMemo, useCallback } from 'react';
import { ROOM_DEFINITIONS, CATEGORY_LABELS } from '../../constants/rooms';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { RoomCategory } from './RoomCategory';
import type { RoomCategory as RoomCategoryType, RoomType } from '../../types';

const CATEGORY_ORDER: RoomCategoryType[] = ['living', 'water', 'storage', 'other'];

interface RoomPaletteProps {
  onRoomAdded?: () => void;
}

export function RoomPalette({ onRoomAdded }: RoomPaletteProps) {
  const { handleDragStart, handleDoubleClickAdd } = useDragAndDrop();

  const handleTapAdd = useCallback(
    (roomType: RoomType) => {
      handleDoubleClickAdd(roomType);
      onRoomAdded?.();
    },
    [handleDoubleClickAdd, onRoomAdded],
  );

  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      rooms: ROOM_DEFINITIONS.filter((r) => r.category === cat),
    }));
  }, []);

  return (
    <div style={{ padding: '16px 14px' }}>
      <div className="flex items-center gap-2 px-1" style={{ marginBottom: '14px' }}>
        <span className="text-[10px] font-semibold tracking-[0.15em] text-[#B5B5B5] uppercase">
          部屋パーツ
        </span>
        <div className="flex-1 h-px bg-[#EEEDEA]" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {grouped.map((group) => (
          <RoomCategory
            key={group.category}
            label={group.label}
            rooms={group.rooms}
            onDragStart={handleDragStart}
            onDoubleClickAdd={handleDoubleClickAdd}
            onTapAdd={onRoomAdded ? handleTapAdd : undefined}
          />
        ))}
      </div>
    </div>
  );
}
