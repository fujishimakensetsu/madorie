import { useRef, useState, useEffect, useCallback } from 'react';
import Konva from 'konva';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';
import { Toolbar } from './layout/Toolbar';
import { FloorPlanCanvas } from './canvas/FloorPlanCanvas';
import { useUIStore } from '../stores/useUIStore';
import { useIsMobile } from '../hooks/useIsMobile';
import { exportAsPNG } from '../utils/export';
import { Layers } from 'lucide-react';

export function EditorScreen() {
  const setScreen = useUIStore((s) => s.setScreen);
  const stageRef = useRef<Konva.Stage>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateSize = () => {
      if (canvasContainerRef.current) {
        const rect = canvasContainerRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleExportPNG = useCallback(() => {
    exportAsPNG(stageRef);
  }, []);

  const handleBackToTop = useCallback(() => {
    setScreen('landing');
  }, [setScreen]);

  const closeMobileDrawer = useCallback(() => {
    setShowMobileSidebar(false);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F0EFEC]">
      <Header onExportPNG={handleExportPNG} onBackToTop={handleBackToTop} />

      <div className="flex flex-1 overflow-hidden gap-0">
        {!isMobile && <Sidebar />}

        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            ref={canvasContainerRef}
            className="flex-1 overflow-hidden relative bg-white m-0 shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <FloorPlanCanvas
              width={canvasSize.width}
              height={canvasSize.height}
              stageRef={stageRef}
            />
          </div>
          <Toolbar />
        </div>
      </div>

      {/* モバイル: パーツ追加ボタン（左下） */}
      {isMobile && !showMobileSidebar && (
        <button
          onClick={() => setShowMobileSidebar(true)}
          style={{
            position: 'fixed',
            bottom: '56px',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '9999px',
            background: '#32373c',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            border: 'none',
            cursor: 'pointer',
            zIndex: 40,
            boxShadow: '0 4px 16px rgba(50,55,60,0.25)',
          }}
        >
          <Layers size={15} />
          パーツ追加
        </button>
      )}

      {/* モバイル: ドロワーサイドバー */}
      {isMobile && showMobileSidebar && (
        <>
          <div
            onClick={closeMobileDrawer}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 50,
            }}
          />
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: '70vh',
              background: '#fff',
              borderRadius: '20px 20px 0 0',
              zIndex: 51,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'drawer-up 0.3s ease',
            }}
          >
            <div
              style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
              onClick={closeMobileDrawer}
            >
              <div style={{ width: '40px', height: '4px', borderRadius: '9999px', background: '#D5D3CE' }} />
            </div>
            <div style={{ overflow: 'auto', flex: 1 }}>
              <Sidebar onRoomAdded={closeMobileDrawer} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
