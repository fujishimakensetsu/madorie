import { ChevronLeft, ArrowRight } from 'lucide-react';
import { useFloorPlanStore } from '../../stores/useFloorPlanStore';
import { useUIStore } from '../../stores/useUIStore';
import { createEmptyFloorPlan } from '../../utils/template';
import { useIsMobile } from '../../hooks/useIsMobile';

const FLOOR_OPTIONS = [
  { floors: 1, label: '平屋', sub: '1階建て' },
  { floors: 2, label: '2階建て', sub: 'スタンダード' },
  { floors: 3, label: '3階建て', sub: '二世帯・都市型' },
];

export function BlankFloorsScreen() {
  const loadFloorPlan = useFloorPlanStore((s) => s.loadFloorPlan);
  const setScreen = useUIStore((s) => s.setScreen);
  const isMobile = useIsMobile();

  const handleSelect = (floorCount: number) => {
    loadFloorPlan(createEmptyFloorPlan(floorCount));
    setScreen('editor');
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="shrink-0" style={{ padding: isMobile ? '16px 16px' : '28px 28px' }}>
        <button
          onClick={() => setScreen('choose')}
          className="flex items-center gap-1 text-[12px] text-[#C5C5C5] hover:text-[#32373c] transition-colors"
        >
          <ChevronLeft size={15} />
          戻る
        </button>
      </div>

      <div className="flex-[2]" />

      <div className="text-center hero-enter" style={{ padding: '0 24px' }}>
        <h2
          className="font-display font-semibold text-[#32373c]"
          style={{ fontSize: isMobile ? '22px' : '26px', marginBottom: '12px', letterSpacing: '0.1em' }}
        >
          階数を選択
        </h2>
        <div className="gold-line mx-auto" />
      </div>

      <div
        className="flex-[3] flex items-start justify-center"
        style={{ paddingTop: isMobile ? '32px' : '64px', padding: isMobile ? '32px 20px 0' : '64px 32px 0' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '20px' : '48px',
            alignItems: 'center',
          }}
        >
          {FLOOR_OPTIONS.map((opt, i) => (
            <div key={opt.floors} className="flex items-center" style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '20px' : '48px' }}>
              {i > 0 && !isMobile && <div className="w-px self-stretch bg-[#EEEDEA]" style={{ margin: '-16px 0' }} />}
              {i > 0 && isMobile && <div className="h-px bg-[#EEEDEA]" style={{ width: '80px' }} />}
              <button
                onClick={() => handleSelect(opt.floors)}
                className="template-card group text-center hover:opacity-70 transition-all duration-300"
                style={{ width: isMobile ? '240px' : '160px', animationDelay: `${i * 100 + 150}ms` }}
              >
                <div
                  className="font-display text-[#C8A96E] mx-auto leading-none"
                  style={{ fontSize: isMobile ? '36px' : '40px', marginBottom: '16px' }}
                >
                  {opt.floors}
                </div>
                <h3 className="font-bold text-[#32373c] tracking-wide" style={{ fontSize: isMobile ? '16px' : '17px', marginBottom: '4px' }}>
                  {opt.label}
                </h3>
                <p className="text-[#B5B5B5]" style={{ fontSize: '11px', marginBottom: '20px' }}>
                  {opt.sub}
                </p>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#C8A96E] tracking-wider">
                  <span>はじめる</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-[1] flex items-end justify-center" style={{ paddingBottom: isMobile ? '24px' : '40px' }}>
        <footer className="text-[10px] text-[#D5D5D5] tracking-widest font-light">
          &copy; 藤島建設 &nbsp;|&nbsp; 注文住宅の間取り作成・見積もり相談
        </footer>
      </div>
    </div>
  );
}
