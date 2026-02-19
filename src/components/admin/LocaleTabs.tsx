'use client';

type Tab = 'es' | 'en';

interface LocaleTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  hasEnContent?: boolean;
}

export function LocaleTabs({ activeTab, onTabChange, hasEnContent }: LocaleTabsProps) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
      <button
        type="button"
        onClick={() => onTabChange('es')}
        className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
          activeTab === 'es'
            ? 'bg-[#1D194C] text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        Español
      </button>
      <button
        type="button"
        onClick={() => onTabChange('en')}
        className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
          activeTab === 'en'
            ? 'bg-[#1D194C] text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        English
      </button>
      {hasEnContent === false && (
        <span className="text-xs text-amber-600 ml-2">Inglés pendiente</span>
      )}
    </div>
  );
}
