import { ChevronLeft } from 'lucide-react';
import { TEMPLATES } from '../../constants/templates';
import { useFloorPlanStore } from '../../stores/useFloorPlanStore';
import { useUIStore } from '../../stores/useUIStore';
import { createFloorPlanFromTemplate } from '../../utils/template';
import type { Template } from '../../types';
import { TemplateCard } from './TemplateCard';
import { useIsMobile } from '../../hooks/useIsMobile';

export function TemplateSelector() {
  const loadFloorPlan = useFloorPlanStore((s) => s.loadFloorPlan);
  const setScreen = useUIStore((s) => s.setScreen);
  const isMobile = useIsMobile();

  const handleSelectTemplate = (template: Template) => {
    const floorPlan = createFloorPlanFromTemplate(template);
    loadFloorPlan(floorPlan);
    setScreen('editor');
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      <div className="shrink-0" style={{ padding: isMobile ? '16px 16px' : '28px 28px' }}>
        <button
          onClick={() => setScreen('choose')}
          className="flex items-center gap-1 text-[12px] text-[#C5C5C5] hover:text-[#32373c] transition-colors"
        >
          <ChevronLeft size={15} />
          戻る
        </button>
      </div>

      <div style={{ flex: isMobile ? '0' : '2' }} />

      <div className="text-center hero-enter" style={{ padding: '0 24px', marginTop: isMobile ? '16px' : '0' }}>
        <h2
          className="font-display font-semibold text-[#32373c]"
          style={{ fontSize: isMobile ? '22px' : '26px', marginBottom: '12px', letterSpacing: '0.1em' }}
        >
          テンプレートを選択
        </h2>
        <div className="gold-line mx-auto" />
      </div>

      <div
        className="flex items-start justify-center"
        style={{ flex: isMobile ? '1' : '3', padding: isMobile ? '24px 16px 0' : '56px 32px 0' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '12px' : '20px',
            maxWidth: '1000px',
            width: '100%',
          }}
        >
          {TEMPLATES.map((template, i) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleSelectTemplate}
              index={i}
            />
          ))}
        </div>
      </div>

      <div className="flex items-end justify-center" style={{ flex: '1', padding: isMobile ? '24px 0' : '40px 0' }}>
        <footer className="text-[10px] text-[#D5D5D5] tracking-widest font-light">
          &copy; 藤島建設 &nbsp;|&nbsp; 注文住宅の間取り作成・見積もり相談
        </footer>
      </div>
    </div>
  );
}
