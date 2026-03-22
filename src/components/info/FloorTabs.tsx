import { useFloorPlanStore } from '../../stores/useFloorPlanStore';
import { useIsMobile } from '../../hooks/useIsMobile';

export function FloorTabs() {
  const currentFloor = useFloorPlanStore((s) => s.currentFloor);
  const setCurrentFloor = useFloorPlanStore((s) => s.setCurrentFloor);
  const floorPlan = useFloorPlanStore((s) => s.floorPlan);
  const isMobile = useIsMobile();

  const floors = floorPlan.floors.map((f) => f.level).sort();

  if (floors.length <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#F0EFEC',
        borderRadius: isMobile ? '8px' : '10px',
        padding: '3px',
        gap: '2px',
        flexShrink: 0,
      }}
    >
      {floors.map((level) => {
        const isActive = currentFloor === level;
        return (
          <button
            key={level}
            onClick={() => setCurrentFloor(level)}
            style={{
              padding: isMobile ? '4px 10px' : '6px 16px',
              fontSize: isMobile ? '11px' : '13px',
              fontWeight: isActive ? 600 : 500,
              borderRadius: isMobile ? '6px' : '8px',
              background: isActive ? '#32373c' : 'transparent',
              color: isActive ? '#fff' : '#9A9A9A',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              borderWidth: 0,
              borderStyle: 'none',
              whiteSpace: 'nowrap',
              lineHeight: 1.4,
              transition: 'all 0.15s ease',
            }}
          >
            {level}階
          </button>
        );
      })}
    </div>
  );
}
