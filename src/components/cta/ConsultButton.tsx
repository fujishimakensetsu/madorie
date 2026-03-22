import { ArrowRight } from 'lucide-react';

export function ConsultButton() {
  const handleClick = () => {
    // 将来的に外部フォームURLに置き換え
    alert('見積もり相談機能は近日公開予定です。');
  };

  return (
    <button
      onClick={handleClick}
      className="cta-btn cta-glow fixed bottom-6 right-6 z-50 group"
    >
      <span className="tracking-wider">この間取りで相談する</span>
      <ArrowRight size={16} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}
