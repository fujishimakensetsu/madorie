import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { RoomDefinition, RoomType } from '../../types';

interface RoomCategoryProps {
  label: string;
  rooms: RoomDefinition[];
  onDragStart: (e: React.DragEvent, roomType: RoomType) => void;
  onDoubleClickAdd: (roomType: RoomType) => void;
  onTapAdd?: (roomType: RoomType) => void;
}

export function RoomCategory({ label, rooms, onDragStart, onDoubleClickAdd, onTapAdd }: RoomCategoryProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button
        className="flex items-center w-full font-semibold text-[#7A7A7A] hover:text-[#32373c] transition-colors"
        style={{ gap: '6px', padding: '8px', fontSize: '12px' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown size={13} className="text-[#C5C5C5]" />
        ) : (
          <ChevronRight size={13} className="text-[#C5C5C5]" />
        )}
        <span className="tracking-wide">{label}</span>
      </button>
      {isOpen && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', padding: '4px 4px 8px' }}>
          {rooms.map((room) => {
            const isLong = room.label.length > 5;
            return (
              <div
                key={room.type}
                draggable={!onTapAdd}
                onDragStart={!onTapAdd ? (e) => onDragStart(e, room.type) : undefined}
                onDoubleClick={!onTapAdd ? () => onDoubleClickAdd(room.type) : undefined}
                onClick={onTapAdd ? () => onTapAdd(room.type) : undefined}
                className="room-chip flex items-center bg-white"
                style={{
                  gap: '8px',
                  padding: '9px 10px',
                  fontSize: isLong ? '10px' : '12px',
                  borderRadius: '10px',
                  border: '1px solid #EEEDEA',
                  height: '38px',
                  cursor: onTapAdd ? 'pointer' : 'grab',
                }}
              >
                <span
                  className="shrink-0"
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '4px',
                    backgroundColor: room.color,
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
                  }}
                />
                <span className="truncate text-[#5C5C5C] font-medium" style={{ lineHeight: 1.2 }}>{room.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
