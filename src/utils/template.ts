import { v4 as uuidv4 } from 'uuid';
import type { Floor, FloorPlan, Template } from '../types';
import { getRoomDefinition } from '../constants/rooms';

/** テンプレートからFloorPlanオブジェクトを生成 */
export function createFloorPlanFromTemplate(template: Template): FloorPlan {
  const floors: Floor[] = template.floors.map((tf) => ({
    id: uuidv4(),
    level: tf.level,
    rooms: tf.rooms.map((tr) => {
      const def = getRoomDefinition(tr.type);
      return {
        id: uuidv4(),
        type: tr.type,
        label: tr.label,
        x: tr.x,
        y: tr.y,
        width: tr.width,
        height: tr.height,
        rotation: 0 as const,
        flipH: false,
        flipV: false,
        color: def?.color ?? '#EEEEEE',
        floorLevel: tf.level,
      };
    }),
    doors: [],
    windows: [],
  }));

  return {
    id: uuidv4(),
    name: template.name,
    createdAt: new Date(),
    updatedAt: new Date(),
    floors,
    metadata: {
      templateId: template.id,
      totalArea: 0,
      totalTsubo: 0,
    },
  };
}

/** 空のFloorPlanを生成（階数指定可能） */
export function createEmptyFloorPlan(floorCount: number = 1): FloorPlan {
  const floors: Floor[] = Array.from({ length: floorCount }, (_, i) => ({
    id: uuidv4(),
    level: i + 1,
    rooms: [],
    doors: [],
    windows: [],
  }));

  return {
    id: uuidv4(),
    name: '新しい間取り',
    createdAt: new Date(),
    updatedAt: new Date(),
    floors,
    metadata: {
      totalArea: 0,
      totalTsubo: 0,
    },
  };
}
