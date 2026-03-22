import { RoomPalette } from '../sidebar/RoomPalette';
import { PropertyPanel } from '../sidebar/PropertyPanel';
import { AreaSummary } from '../info/AreaSummary';
import { useUIStore } from '../../stores/useUIStore';
import { useIsMobile } from '../../hooks/useIsMobile';

interface SidebarProps {
  onRoomAdded?: () => void;
}

export function Sidebar({ onRoomAdded }: SidebarProps) {
  const selectedRoomId = useUIStore((s) => s.selectedRoomId);
  const isMobile = useIsMobile();

  return (
    <aside
      className="bg-white flex flex-col shrink-0 overflow-hidden"
      style={{
        width: isMobile ? '100%' : '300px',
        borderRight: isMobile ? 'none' : '1px solid rgba(232,230,225,0.6)',
      }}
    >
      <div className="flex-1 overflow-y-auto min-h-0">
        <RoomPalette onRoomAdded={onRoomAdded} />
      </div>

      {selectedRoomId && <PropertyPanel />}

      {!isMobile && <AreaSummary />}
    </aside>
  );
}
