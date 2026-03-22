import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { FloorPlan, Floor, Room, RoomType, AreaInfo } from '../types';
import { getRoomDefinition, isStairsType } from '../constants/rooms';
import { calculateRoomArea, calculateTotalArea } from '../utils/area';
import { createEmptyFloorPlan } from '../utils/template';

interface FloorPlanState {
  floorPlan: FloorPlan;
  currentFloor: number;

  // 操作履歴
  history: FloorPlan[];
  historyIndex: number;

  // 部屋操作
  addRoom: (type: RoomType, x: number, y: number, floorLevel?: number) => void;
  moveRoom: (id: string, x: number, y: number) => void;
  resizeRoom: (id: string, width: number, height: number) => void;
  rotateRoom: (id: string) => void;
  flipRoomH: (id: string) => void;
  flipRoomV: (id: string) => void;
  deleteRoom: (id: string) => void;
  duplicateRoom: (id: string) => void;
  updateRoomLabel: (id: string, label: string) => void;

  // テンプレート
  loadFloorPlan: (floorPlan: FloorPlan) => void;
  resetFloorPlan: () => void;

  // 操作履歴
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // 階切り替え
  setCurrentFloor: (level: number) => void;

  // 算出値
  getRoomArea: (id: string) => AreaInfo;
  getTotalArea: () => AreaInfo;
  getFloorArea: (level: number) => AreaInfo;
  getCurrentFloorData: () => Floor | undefined;
  getAllRooms: () => Room[];
}

const MAX_HISTORY = 50;

export const useFloorPlanStore = create<FloorPlanState>((set, get) => ({
  floorPlan: createEmptyFloorPlan(),
  currentFloor: 1,
  history: [],
  historyIndex: -1,

  pushHistory: () => {
    const { floorPlan, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    const snapshot = JSON.parse(JSON.stringify(floorPlan));
    newHistory.push(snapshot);
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  addRoom: (type, x, y, floorLevel) => {
    const state = get();
    state.pushHistory();
    const def = getRoomDefinition(type);
    if (!def) return;

    const level = floorLevel ?? state.currentFloor;
    const newRoom: Room = {
      id: uuidv4(),
      type,
      label: def.label,
      x,
      y,
      width: def.defaultWidth,
      height: def.defaultHeight,
      rotation: 0,
      flipH: false,
      flipV: false,
      color: def.color,
      floorLevel: level,
    };

    const updatedFloors = state.floorPlan.floors.map((floor) => {
      if (floor.level === level) {
        return { ...floor, rooms: [...floor.rooms, newRoom] };
      }
      return floor;
    });

    // 階が存在しない場合は新しい階を作成
    if (!updatedFloors.find((f) => f.level === level)) {
      updatedFloors.push({
        id: uuidv4(),
        level,
        rooms: [newRoom],
        doors: [],
        windows: [],
      });
    }

    set({
      floorPlan: {
        ...state.floorPlan,
        floors: updatedFloors,
        updatedAt: new Date(),
      },
    });
  },

  moveRoom: (id, x, y) => {
    const state = get();

    // 移動対象の部屋を検索
    let movedRoom: Room | undefined;
    for (const floor of state.floorPlan.floors) {
      movedRoom = floor.rooms.find((r) => r.id === id);
      if (movedRoom) break;
    }

    const updatedFloors = state.floorPlan.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => {
        if (room.id === id) return { ...room, x, y };
        // 階段を移動した場合、他の階の同タイプ階段も連動
        if (
          movedRoom &&
          isStairsType(movedRoom.type) &&
          room.type === movedRoom.type &&
          room.floorLevel !== movedRoom.floorLevel
        ) {
          return { ...room, x, y };
        }
        return room;
      }),
    }));
    set({
      floorPlan: {
        ...state.floorPlan,
        floors: updatedFloors,
        updatedAt: new Date(),
      },
    });
  },

  resizeRoom: (id, width, height) => {
    const state = get();
    const updatedFloors = state.floorPlan.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => {
        if (room.id !== id) return room;
        const def = getRoomDefinition(room.type);
        const minW = def?.minWidth ?? 1;
        const minH = def?.minHeight ?? 1;
        return {
          ...room,
          width: Math.max(width, minW),
          height: Math.max(height, minH),
        };
      }),
    }));
    set({
      floorPlan: {
        ...state.floorPlan,
        floors: updatedFloors,
        updatedAt: new Date(),
      },
    });
  },

  rotateRoom: (id) => {
    const state = get();
    state.pushHistory();
    const updatedFloors = state.floorPlan.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) => {
        if (room.id !== id) return room;
        // 90度回転: 幅と高さを入れ替え
        return {
          ...room,
          width: room.height,
          height: room.width,
          rotation: ((room.rotation + 90) % 360) as Room['rotation'],
        };
      }),
    }));
    set({
      floorPlan: {
        ...state.floorPlan,
        floors: updatedFloors,
        updatedAt: new Date(),
      },
    });
  },

  flipRoomH: (id) => {
    const state = get();
    state.pushHistory();
    const updatedFloors = state.floorPlan.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) =>
        room.id === id ? { ...room, flipH: !room.flipH } : room,
      ),
    }));
    set({
      floorPlan: {
        ...state.floorPlan,
        floors: updatedFloors,
        updatedAt: new Date(),
      },
    });
  },

  flipRoomV: (id) => {
    const state = get();
    state.pushHistory();
    const updatedFloors = state.floorPlan.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) =>
        room.id === id ? { ...room, flipV: !room.flipV } : room,
      ),
    }));
    set({
      floorPlan: {
        ...state.floorPlan,
        floors: updatedFloors,
        updatedAt: new Date(),
      },
    });
  },

  deleteRoom: (id) => {
    const state = get();
    state.pushHistory();
    const updatedFloors = state.floorPlan.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.filter((room) => room.id !== id),
    }));
    set({
      floorPlan: {
        ...state.floorPlan,
        floors: updatedFloors,
        updatedAt: new Date(),
      },
    });
  },

  duplicateRoom: (id) => {
    const state = get();
    state.pushHistory();
    for (const floor of state.floorPlan.floors) {
      const room = floor.rooms.find((r) => r.id === id);
      if (room) {
        const newRoom: Room = {
          ...room,
          id: uuidv4(),
          x: room.x + 1,
          y: room.y + 1,
        };
        const updatedFloors = state.floorPlan.floors.map((f) => {
          if (f.level === floor.level) {
            return { ...f, rooms: [...f.rooms, newRoom] };
          }
          return f;
        });
        set({
          floorPlan: {
            ...state.floorPlan,
            floors: updatedFloors,
            updatedAt: new Date(),
          },
        });
        return;
      }
    }
  },

  updateRoomLabel: (id, label) => {
    const state = get();
    const updatedFloors = state.floorPlan.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) =>
        room.id === id ? { ...room, label } : room,
      ),
    }));
    set({
      floorPlan: {
        ...state.floorPlan,
        floors: updatedFloors,
        updatedAt: new Date(),
      },
    });
  },

  loadFloorPlan: (floorPlan) => {
    set({
      floorPlan,
      currentFloor: 1,
      history: [],
      historyIndex: -1,
    });
  },

  resetFloorPlan: () => {
    set({
      floorPlan: createEmptyFloorPlan(),
      currentFloor: 1,
      history: [],
      historyIndex: -1,
    });
  },

  undo: () => {
    const { history, historyIndex, floorPlan } = get();
    if (historyIndex < 0) return;
    const restored = JSON.parse(JSON.stringify(history[historyIndex]));
    // 現在の状態を「やり直し」用にhistoryに保存
    const newHistory = [...history];
    if (historyIndex === newHistory.length - 1) {
      newHistory.push(JSON.parse(JSON.stringify(floorPlan)));
    }
    set({
      floorPlan: restored,
      history: newHistory,
      historyIndex: historyIndex - 1,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex + 2 >= history.length) return;
    const restored = JSON.parse(JSON.stringify(history[historyIndex + 2]));
    set({
      floorPlan: restored,
      historyIndex: historyIndex + 1,
    });
  },

  setCurrentFloor: (level) => {
    set({ currentFloor: level });
  },

  getRoomArea: (id) => {
    const state = get();
    for (const floor of state.floorPlan.floors) {
      const room = floor.rooms.find((r) => r.id === id);
      if (room) return calculateRoomArea(room);
    }
    return { sqm: 0, tsubo: 0, jou: 0 };
  },

  getTotalArea: () => {
    const state = get();
    const allRooms = state.floorPlan.floors.flatMap((f) => f.rooms);
    return calculateTotalArea(allRooms);
  },

  getFloorArea: (level) => {
    const state = get();
    const floor = state.floorPlan.floors.find((f) => f.level === level);
    if (!floor) return { sqm: 0, tsubo: 0, jou: 0 };
    return calculateTotalArea(floor.rooms);
  },

  getCurrentFloorData: () => {
    const state = get();
    return state.floorPlan.floors.find((f) => f.level === state.currentFloor);
  },

  getAllRooms: () => {
    const state = get();
    return state.floorPlan.floors.flatMap((f) => f.rooms);
  },
}));
