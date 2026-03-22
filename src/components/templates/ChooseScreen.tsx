import { LayoutGrid, PenLine, ChevronLeft, ArrowRight } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useIsMobile } from '../../hooks/useIsMobile';

export function ChooseScreen() {
  const setScreen = useUIStore((s) => s.setScreen);
  const isMobile = useIsMobile();

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div style={{ padding: isMobile ? '16px 16px' : '28px 28px' }} className="shrink-0">
        <button
          onClick={() => setScreen('landing')}
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
          作成方法を選択
        </h2>
        <div className="gold-line mx-auto" />
      </div>

      <div className="flex-[3] flex items-start justify-center" style={{ paddingTop: isMobile ? '40px' : '64px', padding: isMobile ? '40px 20px 0' : '64px 32px 0' }}>
        <div className="flex" style={{ gap: isMobile ? '24px' : '64px', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
          <button
            onClick={() => setScreen('template')}
            className="template-card group text-center hover:opacity-70 transition-all duration-300"
            style={{ width: isMobile ? '260px' : '200px', animationDelay: '150ms' }}
          >
            <LayoutGrid size={isMobile ? 28 : 32} className="text-[#C8A96E] mx-auto" style={{ marginBottom: isMobile ? '16px' : '20px' }} />
            <h3 className="font-bold text-[#32373c] tracking-wide" style={{ fontSize: isMobile ? '16px' : '17px', marginBottom: '8px' }}>
              テンプレートから
            </h3>
            <p className="text-[#B5B5B5]" style={{ fontSize: '12px', lineHeight: 1.8, marginBottom: '20px' }}>
              用意されたプランをベースに編集
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#C8A96E] tracking-wider">
              <span>選択する</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>

          {!isMobile && <div className="w-px self-stretch bg-[#EEEDEA]" style={{ margin: '16px 0' }} />}
          {isMobile && <div className="h-px bg-[#EEEDEA]" style={{ width: '120px' }} />}

          <button
            onClick={() => setScreen('blank-floors')}
            className="template-card group text-center hover:opacity-70 transition-all duration-300"
            style={{ width: isMobile ? '260px' : '200px', animationDelay: '250ms' }}
          >
            <PenLine size={isMobile ? 28 : 32} className="text-[#C8A96E] mx-auto" style={{ marginBottom: isMobile ? '16px' : '20px' }} />
            <h3 className="font-bold text-[#32373c] tracking-wide" style={{ fontSize: isMobile ? '16px' : '17px', marginBottom: '8px' }}>
              ゼロから作成
            </h3>
            <p className="text-[#B5B5B5]" style={{ fontSize: '12px', lineHeight: 1.8, marginBottom: '20px' }}>
              白紙のキャンバスに自由にレイアウト
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#C8A96E] tracking-wider">
              <span>はじめる</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
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
