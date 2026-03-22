import type { Template } from '../../types';

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  index: number;
}

export function TemplateCard({ template, onSelect, index }: TemplateCardProps) {
  const floorCount = template.floors.length;
  const roomCount = template.floors.reduce((sum, f) => sum + f.rooms.length, 0);

  return (
    <button
      onClick={() => onSelect(template)}
      className="template-card group text-center px-8 py-9 bg-[#FAFAF8] rounded-2xl hover:bg-[#F0EFEC] transition-all"
      style={{ animationDelay: `${index * 80 + 150}ms` }}
    >
      <div className="text-[10px] text-[#C5C5C5] font-medium tracking-widest mb-4">
        {floorCount}階建て &middot; {roomCount}部屋
      </div>
      <h3 className="text-[17px] font-bold text-[#32373c] mb-3 group-hover:text-[#C8A96E] transition-colors">
        {template.name}
      </h3>
      <p className="text-[12px] text-[#ABABAB] leading-[1.8] mb-6">
        {template.description}
      </p>
      <span className="inline-block text-[11px] text-[#C5C5C5] group-hover:text-[#C8A96E] tracking-wider transition-colors">
        このプランで始める →
      </span>
    </button>
  );
}
