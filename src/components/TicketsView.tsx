import { useState } from 'react';
import { FilePlus2, Search, X } from 'lucide-react';
import {
  ActiveRole,
  AppView,
  ServiceSector,
  SupportTicket,
  TicketStatus,
} from '../types/atendimento';
import { CURRENT_STUDENT } from '../data/etecCatalog';
import {
  filterTickets,
  formatShortDatePtBr,
  isTicketOverdue,
} from '../utils/atendimentoRules';
import { getStatusPresentation } from './OverviewView';

interface TicketsViewProps {
  activeRole: ActiveRole;
  tickets: SupportTicket[];
  nowIso: string;
  onSelectTicket: (ticket: SupportTicket) => void;
  onNavigate: (view: AppView) => void;
}

const STATUS_TABS: Array<{ value: TicketStatus | 'TODOS'; label: string }> = [
  { value: 'TODOS', label: 'Todos' },
  { value: TicketStatus.ABERTO, label: 'Abertos' },
  { value: TicketStatus.EM_ANALISE, label: 'Em Análise' },
  { value: TicketStatus.AGUARDANDO_ALUNO, label: 'Pendência' },
  { value: TicketStatus.CONCLUIDO, label: 'Concluídos' },
];

export function TicketsView({
  activeRole,
  tickets,
  nowIso,
  onSelectTicket,
  onNavigate,
}: TicketsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'TODOS'>('TODOS');
  const [sectorFilter, setSectorFilter] = useState<ServiceSector | 'TODOS'>('TODOS');

  const filteredTickets = filterTickets(tickets, {
    role: activeRole,
    currentStudentRm: CURRENT_STUDENT.rm,
    searchQuery,
    statusFilter,
    sectorFilter,
  });

  const hasActiveFilters =
    searchQuery.trim() !== '' || statusFilter !== 'TODOS' || sectorFilter !== 'TODOS';

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('TODOS');
    setSectorFilter('TODOS');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            {activeRole === 'aluno'
              ? 'Meus Protocolos Acadêmicos'
              : 'Fila Geral de Protocolos — Secretaria'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {activeRole === 'aluno'
              ? `Exibindo requerimentos vinculados ao RM ${CURRENT_STUDENT.rm} (${CURRENT_STUDENT.name}).`
              : 'Consulte, filtre por setor e realize o despacho regimental das solicitações estudantis.'}
          </p>
        </div>

        <p className="font-mono text-xs font-medium tabular-nums text-slate-500">
          {filteredTickets.length}{' '}
          {filteredTickets.length === 1 ? 'protocolo listado' : 'protocolos listados'}
        </p>
      </div>

      {/* Filter Bar & Table Container (Single-Elevation) */}
      <section className="rounded-xl border border-slate-200 bg-white">
        {/* Controls Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          {/* Status Segmented Controls */}
          <div
            role="group"
            aria-label="Filtrar por situação"
            className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
          >
            {STATUS_TABS.map((tab) => {
              const active = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  aria-pressed={active}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sector Select */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-[240px] sm:w-72">
              <label htmlFor="protocol-search" className="sr-only">
                Buscar protocolo, RM, aluno ou serviço
              </label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="protocol-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Protocolo, RM, nome ou serviço..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-8 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#B20000] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpar busca"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div>
              <label htmlFor="sector-filter" className="sr-only">
                Filtrar por setor responsável
              </label>
              <select
                id="sector-filter"
                value={sectorFilter}
                onChange={(e) =>
                  setSectorFilter(e.target.value as ServiceSector | 'TODOS')
                }
                className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-[#B20000] focus:outline-none"
              >
                <option value="TODOS">Todos os Setores</option>
                {Object.values(ServiceSector).map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* High-Density Data Grid */}
        {filteredTickets.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-display text-base font-semibold text-slate-900">
              Nenhum protocolo encontrado para os filtros aplicados
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Ajuste os termos de pesquisa ou inicie um novo requerimento digital junto à Secretaria Acadêmica.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                >
                  Limpar Filtros
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate('new-ticket')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#B20000] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F0000] whitespace-nowrap"
              >
                <FilePlus2 className="h-4 w-4" />
                <span>Nova Solicitação</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                  <th scope="col" className="py-3 pl-6 pr-3 whitespace-nowrap">
                    Protocolo
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Tipo de Solicitação
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Estudante / Curso
                  </th>
                  <th scope="col" className="px-3 py-3 text-right whitespace-nowrap">
                    Abertura
                  </th>
                  <th scope="col" className="px-3 py-3 text-right whitespace-nowrap">
                    Prazo SLA
                  </th>
                  <th scope="col" className="px-3 py-3 text-right whitespace-nowrap">
                    Situação
                  </th>
                  <th scope="col" className="py-3 pl-3 pr-6 text-right whitespace-nowrap">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredTickets.map((ticket) => {
                  const statusInfo = getStatusPresentation(ticket.status);
                  const overdue = isTicketOverdue(ticket, nowIso);
                  return (
                    <tr
                      key={ticket.id}
                      className="hover:bg-slate-50/90 transition-colors"
                    >
                      <td className="py-3.5 pl-6 pr-3 align-middle whitespace-nowrap font-mono text-xs font-semibold tabular-nums text-[#3E4E56]">
                        {ticket.protocol}
                      </td>
                      <td className="px-3 py-3.5 align-middle max-w-xs">
                        <p className="font-medium text-slate-900 line-clamp-1">
                          {ticket.serviceTitle}
                        </p>
                        <p className="text-xs text-slate-500">
                          {ticket.sector}
                          {ticket.messages.length > 0
                            ? ` · ${ticket.messages.length} msg`
                            : ''}
                        </p>
                      </td>
                      <td className="px-3 py-3.5 align-middle">
                        <p className="font-medium text-slate-800 whitespace-nowrap">
                          {ticket.studentName}
                        </p>
                        <p className="text-xs text-slate-500 tabular-nums line-clamp-1">
                          RM {ticket.studentRm} · {ticket.course}
                        </p>
                      </td>
                      <td className="px-3 py-3.5 text-right align-middle whitespace-nowrap font-mono text-xs tabular-nums text-slate-600">
                        {formatShortDatePtBr(ticket.createdAt)}
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
                      <td className="px-3 py-3.5 text-right align-middle whitespace-nowrap">
                        <span
                          className={`text-xs font-semibold ${statusInfo.textColor}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 pl-3 pr-6 text-right align-middle whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onSelectTicket(ticket)}
                          aria-label={`Abrir protocolo ${ticket.protocol}`}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-[#B20000] hover:text-[#B20000] transition-colors whitespace-nowrap"
                        >
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
