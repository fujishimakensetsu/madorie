# 間取り作成ツール「マドリエ」 設計書

## 1. 技術スタック

### 1.1 フロントエンド

| 項目 | 技術 | 選定理由 |
|------|------|---------|
| フレームワーク | React 18 + TypeScript | 型安全性、コンポーネント設計の柔軟性 |
| ビルドツール | Vite | 高速な開発サーバー、HMR対応 |
| 2D描画 | Konva.js（react-konva） | Canvas描画、ドラッグ&ドロップ、パフォーマンス |
| 状態管理 | Zustand | 軽量、TypeScript親和性、undo/redo実装容易 |
| スタイリング | Tailwind CSS | ユーティリティファースト、UI構築高速化 |
| UIコンポーネント | shadcn/ui | アクセシビリティ対応、カスタマイズ性 |
| 画像出力 | Konva.toDataURL() / html2canvas | PNG出力用 |

### 1.2 バックエンド（Phase 2以降）

| 項目 | 技術 | 選定理由 |
|------|------|---------|
| API | FastAPI | 既存プロジェクトとの統一性 |
| データベース | Firebase Firestore | 間取りデータ・問い合わせデータの保存 |
| ホスティング | Firebase Hosting | 既存環境との親和性、CDN配信 |
| メール送信 | SendGrid or Firebase Functions | 問い合わせ通知メール |

### 1.3 開発環境

| 項目 | 技術 |
|------|------|
| パッケージマネージャ | npm |
| Linter | ESLint |
| Formatter | Prettier |
| Git | GitHub |

---

## 2. ディレクトリ構成

```
madorie/
├── public/
│   ├── favicon.ico
│   ├── ogp.png
│   └── templates/           # テンプレートJSONファイル
│       ├── 2ldk-25.json
│       ├── 3ldk-30.json
│       └── 4ldk-35.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types/
│   │   ├── index.ts          # 共通型定義
│   │   ├── room.ts           # 部屋関連の型
│   │   └── template.ts       # テンプレート型
│   ├── constants/
│   │   ├── grid.ts            # グリッド設定
│   │   ├── rooms.ts           # 部屋パーツ定義（名前・色・デフォルトサイズ等）
│   │   └── templates.ts       # テンプレート定義
│   ├── stores/
│   │   ├── useFloorPlanStore.ts  # メインの状態管理（Zustand）
│   │   └── useUIStore.ts         # UI状態（選択中パーツ、ズーム等）
│   ├── hooks/
│   │   ├── useCanvasInteraction.ts  # キャンバス操作（パン・ズーム）
│   │   ├── useDragAndDrop.ts        # ドラッグ&ドロップ制御
│   │   ├── useKeyboardShortcuts.ts  # キーボードショートカット
│   │   └── useAreaCalculation.ts    # 面積計算ロジック
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Toolbar.tsx
│   │   ├── canvas/
│   │   │   ├── FloorPlanCanvas.tsx   # メインキャンバス（react-konva Stage）
│   │   │   ├── GridLayer.tsx         # グリッド描画レイヤー
│   │   │   ├── RoomShape.tsx         # 個別の部屋図形コンポーネント
│   │   │   ├── DoorShape.tsx         # ドア図形
│   │   │   ├── WindowShape.tsx       # 窓図形
│   │   │   └── DimensionLabel.tsx    # 寸法線ラベル
│   │   ├── sidebar/
│   │   │   ├── RoomPalette.tsx       # 部屋パーツ一覧
│   │   │   ├── RoomCategory.tsx      # カテゴリ別パーツ表示
│   │   │   └── PropertyPanel.tsx     # 選択中パーツのプロパティ編集
│   │   ├── templates/
│   │   │   ├── TemplateSelector.tsx  # テンプレート選択画面
│   │   │   └── TemplateCard.tsx      # テンプレートカード
│   │   ├── info/
│   │   │   ├── AreaSummary.tsx       # 面積サマリー表示
│   │   │   └── FloorTabs.tsx         # 階切り替えタブ
│   │   └── cta/
│   │       ├── ConsultButton.tsx     # 見積もり相談ボタン（フローティング）
│   │       └── InquiryForm.tsx       # 問い合わせフォーム（モーダル）
│   ├── utils/
│   │   ├── geometry.ts        # 衝突判定、スナップ計算
│   │   ├── area.ts            # 面積変換（㎡→坪→畳）
│   │   ├── export.ts          # PNG出力処理
│   │   └── template.ts        # テンプレート読み込み・変換
│   └── styles/
│       └── globals.css
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 3. データモデル設計

### 3.1 FloorPlan（間取り全体）

```typescript
interface FloorPlan {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  floors: Floor[];
  metadata: {
    templateId?: string;    // 使用したテンプレートのID
    totalArea: number;      // 延床面積（㎡）
    totalTsubo: number;     // 坪数
  };
}
```

### 3.2 Floor（階）

```typescript
interface Floor {
  id: string;
  level: number;            // 1 = 1階, 2 = 2階
  rooms: Room[];
  doors: Door[];
  windows: FloorWindow[];
}
```

### 3.3 Room（部屋パーツ）

```typescript
interface Room {
  id: string;
  type: RoomType;
  label: string;            // 表示名（ユーザーが変更可能）
  x: number;                // グリッド座標X
  y: number;                // グリッド座標Y
  width: number;            // グリッド幅（半畳単位）
  height: number;           // グリッド高さ（半畳単位）
  rotation: 0 | 90 | 180 | 270;
  color: string;            // 塗りつぶし色
  floorLevel: number;       // 所属階
}

type RoomType =
  | 'ldk'
  | 'living'
  | 'dining'
  | 'kitchen'
  | 'master_bedroom'
  | 'western_room'
  | 'japanese_room'
  | 'children_room'
  | 'study'
  | 'bathroom'
  | 'washroom'
  | 'toilet'
  | 'laundry'
  | 'walk_in_closet'
  | 'shoes_cloak'
  | 'pantry'
  | 'storage'
  | 'entrance'
  | 'hallway'
  | 'stairs'
  | 'balcony'
  | 'deck'
  | 'garage';
```

### 3.4 Door / Window（建具）

```typescript
interface Door {
  id: string;
  type: 'sliding' | 'hinged';
  x: number;
  y: number;
  width: number;
  wallSide: 'top' | 'bottom' | 'left' | 'right';
  hingeSide?: 'left' | 'right';   // 開き戸の場合
  parentRoomId: string;
}

interface FloorWindow {
  id: string;
  type: 'double_sliding' | 'fix' | 'bay';
  x: number;
  y: number;
  width: number;
  wallSide: 'top' | 'bottom' | 'left' | 'right';
  parentRoomId: string;
}
```

### 3.5 部屋パーツ定義マスター

```typescript
interface RoomDefinition {
  type: RoomType;
  label: string;
  category: 'living' | 'water' | 'storage' | 'other';
  defaultWidth: number;    // デフォルト幅（グリッド単位）
  defaultHeight: number;   // デフォルト高さ（グリッド単位）
  minWidth: number;        // 最小幅
  minHeight: number;       // 最小高さ
  color: string;           // 表示色
  icon: string;            // アイコン名
}
```

以下が初期定義データ:

```typescript
const ROOM_DEFINITIONS: RoomDefinition[] = [
  // ── 居室系 ──
  { type: 'ldk',            label: 'LDK',             category: 'living',  defaultWidth: 8, defaultHeight: 6, minWidth: 6,  minHeight: 4, color: '#FFF3E0', icon: 'sofa' },
  { type: 'living',         label: 'リビング',          category: 'living',  defaultWidth: 6, defaultHeight: 4, minWidth: 4,  minHeight: 3, color: '#FFF8E1', icon: 'sofa' },
  { type: 'dining',         label: 'ダイニング',        category: 'living',  defaultWidth: 4, defaultHeight: 4, minWidth: 3,  minHeight: 3, color: '#FFFDE7', icon: 'utensils' },
  { type: 'kitchen',        label: 'キッチン',          category: 'living',  defaultWidth: 4, defaultHeight: 3, minWidth: 3,  minHeight: 2, color: '#F1F8E9', icon: 'chef-hat' },
  { type: 'master_bedroom', label: '主寝室',            category: 'living',  defaultWidth: 4, defaultHeight: 4, minWidth: 3,  minHeight: 3, color: '#E8EAF6', icon: 'bed-double' },
  { type: 'western_room',   label: '洋室',             category: 'living',  defaultWidth: 4, defaultHeight: 3, minWidth: 3,  minHeight: 3, color: '#E3F2FD', icon: 'bed-single' },
  { type: 'japanese_room',  label: '和室',             category: 'living',  defaultWidth: 4, defaultHeight: 4, minWidth: 3,  minHeight: 3, color: '#E8F5E9', icon: 'lamp-floor' },
  { type: 'children_room',  label: '子供部屋',          category: 'living',  defaultWidth: 3, defaultHeight: 3, minWidth: 3,  minHeight: 3, color: '#E1F5FE', icon: 'baby' },
  { type: 'study',          label: '書斎',             category: 'living',  defaultWidth: 3, defaultHeight: 2, minWidth: 2,  minHeight: 2, color: '#EDE7F6', icon: 'book-open' },

  // ── 水回り系 ──
  { type: 'bathroom',       label: '浴室',             category: 'water',   defaultWidth: 2, defaultHeight: 2, minWidth: 2,  minHeight: 2, color: '#E0F7FA', icon: 'bath' },
  { type: 'washroom',       label: '洗面脱衣室',        category: 'water',   defaultWidth: 2, defaultHeight: 2, minWidth: 2,  minHeight: 2, color: '#E0F2F1', icon: 'droplets' },
  { type: 'toilet',         label: 'トイレ',            category: 'water',   defaultWidth: 1, defaultHeight: 2, minWidth: 1,  minHeight: 2, color: '#F3E5F5', icon: 'toilet' },
  { type: 'laundry',        label: 'ランドリー',        category: 'water',   defaultWidth: 2, defaultHeight: 2, minWidth: 2,  minHeight: 2, color: '#E0F7FA', icon: 'washing-machine' },

  // ── 収納系 ──
  { type: 'walk_in_closet', label: 'WIC',              category: 'storage', defaultWidth: 2, defaultHeight: 3, minWidth: 2,  minHeight: 2, color: '#FBE9E7', icon: 'shirt' },
  { type: 'shoes_cloak',    label: 'シューズクローク',    category: 'storage', defaultWidth: 2, defaultHeight: 2, minWidth: 1,  minHeight: 2, color: '#EFEBE9', icon: 'footprints' },
  { type: 'pantry',         label: 'パントリー',        category: 'storage', defaultWidth: 2, defaultHeight: 2, minWidth: 1,  minHeight: 2, color: '#FFF3E0', icon: 'package' },
  { type: 'storage',        label: '納戸',             category: 'storage', defaultWidth: 2, defaultHeight: 2, minWidth: 2,  minHeight: 2, color: '#ECEFF1', icon: 'warehouse' },

  // ── その他 ──
  { type: 'entrance',       label: '玄関',             category: 'other',   defaultWidth: 2, defaultHeight: 2, minWidth: 2,  minHeight: 2, color: '#FBE9E7', icon: 'door-open' },
  { type: 'hallway',        label: '廊下',             category: 'other',   defaultWidth: 4, defaultHeight: 1, minWidth: 1,  minHeight: 1, color: '#FAFAFA', icon: 'move-horizontal' },
  { type: 'stairs',         label: '階段',             category: 'other',   defaultWidth: 2, defaultHeight: 4, minWidth: 2,  minHeight: 3, color: '#F5F5F5', icon: 'stairs' },
  { type: 'balcony',        label: 'バルコニー',        category: 'other',   defaultWidth: 6, defaultHeight: 2, minWidth: 2,  minHeight: 1, color: '#DCEDC8', icon: 'fence' },
  { type: 'deck',           label: 'ウッドデッキ',      category: 'other',   defaultWidth: 4, defaultHeight: 3, minWidth: 2,  minHeight: 2, color: '#D7CCC8', icon: 'trees' },
  { type: 'garage',         label: 'ガレージ',          category: 'other',   defaultWidth: 6, defaultHeight: 4, minWidth: 4,  minHeight: 3, color: '#CFD8DC', icon: 'car' },
];
```

---

## 4. コンポーネント設計

### 4.1 画面レイアウト構成

```
┌────────────────────────────────────────────────────────────────┐
│  Header（ロゴ / プロジェクト名 / 保存 / 出力ボタン）              │
├──────────┬──────────────────────────────────┬──────────────────┤
│          │                                  │                  │
│ Sidebar  │       FloorPlanCanvas            │  PropertyPanel   │
│          │       （メインキャンバス）          │ （選択時のみ表示） │
│ ・パーツ  │                                  │                  │
│   一覧   │   ┌─────────┐ ┌──────┐          │  ・部屋名編集     │
│          │   │  LDK    │ │ 洋室 │          │  ・サイズ変更     │
│ ・面積   │   │ 16畳    │ │ 6畳  │          │  ・色変更        │
│   サマリー│   └─────────┘ └──────┘          │  ・削除          │
│          │                                  │                  │
│          │   ┌──────┐  ┌──────┐            │                  │
│          │   │ 浴室 │  │洗面室│            │                  │
│          │   └──────┘  └──────┘            │                  │
│          │                                  │                  │
├──────────┴──────────────────────────────────┴──────────────────┤
│  Toolbar（Undo/Redo / ズーム / グリッドON-OFF / 階切り替え）     │
├───────────────────────────────────────────────────────────────-┤
│  [この間取りで見積もり相談する] ← フローティングCTA               │
└───────────────────────────────────────────────────────────────-┘
```

### 4.2 主要コンポーネント仕様

#### FloorPlanCanvas（メインキャンバス）

```
責務: Konva.Stageを管理し、全ての描画要素を統合するルートキャンバス

Props: なし（Zustand storeから直接参照）

内部構成:
  - Stage（react-konva）
    - Layer: GridLayer（グリッド線描画）
    - Layer: RoomLayer（部屋パーツ群）
    - Layer: DoorWindowLayer（建具群）
    - Layer: DimensionLayer（寸法線）

主要イベント:
  - onDragOver / onDrop: サイドバーからのパーツドロップ受付
  - onWheel: ズーム制御
  - onMouseDown + onMouseMove: パン操作（Spaceキー併用）

パフォーマンス考慮:
  - 各Layerを分離し、変更のあるLayerのみ再描画
  - React.memoで不要な再レンダリング防止
```

#### RoomShape（部屋図形コンポーネント）

```
責務: 1つの部屋パーツの描画・操作を担当

Props:
  room: Room

描画要素:
  - Rect: 部屋の矩形（塗りつぶし色 + 枠線）
  - Text: 部屋名ラベル（中央配置）
  - Text: 面積表示（部屋名の下に小さく表示、例: "8.0畳"）
  - Transformer: 選択時のリサイズハンドル表示

主要イベント:
  - onDragStart: ドラッグ開始 → 元位置を記憶
  - onDragMove: ドラッグ中 → グリッドスナップ適用
  - onDragEnd: ドラッグ終了 → storeに座標更新
  - onTransformEnd: リサイズ完了 → グリッドにスナップしてサイズ更新
  - onClick: 選択状態トグル
  - onDblClick: 部屋名インライン編集
```

#### Sidebar（サイドバー）

```
責務: 部屋パーツ一覧の表示、ドラッグ元として機能

内部構成:
  - RoomPalette
    - RoomCategory（居室系）
    - RoomCategory（水回り系）
    - RoomCategory（収納系）
    - RoomCategory（その他）
  - AreaSummary（面積サマリー）

ドラッグ:
  - HTML5 Drag and Drop APIを使用
  - dragStartでパーツ種別をdataTransferにセット
  - Canvas側のdropイベントで座標変換→Room生成
```

### 4.3 状態管理設計（Zustand Store）

#### useFloorPlanStore（メインストア）

```typescript
interface FloorPlanState {
  // ── データ ──
  floorPlan: FloorPlan;
  currentFloor: number;           // 表示中の階

  // ── 操作履歴 ──
  history: FloorPlan[];
  historyIndex: number;

  // ── アクション: 部屋操作 ──
  addRoom: (type: RoomType, x: number, y: number) => void;
  moveRoom: (id: string, x: number, y: number) => void;
  resizeRoom: (id: string, width: number, height: number) => void;
  rotateRoom: (id: string) => void;
  deleteRoom: (id: string) => void;
  duplicateRoom: (id: string) => void;
  updateRoomLabel: (id: string, label: string) => void;

  // ── アクション: 建具操作 ──
  addDoor: (door: Omit<Door, 'id'>) => void;
  addWindow: (window: Omit<FloorWindow, 'id'>) => void;
  deleteDoor: (id: string) => void;
  deleteWindow: (id: string) => void;

  // ── アクション: テンプレート ──
  loadTemplate: (templateId: string) => void;
  resetFloorPlan: () => void;

  // ── アクション: 操作履歴 ──
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // ── アクション: 階切り替え ──
  setCurrentFloor: (level: number) => void;

  // ── 算出値 ──
  getRoomArea: (id: string) => { sqm: number; tsubo: number; jou: number };
  getTotalArea: () => { sqm: number; tsubo: number; jou: number };
  getFloorArea: (level: number) => { sqm: number; tsubo: number; jou: number };
}
```

#### useUIStore（UI状態ストア）

```typescript
interface UIState {
  selectedRoomId: string | null;
  zoom: number;                    // 0.5〜2.0
  panOffset: { x: number; y: number };
  showGrid: boolean;
  showDimensions: boolean;
  isDraggingFromPalette: boolean;
  draggingRoomType: RoomType | null;

  setSelectedRoom: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  toggleGrid: () => void;
  toggleDimensions: () => void;
  setDraggingFromPalette: (isDragging: boolean, type?: RoomType) => void;
}
```

---

## 5. グリッドシステム設計

### 5.1 グリッド単位

```
基本単位: 半畳 = 910mm × 910mm
1グリッド = 910mm（実寸）

Canvas上の表現:
  1グリッド = 40px（デフォルトズーム時）
  → ズーム倍率に応じて変動

座標系:
  グリッド座標: (0, 0) が左上起点
  実寸換算: x_mm = gridX * 910
  Canvas座標: x_px = gridX * GRID_SIZE * zoom
```

### 5.2 スナップ処理

```typescript
function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

// ドラッグ終了時にスナップ
function onDragEnd(e: KonvaEventObject<DragEvent>) {
  const snappedX = snapToGrid(e.target.x(), GRID_PX);
  const snappedY = snapToGrid(e.target.y(), GRID_PX);
  e.target.position({ x: snappedX, y: snappedY });
  // → storeに反映
}
```

---

## 6. 面積計算ロジック

```typescript
const GRID_MM = 910;       // 1グリッド = 910mm
const SQM_PER_TSUBO = 3.30579;
const SQM_PER_JOU = 1.62;  // 中京間基準

function calculateRoomArea(room: Room): {
  sqm: number;
  tsubo: number;
  jou: number;
} {
  const widthMM = room.width * GRID_MM;
  const heightMM = room.height * GRID_MM;
  const sqm = (widthMM * heightMM) / 1_000_000;   // mm² → ㎡
  return {
    sqm: Math.round(sqm * 100) / 100,
    tsubo: Math.round((sqm / SQM_PER_TSUBO) * 100) / 100,
    jou: Math.round((sqm / SQM_PER_JOU) * 100) / 100,
  };
}

function calculateTotalArea(rooms: Room[]): {
  sqm: number;
  tsubo: number;
  jou: number;
} {
  // バルコニー・デッキ・ガレージは延床面積に含めない
  const EXCLUDED_TYPES: RoomType[] = ['balcony', 'deck', 'garage'];
  const targetRooms = rooms.filter(r => !EXCLUDED_TYPES.includes(r.type));
  const totalSqm = targetRooms.reduce((sum, room) => {
    return sum + calculateRoomArea(room).sqm;
  }, 0);
  return {
    sqm: Math.round(totalSqm * 100) / 100,
    tsubo: Math.round((totalSqm / SQM_PER_TSUBO) * 100) / 100,
    jou: Math.round((totalSqm / SQM_PER_JOU) * 100) / 100,
  };
}
```

---

## 7. テンプレートデータ設計

### 7.1 テンプレートJSON形式

```json
{
  "id": "3ldk-30",
  "name": "3LDK（約30坪）",
  "description": "ファミリー向けスタンダード。LDK16畳+洋室3部屋",
  "thumbnail": "/templates/3ldk-30-thumb.png",
  "floors": [
    {
      "level": 1,
      "rooms": [
        { "type": "ldk",       "label": "LDK",       "x": 2,  "y": 2,  "width": 8, "height": 4 },
        { "type": "entrance",  "label": "玄関",       "x": 0,  "y": 4,  "width": 2, "height": 2 },
        { "type": "toilet",    "label": "トイレ",      "x": 0,  "y": 2,  "width": 1, "height": 2 },
        { "type": "bathroom",  "label": "浴室",       "x": 10, "y": 2,  "width": 2, "height": 2 },
        { "type": "washroom",  "label": "洗面脱衣室",   "x": 10, "y": 4,  "width": 2, "height": 2 },
        { "type": "stairs",    "label": "階段",       "x": 1,  "y": 0,  "width": 2, "height": 2 },
        { "type": "hallway",   "label": "廊下",       "x": 0,  "y": 0,  "width": 1, "height": 4 }
      ]
    },
    {
      "level": 2,
      "rooms": [
        { "type": "master_bedroom", "label": "主寝室",   "x": 0,  "y": 0, "width": 4, "height": 4 },
        { "type": "western_room",   "label": "洋室1",    "x": 4,  "y": 0, "width": 4, "height": 3 },
        { "type": "children_room",  "label": "子供部屋",  "x": 8,  "y": 0, "width": 4, "height": 3 },
        { "type": "walk_in_closet", "label": "WIC",      "x": 0,  "y": 4, "width": 2, "height": 2 },
        { "type": "toilet",         "label": "トイレ",    "x": 4,  "y": 3, "width": 1, "height": 2 },
        { "type": "stairs",         "label": "階段",     "x": 2,  "y": 4, "width": 2, "height": 2 },
        { "type": "balcony",        "label": "バルコニー", "x": 4, "y": 5, "width": 8, "height": 2 }
      ]
    }
  ]
}
```

### 7.2 初期テンプレート一覧（Phase 1）

| テンプレートID | 名前 | 延床面積目安 | 構成 |
|---------------|------|------------|------|
| 2ldk-25 | 2LDK（約25坪） | 82㎡ | 夫婦2人向け。LDK14畳+洋室2部屋 |
| 3ldk-30 | 3LDK（約30坪） | 99㎡ | ファミリー向け。LDK16畳+洋室3部屋 |
| 4ldk-35 | 4LDK（約35坪） | 115㎡ | ゆとりの4部屋。LDK18畳+洋室4部屋 |

---

## 8. PNG出力設計

```typescript
async function exportAsPNG(stageRef: React.RefObject<Konva.Stage>): Promise<void> {
  if (!stageRef.current) return;

  // グリッド非表示、選択解除してからキャプチャ
  const gridLayer = stageRef.current.findOne('#grid-layer');
  gridLayer?.hide();

  const dataURL = stageRef.current.toDataURL({
    pixelRatio: 2,       // 高解像度出力
    mimeType: 'image/png',
  });

  gridLayer?.show();

  // ダウンロード
  const link = document.createElement('a');
  link.download = `間取り_${new Date().toISOString().slice(0, 10)}.png`;
  link.href = dataURL;
  link.click();
}
```

---

## 9. キーボードショートカット

| キー | アクション |
|------|----------|
| Delete / Backspace | 選択中のパーツを削除 |
| Ctrl + Z | 元に戻す（Undo） |
| Ctrl + Shift + Z | やり直し（Redo） |
| Ctrl + D | 選択中のパーツを複製 |
| Ctrl + S | 保存（ブラウザストレージ） |
| Ctrl + E | PNG出力 |
| R | 選択中のパーツを90度回転 |
| G | グリッド表示ON/OFF |
| Space + ドラッグ | キャンバスパン |
| ホイール | ズーム |
| Escape | 選択解除 |

---

## 10. 問い合わせデータ送信仕様（Phase 2）

```typescript
interface InquiryData {
  // ── 顧客情報 ──
  name: string;
  email: string;
  phone: string;
  preferredArea: string;       // 希望建築エリア
  message: string;             // ご要望・備考

  // ── 間取りデータ ──
  floorPlanJSON: string;       // FloorPlanオブジェクトをJSON化
  floorPlanImage: string;      // PNG画像のBase64
  totalArea: number;           // 延床面積（㎡）
  totalTsubo: number;          // 坪数
  roomCount: number;           // 部屋数
  floorCount: number;          // 階数

  // ── メタ ──
  templateUsed: string | null; // 使用テンプレート名
  createdAt: string;           // ISO 8601
  userAgent: string;
}
```

---

## 11. デザインガイドライン

### 11.1 カラーパレット

| 用途 | カラーコード | 備考 |
|------|------------|------|
| プライマリ | #2D5F2D | 藤島建設のコーポレートカラー（森林グリーン） |
| プライマリLight | #4A8C4A | ホバー・アクティブ |
| セカンダリ | #D4A76A | 木材・ナチュラル感（ベージュ系） |
| 背景 | #FAFAF8 | 温かみのあるオフホワイト |
| キャンバス背景 | #FFFFFF | 白 |
| グリッド線 | #E8E8E8 | 薄グレー |
| テキスト | #333333 | メインテキスト |
| サブテキスト | #888888 | 補助テキスト |
| CTA | #C75C2A | オレンジ系（注目を引く） |

### 11.2 フォント

```css
font-family: 'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif;
```

### 11.3 部屋パーツの配色

各部屋タイプに視認性の良いパステルカラーを割り当てる（3.5 部屋パーツ定義マスターのcolor値を参照）。壁は#555555の2px実線で描画。

---

## 12. 開発タスク分解（Phase 1: MVP）

### Step 1: プロジェクトセットアップ
- [ ] Vite + React + TypeScript プロジェクト作成
- [ ] Tailwind CSS セットアップ
- [ ] react-konva, zustand インストール
- [ ] ディレクトリ構造作成
- [ ] 型定義ファイル作成

### Step 2: コア描画機能
- [ ] FloorPlanCanvas（Konva Stage）実装
- [ ] GridLayer（グリッド描画）実装
- [ ] RoomShape（部屋図形）実装
- [ ] ドラッグ移動 + グリッドスナップ
- [ ] リサイズ + グリッドスナップ

### Step 3: サイドバー・パーツ配置
- [ ] Sidebar / RoomPalette 実装
- [ ] RoomCategory（カテゴリ分け）実装
- [ ] ドラッグ&ドロップ（サイドバー → キャンバス）
- [ ] パーツ削除

### Step 4: 状態管理・操作
- [ ] useFloorPlanStore 実装
- [ ] useUIStore 実装
- [ ] 面積自動計算ロジック
- [ ] AreaSummary コンポーネント

### Step 5: テンプレート
- [ ] テンプレートJSON 3種類作成
- [ ] TemplateSelector 画面実装
- [ ] テンプレート読み込みロジック

### Step 6: ヘッダー・ツールバー・出力
- [ ] Header 実装（ロゴ・プロジェクト名）
- [ ] Toolbar 実装（ズーム・グリッドON/OFF）
- [ ] PNG出力機能
- [ ] キーボードショートカット

### Step 7: 集客導線
- [ ] ConsultButton（フローティングCTA）
- [ ] 外部フォームへのリンク設置
- [ ] フッター（会社情報）

### Step 8: テスト・調整
- [ ] PC Chrome での動作確認
- [ ] パフォーマンス確認（50パーツ配置）
- [ ] エッジケース対応（キャンバス外へのドラッグ等）
- [ ] レスポンシブ最低限対応
