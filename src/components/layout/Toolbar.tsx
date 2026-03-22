import { ZoomIn, ZoomOut, Grid3x3, Ruler, Undo2, Redo2 } from 'lucide-react';
import { useCanvasInteraction } from '../../hooks/useCanvasInteraction';
import { useFloorPlanStore } from '../../stores/useFloorPlanStore';
import { useUIStore } from '../../stores/useUIStore';
import { FloorTabs } from '../info/FloorTabs';
import { useIsMobile } from '../../hooks/useIsMobile';
import { MIN_ZOOM, MAX_ZOOM } from '../../constants/grid';

export function Toolbar() {
  const { zoom, zoomIn, zoomOut, zoomReset } = useCanvasInteraction();
  const undo = useFloorPlanStore((s) => s.undo);
  const redo = useFloorPlanStore((s) => s.redo);
  const showGrid = useUIStore((s) => s.showGrid);
  const toggleGrid = useUIStore((s) => s.toggleGrid);
  const showDimensions = useUIStore((s) => s.showDimensions);
  const toggleDimensions = useUIStore((s) => s.toggleDimensions);
  const isMobile = useIsMobile();

  const zoomPercent = Math.round(zoom * 100);
  const zoomRatio = (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM);

  const btnSize = isMobile ? '30px' : '34px';
  const iconSize = isMobile ? 14 : 16;

  const iconBtn: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: btnSize,
    height: btnSize,
    borderRadius: '9px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#EEEDEA',
    background: '#F7F6F3',
    color: '#8C8C8C',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  const labelBtn: React.CSSProperties = {
    ...iconBtn,
    width: 'auto',
    padding: isMobile ? '0 8px' : '0 14px',
    gap: '4px',
    fontSize: isMobile ? '10px' : '12px',
    fontWeight: 500,
  };

  const activeStyle: React.CSSProperties = {
    background: '#32373c',
    borderColor: '#32373c',
    color: '#fff',
  };

  return (
    <div
      className="flex items-center justify-between shrink-0 bg-white border-t border-[#E8E6E1]/60"
      style={{ height: isMobile ? '42px' : '50px', padding: isMobile ? '0 8px' : '0 14px' }}
    >
      {/* 左 */}
      <div className="flex items-center" style={{ gap: isMobile ? '4px' : '8px' }}>
        <div className="flex items-center" style={{ gap: '3px' }}>
          <button onClick={undo} style={iconBtn} title="元に戻す (Ctrl+Z)">
            <Undo2 size={iconSize} />
          </button>
          <button onClick={redo} style={iconBtn} title="やり直し (Ctrl+Shift+Z)">
            <Redo2 size={iconSize} />
          </button>
        </div>
        <div style={{ width: '1px', height: '16px', background: '#EEEDEA', margin: '0 2px' }} />
        <FloorTabs />
      </div>

      {/* 右 */}
      <div className="flex items-center" style={{ gap: isMobile ? '3px' : '8px' }}>
        {/* 表示切替: モバイルではアイコンのみ */}
        <div className="flex items-center" style={{ gap: '3px' }}>
          <button
            onClick={toggleGrid}
            style={{ ...(isMobile ? iconBtn : labelBtn), ...(showGrid ? activeStyle : {}) }}
            title="グリッド表示 (G)"
          >
            <Grid3x3 size={iconSize - 2} />
            {!isMobile && <span>グリッド</span>}
          </button>
          <button
            onClick={toggleDimensions}
            style={{ ...(isMobile ? iconBtn : labelBtn), ...(showDimensions ? activeStyle : {}) }}
            title="寸法線表示"
          >
            <Ruler size={iconSize - 2} />
            {!isMobile && <span>寸法</span>}
          </button>
        </div>

        <div style={{ width: '1px', height: '16px', background: '#EEEDEA', margin: '0 2px' }} />

        <div className="flex items-center" style={{ gap: '3px' }}>
          <button onClick={zoomOut} style={iconBtn} title="ズームアウト">
            <ZoomOut size={iconSize} />
          </button>

          {!isMobile && (
            <div style={{ width: '80px', height: '4px', background: '#EEEDEA', borderRadius: '9999px', margin: '0 4px', position: 'relative' }}>
              <div style={{ height: '100%', background: '#32373c', borderRadius: '9999px', width: `${zoomRatio * 100}%`, transition: 'width 0.15s ease' }} />
            </div>
          )}

          <button onClick={zoomIn} style={iconBtn} title="ズームイン">
            <ZoomIn size={iconSize} />
          </button>

          <button
            onClick={zoomReset}
            style={{ ...labelBtn, fontVariantNumeric: 'tabular-nums', padding: isMobile ? '0 6px' : '0 14px' }}
            title="ズームリセット"
          >
            {zoomPercent}%
          </button>
        </div>
      </div>
    </div>
  );
}
