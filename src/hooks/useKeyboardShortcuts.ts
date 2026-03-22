import { useEffect } from 'react';
import { useFloorPlanStore } from '../stores/useFloorPlanStore';
import { useUIStore } from '../stores/useUIStore';

/** キーボードショートカットを管理するフック */
export function useKeyboardShortcuts(
  onExportPNG?: () => void,
) {
  const deleteRoom = useFloorPlanStore((s) => s.deleteRoom);
  const duplicateRoom = useFloorPlanStore((s) => s.duplicateRoom);
  const rotateRoom = useFloorPlanStore((s) => s.rotateRoom);
  const flipRoomH = useFloorPlanStore((s) => s.flipRoomH);
  const flipRoomV = useFloorPlanStore((s) => s.flipRoomV);
  const undo = useFloorPlanStore((s) => s.undo);
  const redo = useFloorPlanStore((s) => s.redo);
  const selectedRoomId = useUIStore((s) => s.selectedRoomId);
  const setSelectedRoom = useUIStore((s) => s.setSelectedRoom);
  const toggleGrid = useUIStore((s) => s.toggleGrid);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // テキスト入力中は無視
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      // Delete / Backspace → 削除
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedRoomId) {
        e.preventDefault();
        deleteRoom(selectedRoomId);
        setSelectedRoom(null);
        return;
      }

      // Ctrl+Z → Undo
      if (e.ctrlKey && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl+Shift+Z → Redo
      if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        redo();
        return;
      }

      // Ctrl+D → 複製
      if (e.ctrlKey && e.key === 'd' && selectedRoomId) {
        e.preventDefault();
        duplicateRoom(selectedRoomId);
        return;
      }

      // Ctrl+E → PNG出力
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        onExportPNG?.();
        return;
      }

      // R → 回転
      if (e.key === 'r' && selectedRoomId) {
        e.preventDefault();
        rotateRoom(selectedRoomId);
        return;
      }

      // H → 横反転
      if (e.key === 'h' && selectedRoomId) {
        e.preventDefault();
        flipRoomH(selectedRoomId);
        return;
      }

      // V → 縦反転
      if (e.key === 'v' && selectedRoomId) {
        e.preventDefault();
        flipRoomV(selectedRoomId);
        return;
      }

      // G → グリッドトグル
      if (e.key === 'g') {
        e.preventDefault();
        toggleGrid();
        return;
      }

      // Escape → 選択解除
      if (e.key === 'Escape') {
        setSelectedRoom(null);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedRoomId,
    deleteRoom,
    duplicateRoom,
    rotateRoom,
    flipRoomH,
    flipRoomV,
    undo,
    redo,
    setSelectedRoom,
    toggleGrid,
    onExportPNG,
  ]);
}
