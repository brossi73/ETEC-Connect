import { ChevronRight, ExternalLink, FilePlus2, FolderKanban, Menu } from 'lucide-react';
import { ActiveRole, AppView } from '../types/atendimento';

interface TopHeaderProps {
  activeView: AppView;
  activeRole: ActiveRole;
  onNavigate: (view: AppView) => void;
  onOpenMobileMenu: () => void;
}

const VIEW_LABELS: Record<AppView, string> = {
  overview: 'Visão Geral',
  tickets: 'Protocolos Acadêmicos',
  'new-ticket': 'Nova Solicitação',
  presencial: 'Atendimento Presencial',
  guide: 'Guia Acadêmico & Regimento',
};

export function TopHeader({
  activeView,
  activeRole,
  onNavigate,
  onOpenMobileMenu,
}: TopHeaderProps) {
  return (
    <header className="no-print sticky top-0 z-30 flex h-14 lg:h-16 shrink-0 items-center justify-between gap-8 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Zone 1: Mobile Menu Trigger + Contextual Breadcrumb Trail */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Abrir menu de navegação"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav
          aria-label="Localização atual"
          className="flex min-w-0 items-center gap-2 text-sm"
        >
          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className="hidden sm:inline font-medium text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Etec José Dagnoni
          </button>
          <ChevronRight
            className="hidden sm:inline h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          <span className="hidden md:inline text-slate-500 whitespace-nowrap shrink-0">
            {activeRole === 'aluno' ? 'Portal do Aluno' : 'Balcão da Secretaria'}
          </span>
          <ChevronRight
            className="hidden md:inline h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          <span className="truncate font-display font-semibold text-slate-900">
            {VIEW_LABELS[activeView]}
          </span>
        </nav>
      </div>

      {/* Zone 2: Navigation Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <a
          href={typeof window !== 'undefined' ? window.location.href : '#'}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir o site em nova aba do navegador"
          aria-label="Abrir o site em nova aba do navegador"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B20000]"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <span>Abrir no Navegador</span>
        </a>

        {activeView !== 'new-ticket' ? (
          <button
            type="button"
            onClick={() => onNavigate('new-ticket')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#B20000] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#8F0000] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B20000]"
          >
            <FilePlus2 className="h-4 w-4 shrink-0" />
            <span>Nova Solicitação</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate('tickets')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B20000]"
          >
            <FolderKanban className="h-4 w-4 shrink-0" />
            <span>Ver Protocolos</span>
          </button>
        )}
      </div>
    </header>
  );
}
