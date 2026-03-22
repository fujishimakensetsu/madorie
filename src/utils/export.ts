import Konva from 'konva';
import { GRID_PX } from '../constants/grid';

/**
 * キャンバスをPNG画像としてダウンロード
 * - グリッド線を含める
 * - 白背景（透過なし）
 * - 間取り全体が収まるサイズで切り出し
 */
export async function exportAsPNG(
  stageRef: React.RefObject<Konva.Stage | null>,
): Promise<void> {
  const stage = stageRef.current;
  if (!stage) return;

  const roomLayer = stage.getLayers()[1]; // Rooms layer (index 1)
  if (!roomLayer) return;

  const children = roomLayer.getChildren();
  if (children.length === 0) {
    alert('間取りパーツがありません。');
    return;
  }

  // 現在のズーム・パンを保存
  const origScaleX = stage.scaleX();
  const origScaleY = stage.scaleY();
  const origX = stage.x();
  const origY = stage.y();

  // ズーム・パンをリセットして正確な座標を取得
  stage.scaleX(1);
  stage.scaleY(1);
  stage.x(0);
  stage.y(0);
  stage.batchDraw();

  // 全パーツの範囲を算出（ズーム1x、パン0で正確な座標）
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  children.forEach((child) => {
    const rect = child.getClientRect({ relativeTo: stage });
    if (rect.width === 0 || rect.height === 0) return;
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + rect.width);
    maxY = Math.max(maxY, rect.y + rect.height);
  });

  if (!isFinite(minX)) {
    // 復元
    stage.scaleX(origScaleX);
    stage.scaleY(origScaleY);
    stage.x(origX);
    stage.y(origY);
    stage.batchDraw();
    return;
  }

  // 余白: グリッド2マス分
  const padding = GRID_PX * 2;
  const exportX = minX - padding;
  const exportY = minY - padding;
  const exportWidth = (maxX - minX) + padding * 2;
  const exportHeight = (maxY - minY) + padding * 2;

  // グリッドレイヤーを表示状態にする
  const gridLayer = stage.findOne('#grid-layer');
  const gridWasHidden = gridLayer ? !gridLayer.visible() : false;
  gridLayer?.show();
  stage.batchDraw();

  const dataURL = stage.toDataURL({
    pixelRatio: 2,
    mimeType: 'image/png',
    x: exportX,
    y: exportY,
    width: exportWidth,
    height: exportHeight,
  });

  // グリッドを元の状態に戻す
  if (gridWasHidden) {
    gridLayer?.hide();
  }

  // ズーム・パンを復元
  stage.scaleX(origScaleX);
  stage.scaleY(origScaleY);
  stage.x(origX);
  stage.y(origY);
  stage.batchDraw();

  // 白背景を合成
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 白背景を描画
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 間取り画像を重ねる
    ctx.drawImage(img, 0, 0);

    const finalURL = canvas.toDataURL('image/png');

    // ダウンロード
    const link = document.createElement('a');
    link.download = `間取り_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = finalURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  img.src = dataURL;
}
