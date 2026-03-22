import { Download, ChevronLeft, MessageCircle } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface HeaderProps {
  onExportPNG: () => void;
  onBackToTop: () => void;
}

export function Header({ onExportPNG, onBackToTop }: HeaderProps) {
  const isMobile = useIsMobile();

  const handleConsult = () => {
    alert('見積もり相談機能は近日公開予定です。');
  };

  return (
    <header
      className="flex items-center justify-between bg-white border-b border-[#E8E6E1]/60 shrink-0"
      style={{ height: isMobile ? '48px' : '54px', padding: isMobile ? '0 10px' : '0 16px' }}
    >
      {/* 左: 戻る + ロゴ */}
      <div className="flex items-center" style={{ gap: isMobile ? '6px' : '12px' }}>
        <button
          onClick={onBackToTop}
          className="header-btn"
          style={{ padding: '0 10px', height: isMobile ? '30px' : '34px' }}
          title="トップに戻る"
        >
          <ChevronLeft size={16} />
        </button>
        <h1
          className="font-display font-semibold text-[#32373c]"
          style={{ fontSize: isMobile ? '14px' : '17px', letterSpacing: '0.14em' }}
        >
          マドリエ
        </h1>
      </div>

      {/* 右: 画像保存 + 相談 */}
      <div className="flex items-center" style={{ gap: isMobile ? '4px' : '8px' }}>
        <button
          onClick={onExportPNG}
          className="header-btn"
          style={{ height: isMobile ? '30px' : '34px', padding: isMobile ? '0 8px' : '0 16px' }}
          title="PNG画像として保存 (Ctrl+E)"
        >
          <Download size={14} />
          {!isMobile && <span>画像保存</span>}
        </button>
        <button
          onClick={handleConsult}
          className="flex items-center text-white font-semibold transition-all hover:opacity-90"
          style={{
            gap: '6px',
            height: isMobile ? '30px' : '34px',
            padding: isMobile ? '0 10px' : '0 16px',
            borderRadius: '9px',
            background: '#32373c',
            fontSize: isMobile ? '11px' : '12px',
            letterSpacing: '0.04em',
          }}
        >
          <MessageCircle size={14} />
          {!isMobile && <span>この間取りで相談</span>}
        </button>
      </div>
    </header>
  );
}
