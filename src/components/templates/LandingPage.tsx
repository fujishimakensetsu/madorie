import { useUIStore } from '../../stores/useUIStore';
import { useIsMobile } from '../../hooks/useIsMobile';

export function LandingPage() {
  const setScreen = useUIStore((s) => s.setScreen);
  const isMobile = useIsMobile();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white overflow-hidden relative">
      <div className="text-center hero-enter" style={{ padding: isMobile ? '0 24px' : '0 32px' }}>
        <h1
          className="font-display font-semibold text-[#32373c]"
          style={{ fontSize: isMobile ? '36px' : '52px', marginBottom: '20px', letterSpacing: '0.14em' }}
        >
          マドリエ
        </h1>
        <p
          className="text-[#ABABAB] font-light"
          style={{ fontSize: isMobile ? '13px' : '14px', letterSpacing: '0.06em', lineHeight: 1.8 }}
        >
          ドラッグ&ドロップで、理想の間取りを簡単に作成
        </p>
      </div>

      <div
        className="w-full bg-gradient-to-r from-transparent via-[#C8A96E]/50 to-transparent"
        style={{ height: '1px', marginTop: isMobile ? '40px' : '60px', marginBottom: isMobile ? '40px' : '60px' }}
      />

      <button
        onClick={() => setScreen('choose')}
        className="btn-enter inline-flex items-center justify-center rounded-full bg-[#32373c] text-white font-medium hover:bg-[#474d53] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-lg"
        style={{
          width: isMobile ? '180px' : '200px',
          height: isMobile ? '48px' : '52px',
          fontSize: isMobile ? '14px' : '15px',
          letterSpacing: '0.12em',
        }}
      >
        はじめる
      </button>

      <footer
        className="absolute text-[#D5D5D5] tracking-widest font-light text-center"
        style={{ bottom: isMobile ? '24px' : '40px', fontSize: '10px', padding: '0 20px' }}
      >
        &copy; 藤島建設 &nbsp;|&nbsp; 注文住宅の間取り作成・見積もり相談
      </footer>
    </div>
  );
}
