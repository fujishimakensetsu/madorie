import { useAreaCalculation } from '../../hooks/useAreaCalculation';

export function AreaSummary() {
  const { totalArea, floorAreas } = useAreaCalculation();

  return (
    <div className="border-t border-[#EEEDEA] bg-[#FAFAF8]" style={{ padding: '16px 18px' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
        <span className="text-[10px] font-semibold tracking-[0.15em] text-[#B5B5B5] uppercase">
          面積
        </span>
        <div className="flex-1 h-px bg-[#EEEDEA]" />
      </div>

      {/* 階別 */}
      {floorAreas.map(({ level, area }) => (
        <div key={level} className="flex justify-between" style={{ fontSize: '12px', padding: '4px 0' }}>
          <span className="text-[#B5B5B5] font-medium">{level}F</span>
          <span className="tabular-nums text-[#7A7A7A]">
            {area.sqm}㎡
            <span className="text-[#C5C5C5]" style={{ marginLeft: '6px' }}>({area.tsubo}坪)</span>
          </span>
        </div>
      ))}

      {/* 合計 */}
      <div className="text-center border-t border-[#EEEDEA]" style={{ marginTop: '12px', paddingTop: '12px' }}>
        <div className="text-[#B5B5B5] font-medium uppercase" style={{ fontSize: '9px', letterSpacing: '0.15em', marginBottom: '4px' }}>延床面積</div>
        <div className="font-bold tabular-nums text-[#32373c]" style={{ fontSize: '20px', letterSpacing: '0.04em' }}>
          {totalArea.sqm}
          <span className="text-[#B5B5B5] font-medium" style={{ fontSize: '12px', marginLeft: '4px' }}>㎡</span>
        </div>
        <div className="text-[#C5C5C5] tabular-nums" style={{ fontSize: '11px', marginTop: '2px' }}>
          {totalArea.tsubo}坪 / {totalArea.jou}畳
        </div>
      </div>
    </div>
  );
}
