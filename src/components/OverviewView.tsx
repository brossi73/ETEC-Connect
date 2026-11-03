import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  FilePlus2,
  AlertCircle,
  FileSearch,
} from 'lucide-react';
import {
  ActiveRole,
  AppView,
  QueueState,
  QueueTicket,
  ServiceCatalogItem,
  SupportTicket,
  TicketStatus,
} from '../types/atendimento';
import { CURRENT_STUDENT, ETEC_UNIT_INFO, SERVICE_CATALOG } from '../data/etecCatalog';
import {
  computeTicketMetrics,
  formatShortDatePtBr,
  isTicketOverdue,
} from '../utils/atendimentoRules';

interface OverviewViewProps {
  activeRole: ActiveRole;
  tickets: SupportTicket[];
  queue: QueueTicket[];
  nowIso: string;
  onNavigate: (view: AppView) => void;
  onStartServiceRequest: (serviceId: string) => void;
  onSelectTicket: (ticket: SupportTicket) => void;
}

export function getStatusPresentation(status: TicketStatus) {
  switch (status) {
    case TicketStatus.ABERTO:
      return {
        label: 'Aberto',
        textColor: 'text-slate-700',
        Icon: Clock,
      };
    case TicketStatus.EM_ANALISE:
      return {
        label: 'Em Análise',
        textColor: 'text-amber-700',
        Icon: FileSearch,
      };
    case TicketStatus.AGUARDANDO_ALUNO:
      return {
        label: 'Aguardando Aluno',
        textColor: 'text-[#B20000]',
        Icon: AlertCircle,
      };
    case TicketStatus.CONCLUIDO:
      return {
        label: 'Concluído',
        textColor: 'text-emerald-700',
        Icon: CheckCircle2,
      };
    case TicketStatus.INDEFERIDO:
      return {
        label: 'Indeferido',
        textColor: 'text-slate-600',
        Icon: AlertCircle,
      };
  }
}

export function OverviewView({
  activeRole,
  tickets,
  queue,
  nowIso,
  onNavigate,
  onStartServiceRequest,
  onSelectTicket,
}: OverviewViewProps) {
  const scopedTickets =
    activeRole === 'aluno'
      ? tickets.filter((t) => t.studentRm === CURRENT_STUDENT.rm)
      : tickets;

  const metrics = computeTicketMetrics(scopedTickets, nowIso);
  const activeCounterTicket = queue.find((q) => q.state === QueueState.CHAMADO);
  const waitingQueueCount = queue.filter((q) => q.state === QueueState.AGUARDANDO).length;
  const recentTickets = [...scopedTickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const featuredServices: ServiceCatalogItem[] = SERVICE_CATALOG.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Institutional Welcome Banner */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-[#B20000]">
                {ETEC_UNIT_INFO.institution}
              </span>
              <span aria-hidden="true">·</span>
              <span>{ETEC_UNIT_INFO.city}</span>
              <span aria-hidden="true">·</span>
              <span>2º Semestre Letivo de 2026</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {activeRole === 'aluno'
                ? `Olá, ${CURRENT_STUDENT.name.split(' ')[0]} — Central de Atendimento ao Aluno`
                : 'Painel de Triagem — Diretoria de Serviços Acadêmicos'}
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              {activeRole === 'aluno'
                ? `Acompanhe requerimentos protocolados para o curso ${CURRENT_STUDENT.course} (RM ${CURRENT_STUDENT.rm}), solicite declarações oficiais ou retire senha para atendimento presencial nos guichês da unidade.`
                : 'Gerencie protocolos acadêmicos dos estudantes, emita pareceres regimentais dentro do prazo SLA e opere a chamada de senhas dos Guichês 01 a 04.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('tickets')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#3E4E56] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#253137] transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              <span>
                {activeRole === 'aluno'
                  ? 'Consultar Meus Protocolos'
                  : 'Abrir Fila de Triagem'}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('presencial')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              <CalendarClock className="h-4 w-4 shrink-0 text-[#3E4E56]" />
              <span>Senhas & Agendamento</span>
            </button>
          </div>
        </div>
      </section>

      {/* Full-Width 4-Column KPI Strip (Single-Elevation, Tabular Numerals) */}
      <section
        aria-label="Indicadores de atendimento"
        className="grid grid-cols-1 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white sm:grid-cols-2 sm:divide-y-0 sm:divide-x xl:grid-cols-4"
      >
        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">
            {activeRole === 'aluno' ? 'Meus Protocolos Totais' : 'Total de Protocolos na Fila'}
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-slate-900">
            {metrics.total}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {metrics.openCount} aguardando triagem inicial
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">
            Em Análise ou Pendência
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-amber-700">
            {metrics.inAnalysisCount + metrics.waitingStudentCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {metrics.waitingStudentCount > 0
              ? `${metrics.waitingStudentCount} aguardando documento do aluno`
              : 'Sem pendências documentais'}
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium text-slate-500">
            Requerimentos Concluídos
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-emerald-700">
            {metrics.completedCount}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {metrics.overdueCount > 0
              ? `${metrics.overdueCount} protocolo fora do prazo SLA`
              : '100% dentro do prazo regimental'}
          </p>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-500">
              Chamada Presencial Agora
            </p>
            <button
              type="button"
              onClick={() => onNavigate('presencial')}
              className="text-xs font-semibold text-[#B20000] hover:underline whitespace-nowrap"
            >
              Abrir painel
            </button>
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[#B20000] whitespace-nowrap">
            {activeCounterTicket ? activeCounterTicket.code : 'Livre'}
          </p>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            {activeCounterTicket
              ? `Guichê 0${activeCounterTicket.counterNumber ?? 1} · ${waitingQueueCount} aguardando`
              : `${waitingQueueCount} estudantes aguardando`}
          </p>
        </div>
      </section>

      {/* Main 2-Column Workspace Split */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
        {/* Recent Protocols Table (7 cols) */}
        <section className="xl:col-span-7 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900">
                {activeRole === 'aluno'
                  ? 'Meus Requerimentos Recentes'
                  : 'Últimos Protocolos Acadêmicos'}
              </h2>
              <p className="text-xs text-slate-500">
                Selecione um protocolo para visualizar histórico, documentos e parecer.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('tickets')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B20000] hover:text-[#8F0000] whitespace-nowrap shrink-0"
            >
              <span>Ver todos</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {recentTickets.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-800">
                Nenhum requerimento registrado até o momento.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Inicie uma solicitação digital para declarações, estágio ou passe escolar.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('new-ticket')}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#B20000] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F0000]"
              >
                <span>Nova Solicitação</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                    <th scope="col" className="py-3 pl-6 pr-3">
                      Protocolo
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Serviço / Solicitante
                    </th>
                    <th scope="col" className="px-3 py-3 text-right">
                      Prazo SLA
                    </th>
                    <th scope="col" className="py-3 pl-3 pr-6 text-right">
                      Situação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {recentTickets.map((ticket) => {
                    const statusInfo = getStatusPresentation(ticket.status);
                    const overdue = isTicketOverdue(ticket, nowIso);
                    return (
                      <tr
                        key={ticket.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3.5 pl-6 pr-3 align-middle whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onSelectTicket(ticket)}
                            className="font-mono text-xs font-semibold tabular-nums text-[#3E4E56] hover:text-[#B20000] hover:underline focus-visible:outline-2 focus-visible:outline-[#B20000] rounded"
                          >
                            {ticket.protocol}
                          </button>
                        </td>
                        <td className="px-3 py-3.5 align-middle">
                          <button
                            type="button"
                            onClick={() => onSelectTicket(ticket)}
                            className="text-left group block w-full"
                          >
                            <p className="font-medium text-slate-900 group-hover:text-[#B20000] transition-colors line-clamp-1">
                              {ticket.serviceTitle}
                            </p>
                            <p className="text-xs text-slate-500 tabular-nums">
                              {ticket.studentName} · RM {ticket.studentRm} · {ticket.sector}
                            </p>
                          </button>
                        </td>
                        <td className="px-3 py-3.5 text-right align-middle whitespace-nowrap font-mono text-xs tabular-nums">
                          <span
                            className={
                              overdue ? 'font-semibold text-[#B20000]' : 'text-slate-600'
                            }
                          >
                            {formatShortDatePtBr(ticket.dueDate)}
                          </span>
                        </td>
                        <td className="py-3.5 pl-3 pr-6 text-right align-middle whitespace-nowrap">
                          <span
                            className={`text-xs font-semibold ${statusInfo.textColor}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Quick Service Catalog (5 cols) */}
        <section className="xl:col-span-5 rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Catálogo Rápido de Serviços
            </h2>
            <p className="text-xs text-slate-500">
              Prazos em dias úteis conforme diretrizes da Secretaria Acadêmica CPS.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {service.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 tabular-nums">
                    {service.sector} · Prazo regimental: {service.slaBusinessDays}{' '}
                    {service.slaBusinessDays === 1 ? 'dia útil' : 'dias úteis'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onStartServiceRequest(service.id)}
                  aria-label={`Solicitar ${service.title}`}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-[#B20000] hover:text-[#B20000] transition-colors whitespace-nowrap shrink-0"
                >
                  Solicitar
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-slate-50/60 px-6 py-3 text-xs text-slate-600">
            <span>Horário presencial: </span>
            <span className="font-medium text-slate-800">{ETEC_UNIT_INFO.hours}</span>
          </div>
        </section>
      </div>
    </div>
  );
}
