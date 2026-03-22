import { create } from 'zustand';
import type { RoomType } from '../types';

interface UIState {
  // 選択
  selectedRoomId: string | null;

  // ズーム・パン
  zoom: number;
  panOffset: { x: number; y: number };

  // 表示設定
  showGrid: boolean;
  showDimensions: boolean;

  // ドラッグ状態
  isDraggingFromPalette: boolean;
  draggingRoomType: RoomType | null;

  // 画面モード
  screen: 'landing' | 'choose' | 'template' | 'blank-floors' | 'editor';

  // アクション
  setSelectedRoom: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  toggleGrid: () => void;
  toggleDimensions: () => void;
  setDraggingFromPalette: (isDragging: boolean, type?: RoomType) => void;
  setScreen: (screen: 'landing' | 'choose' | 'template' | 'blank-floors' | 'editor') => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedRoomId: null,
  zoom: 1,
  panOffset: { x: 20, y: 20 },
  showGrid: true,
  showDimensions: true,
  isDraggingFromPalette: false,
  draggingRoomType: null,
  screen: 'landing',

  setSelectedRoom: (id) => set({ selectedRoomId: id }),

  setZoom: (zoom) => set({ zoom: Math.max(0.3, Math.min(2.5, zoom)) }),

  setPanOffset: (offset) => set({ panOffset: offset }),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  toggleDimensions: () =>
    set((state) => ({ showDimensions: !state.showDimensions })),

  setDraggingFromPalette: (isDragging, type) =>
    set({
      isDraggingFromPalette: isDragging,
      draggingRoomType: type ?? null,
    }),

  setScreen: (screen) => set({ screen }),
}));
