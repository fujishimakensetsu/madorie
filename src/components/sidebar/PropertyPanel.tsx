import { useMemo, useState } from 'react';
import { Trash2, Copy, RotateCw, FlipHorizontal2, FlipVertical2 } from 'lucide-react';
import { useFloorPlanStore } from '../../stores/useFloorPlanStore';
import { useUIStore } from '../../stores/useUIStore';
import { calculateRoomArea } from '../../utils/area';
import { GRID_MM } from '../../constants/grid';
import type { Room } from '../../types';

export function PropertyPanel() {
  const selectedRoomId = useUIStore((s) => s.selectedRoomId);
  const setSelectedRoom = useUIStore((s) => s.setSelectedRoom);
  const floorPlan = useFloorPlanStore((s) => s.floorPlan);
  const updateRoomLabel = useFloorPlanStore((s) => s.updateRoomLabel);
  const deleteRoom = useFloorPlanStore((s) => s.deleteRoom);
  const duplicateRoom = useFloorPlanStore((s) => s.duplicateRoom);
  const rotateRoom = useFloorPlanStore((s) => s.rotateRoom);
  const flipRoomH = useFloorPlanStore((s) => s.flipRoomH);
  const flipRoomV = useFloorPlanStore((s) => s.flipRoomV);

  const room: Room | undefined = useMemo(() => {
    if (!selectedRoomId) return undefined;
    for (const floor of floorPlan.floors) {
      const found = floor.rooms.find((r) => r.id === selectedRoomId);
      if (found) return found;
    }
    return undefined;
  }, [selectedRoomId, floorPlan]);

  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState('');

  if (!room) return null;

  const area = calculateRoomArea(room);
  const widthMM = room.width * GRID_MM;
  const heightMM = room.height * GRID_MM;

  const handleStartEdit = () => {
    setLabelValue(room.label);
    setEditingLabel(true);
  };

  const handleFinishEdit = () => {
    if (labelValue.trim()) {
      updateRoomLabel(room.id, labelValue.trim());
    }
    setEditingLabel(false);
  };

  const handleDelete = () => {
    deleteRoom(room.id);
    setSelectedRoom(null);
  };

  return (
    <div className="border-t border-[#E0DED9] overflow-y-auto" style={{ maxHeight: '320px', background: '#F5F4F1' }}>
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 部屋名 */}
        <div className="flex items-center" style={{ gap: '12px' }}>
          <span
            className="shrink-0"
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '6px',
              backgroundColor: room.color,
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
            }}
          />
          {editingLabel ? (
            <input
              type="text"
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              onBlur={handleFinishEdit}
              onKeyDown={(e) => e.key === 'Enter' && handleFinishEdit()}
              className="flex-1 border border-[#D5D3CE] focus:border-[#32373c] focus:outline-none transition-colors"
              style={{ padding: '6px 10px', fontSize: '14px', fontWeight: 600, borderRadius: '8px' }}
              autoFocus
            />
          ) : (
            <span
              className="flex-1 font-semibold text-[#32373c] cursor-pointer hover:text-[#C8A96E] transition-colors"
              style={{ fontSize: '15px' }}
              onClick={handleStartEdit}
            >
              {room.label}
            </span>
          )}
        </div>

        {/* サイズ・面積 */}
        <div className="flex overflow-hidden" style={{ borderRadius: '12px', background: '#EEEDEA' }}>
          <div className="flex-1 text-center" style={{ padding: '12px 14px' }}>
            <div className="text-[#B5B5B5] font-medium uppercase" style={{ fontSize: '9px', letterSpacing: '0.15em', marginBottom: '4px' }}>Size</div>
            <div className="tabular-nums text-[#5C5C5C] font-medium" style={{ fontSize: '13px' }}>
              {widthMM}<span className="text-[#C5C5C5]" style={{ margin: '0 3px' }}>×</span>{heightMM}
              <span className="text-[#C5C5C5]" style={{ fontSize: '10px', marginLeft: '2px' }}>mm</span>
            </div>
          </div>
          <div style={{ width: '1px', background: '#EEEDEA' }} />
          <div className="flex-1 text-center" style={{ padding: '12px 14px' }}>
            <div className="text-[#B5B5B5] font-medium uppercase" style={{ fontSize: '9px', letterSpacing: '0.15em', marginBottom: '4px' }}>Area</div>
            <div className="tabular-nums text-[#5C5C5C] font-medium" style={{ fontSize: '13px' }}>
              {area.jou}<span className="text-[#C5C5C5]" style={{ fontSize: '10px', marginLeft: '2px' }}>畳</span>
              <span className="text-[#D5D3CE]" style={{ margin: '0 6px' }}>|</span>
              {area.sqm}<span className="text-[#C5C5C5]" style={{ fontSize: '10px', marginLeft: '2px' }}>㎡</span>
            </div>
          </div>
        </div>

        {/* 操作ボタン */}
        <div className="flex flex-wrap" style={{ gap: '6px' }}>
          <button onClick={() => rotateRoom(room.id)} className="act-btn" style={{ padding: '8px 14px', fontSize: '12px' }} title="回転 (R)">
            <RotateCw size={14} />
            回転
          </button>
          <button onClick={() => flipRoomH(room.id)} className="act-btn" style={{ padding: '8px 14px', fontSize: '12px' }} title="横反転 (H)">
            <FlipHorizontal2 size={14} />
            横反転
          </button>
          <button onClick={() => flipRoomV(room.id)} className="act-btn" style={{ padding: '8px 14px', fontSize: '12px' }} title="縦反転 (V)">
            <FlipVertical2 size={14} />
            縦反転
          </button>
          <button onClick={() => duplicateRoom(room.id)} className="act-btn" style={{ padding: '8px 14px', fontSize: '12px' }} title="複製 (Ctrl+D)">
            <Copy size={14} />
            複製
          </button>
          <button onClick={handleDelete} className="act-btn danger" style={{ padding: '8px 14px', fontSize: '12px' }} title="削除 (Delete)">
            <Trash2 size={14} />
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
