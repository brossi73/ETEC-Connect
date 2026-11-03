import {
  BookOpen,
  CalendarClock,
  FilePlus2,
  FolderKanban,
  LayoutDashboard,
  X,
} from 'lucide-react';
import { ActiveRole, AppView } from '../types/atendimento';
import { CURRENT_STUDENT, ETEC_UNIT_INFO } from '../data/etecCatalog';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  activeRole: ActiveRole;
  onChangeRole: (role: ActiveRole) => void;
  ticketCount: number;
  waitingQueueCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItemConfig {
  id: AppView;
  label: string;
  icon: typeof LayoutDashboard;
  count?: number;
}

export function Sidebar({
  activeView,
  onSelectView,
  activeRole,
  onChangeRole,
  ticketCount,
  waitingQueueCount,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const navItems: NavItemConfig[] = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: LayoutDashboard,
    },
    {
      id: 'tickets',
      label: activeRole === 'aluno' ? 'Meus Protocolos' : 'Fila de Protocolos',
      icon: FolderKanban,
      count: ticketCount,
    },
    {
      id: 'new-ticket',
      label: 'Nova Solicitação',
      icon: FilePlus2,
    },
    {
      id: 'presencial',
      label: 'Atendimento Presencial',
      icon: CalendarClock,
      count: waitingQueueCount,
    },
    {
      id: 'guide',
      label: 'Guia & Regimento',
      icon: BookOpen,
    },
  ];

  const handleNavClick = (view: AppView) => {
    onSelectView(view);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white">
      <div>
        {/* Official ETEC + CPS Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={() => handleNavClick('overview')}
            className="text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B20000] rounded"
            aria-label="Ir para Visão Geral — Etec Prof. Dr. José Dagnoni"
          >
            <BrandLogo />
          </button>
          {mobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Fechar menu lateral"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Unit Identification Line */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-2.5 text-xs text-slate-600">
          <span className="font-medium text-[#3E4E56]">{ETEC_UNIT_INFO.unitCode}</span>
          <span className="mx-1.5 text-slate-400" aria-hidden="true">
            ·
          </span>
          <span>Secretaria Acadêmica</span>
        </div>

        {/* Navigation */}
        <nav aria-label="Navegação principal" className="space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B20000] ${
                  isActive
                    ? 'bg-[#FDF2F2] font-semibold text-[#B20000]'
                    : 'font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-3 whitespace-nowrap">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-[#B20000]' : 'text-[#3E4E56]'
                    }`}
                  />
                  <span>{item.label}</span>
                </span>
                {typeof item.count === 'number' && (
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      isActive ? 'font-semibold text-[#B20000]' : 'text-slate-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Switcher & Active Profile */}
      <div className="border-t border-slate-200 p-4 space-y-3">
        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-500">
            Ambiente de Acesso
          </p>
          <div
            role="group"
            aria-label="Alternar perfil de acesso"
            className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1"
          >
            <button
              type="button"
              onClick={() => onChangeRole('aluno')}
              aria-pressed={activeRole === 'aluno'}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-150 ${
                activeRole === 'aluno'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Portal do Aluno
            </button>
            <button
              type="button"
              onClick={() => onChangeRole('secretaria')}
              aria-pressed={activeRole === 'secretaria'}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-150 ${
                activeRole === 'secretaria'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Secretaria
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3E4E56] font-display text-xs font-bold text-white">
            {activeRole === 'aluno' ? 'BA' : 'SA'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {activeRole === 'aluno'
                ? CURRENT_STUDENT.name
                : 'Cláudia Helena Ribeiro'}
            </p>
            <p className="truncate text-xs text-slate-500 tabular-nums">
              {activeRole === 'aluno'
                ? `RM ${CURRENT_STUDENT.rm} · ${CURRENT_STUDENT.moduleOrSeries}`
                : 'Diretoria de Serviços Acadêmicos'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        aria-label="Barra lateral institucional"
        className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[268px] lg:shrink-0 lg:flex-col lg:border-r lg:border-slate-200 bg-white"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          <div
            className="fixed inset-0 bg-slate-900/50 transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 flex w-[280px] max-w-[85vw] flex-col bg-white shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
