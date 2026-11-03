import { FormEvent, useEffect, useState } from 'react';
import {
  CheckSquare,
  Printer,
  Send,
  X,
} from 'lucide-react';
import {
  ActiveRole,
  SupportTicket,
  TicketStatus,
} from '../types/atendimento';
import { CURRENT_STUDENT, ETEC_UNIT_INFO } from '../data/etecCatalog';
import {
  formatDateTimePtBr,
  formatShortDatePtBr,
  isTicketOverdue,
} from '../utils/atendimentoRules';
import { getStatusPresentation } from './OverviewView';

interface TicketDetailModalProps {
  ticket: SupportTicket | null;
  activeRole: ActiveRole;
  nowIso: string;
  onClose: () => void;
  onAddMessage: (ticketId: string, content: string, authorRole: ActiveRole) => void;
  onUpdateSecretariaDispatch: (
    ticketId: string,
    updates: {
      status: TicketStatus;
      assignedTo: string;
      resolutionNote: string;
    }
  ) => void;
}

export function TicketDetailModal({
  ticket,
  activeRole,
  nowIso,
  onClose,
  onAddMessage,
  onUpdateSecretariaDispatch,
}: TicketDetailModalProps) {
  const [messageText, setMessageText] = useState('');
  const [messageError, setMessageError] = useState('');

  const [statusDraft, setStatusDraft] = useState<TicketStatus>(TicketStatus.ABERTO);
  const [assignedDraft, setAssignedDraft] = useState('');
  const [resolutionDraft, setResolutionDraft] = useState('');
  const [dispatchSavedBanner, setDispatchSavedBanner] = useState(false);

  useEffect(() => {
    if (ticket) {
      setStatusDraft(ticket.status);
      setAssignedDraft(
        ticket.assignedTo ?? 'Cláudia Helena Ribeiro (Secretaria Acadêmica)'
      );
      setResolutionDraft(ticket.resolutionNote ?? '');
      setMessageText('');
      setMessageError('');
      setDispatchSavedBanner(false);
    }
  }, [ticket]);

  if (!ticket) return null;

  const statusInfo = getStatusPresentation(ticket.status);
  const StatusIcon = statusInfo.Icon;
  const overdue = isTicketOverdue(ticket, nowIso);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = messageText.trim();
    if (trimmed.length < 3) {
      setMessageError('Digite uma mensagem com pelo menos 3 caracteres.');
      return;
    }
    setMessageError('');
    onAddMessage(ticket.id, trimmed, activeRole);
    setMessageText('');
  };

  const handleSaveDispatch = (e: FormEvent) => {
    e.preventDefault();
    onUpdateSecretariaDispatch(ticket.id, {
      status: statusDraft,
      assignedTo: assignedDraft.trim() || 'Secretaria Acadêmica',
      resolutionNote: resolutionDraft.trim(),
    });
    setDispatchSavedBanner(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="protocol-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/50 transition-opacity no-print"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl overflow-y-auto">
        {/* Top Modal Header */}
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-semibold tabular-nums text-[#B20000]">
                {ticket.protocol}
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span
                className={`inline-flex items-center gap-1.5 font-semibold ${statusInfo.textColor}`}
              >
                <StatusIcon className="h-3.5 w-3.5 shrink-0" />
                <span>{statusInfo.label}</span>
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-500">{ticket.sector}</span>
            </div>
            <h2
              id="protocol-modal-title"
              className="mt-1 font-display text-lg font-bold text-slate-900"
            >
              {ticket.serviceTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 no-print shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              aria-label="Imprimir comprovante do protocolo"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Comprovante</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar detalhes do protocolo"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 divide-y divide-slate-200 px-6">
          {/* Student & Timeline Metadata */}
          <div className="py-5 grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-xs font-medium text-slate-500">Estudante Solicitante</p>
              <p className="mt-0.5 font-semibold text-slate-900">{ticket.studentName}</p>
              <p className="text-xs text-slate-600 tabular-nums">
                RM {ticket.studentRm} · {ticket.studentEmail}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Vínculo Acadêmico</p>
              <p className="mt-0.5 font-medium text-slate-900">{ticket.course}</p>
              <p className="text-xs text-slate-600">
                {ticket.moduleOrSeries} · {ticket.shift}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Data de Abertura</p>
              <p className="mt-0.5 font-mono text-xs tabular-nums text-slate-800">
                {formatDateTimePtBr(ticket.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Prazo Regimental (SLA)</p>
              <p
                className={`mt-0.5 font-mono text-xs tabular-nums ${
                  overdue ? 'font-semibold text-[#B20000]' : 'text-slate-800'
                }`}
              >
                Até {formatShortDatePtBr(ticket.dueDate)}
                {overdue ? ' · Prazo excedido' : ''}
              </p>
            </div>
            {ticket.disciplineName && (
              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-slate-500">
                  Componente Curricular Referenciado
                </p>
                <p className="mt-0.5 font-medium text-slate-900">
                  {ticket.disciplineName}
                </p>
              </div>
            )}
          </div>

          {/* Request Justification */}
          <div className="py-5 space-y-3">
            <h3 className="font-display text-sm font-semibold text-slate-900">
              Justificativa e Detalhamento do Pedido
            </h3>
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
              {ticket.description}
            </p>

            {ticket.checkedDocuments.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Documentação Declarada / Conferida:
                </p>
                <ul className="space-y-1.5">
                  {ticket.checkedDocuments.map((doc) => (
                    <li
                      key={doc}
                      className="flex items-start gap-2 text-xs text-slate-700"
                    >
                      <CheckSquare className="h-3.5 w-3.5 shrink-0 text-emerald-700 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Official Resolution Note (Visible to Student when filled) */}
          {ticket.resolutionNote && activeRole === 'aluno' && (
            <div className="py-5 space-y-1.5">
              <p className="text-xs font-semibold text-[#3E4E56]">
                Parecer Oficial da Secretaria Acadêmica
              </p>
              <p className="text-sm leading-relaxed text-slate-800">
                {ticket.resolutionNote}
              </p>
              {ticket.assignedTo && (
                <p className="text-xs text-slate-500">
                  Responsável: {ticket.assignedTo}
                </p>
              )}
            </div>
          )}

          {/* Secretariat Triage & Official Dispatch Form */}
          {activeRole === 'secretaria' && (
            <form onSubmit={handleSaveDispatch} className="py-5 space-y-4 no-print">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-slate-900">
                  Triagem e Despacho da Secretaria
                </h3>
                {dispatchSavedBanner && (
                  <span
                    role="status"
                    className="text-xs font-semibold text-emerald-700"
                  >
                    Parecer atualizado com sucesso
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="dispatch-status"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Alterar Situação do Protocolo
                  </label>
                  <select
                    id="dispatch-status"
                    value={statusDraft}
                    onChange={(e) => {
                      setStatusDraft(e.target.value as TicketStatus);
                      setDispatchSavedBanner(false);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                  >
                    {Object.values(TicketStatus).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dispatch-assigned"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Servidor / Coordenação Responsável
                  </label>
                  <input
                    id="dispatch-assigned"
                    type="text"
                    value={assignedDraft}
                    onChange={(e) => {
                      setAssignedDraft(e.target.value);
                      setDispatchSavedBanner(false);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="dispatch-note"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Parecer Oficial / Instruções de Retirada
                </label>
                <textarea
                  id="dispatch-note"
                  rows={3}
                  value={resolutionDraft}
                  onChange={(e) => {
                    setResolutionDraft(e.target.value);
                    setDispatchSavedBanner(false);
                  }}
                  placeholder="Informe código validador NSA, deferimento ou pendência documental..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-[#3E4E56] px-4 py-2 text-xs font-semibold text-white hover:bg-[#253137] transition-colors whitespace-nowrap"
                >
                  Salvar Parecer e Situação
                </button>
              </div>
            </form>
          )}

          {/* Conversation History */}
          <div className="py-5 space-y-4">
            <h3 className="font-display text-sm font-semibold text-slate-900">
              Histórico de Mensagens ({ticket.messages.length})
            </h3>

            {ticket.messages.length === 0 ? (
              <p className="text-xs text-slate-500">
                Nenhuma interação complementar registrada neste protocolo.
              </p>
            ) : (
              <div className="space-y-3">
                {ticket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-lg border p-3.5 text-sm ${
                      msg.authorRole === 'secretaria'
                        ? 'border-slate-200 bg-slate-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-800">
                        {msg.authorName}{' '}
                        <span className="font-normal text-slate-500">
                          · {msg.authorRole === 'secretaria' ? 'Secretaria Etec' : 'Estudante'}
                        </span>
                      </span>
                      <span className="font-mono tabular-nums">
                        {formatDateTimePtBr(msg.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Message Composer */}
            <form onSubmit={handleSendMessage} className="pt-2 space-y-2 no-print">
              <label
                htmlFor="protocol-message-input"
                className="block text-xs font-medium text-slate-700"
              >
                {activeRole === 'aluno'
                  ? `Enviar complemento como ${CURRENT_STUDENT.name}`
                  : 'Enviar orientação ao estudante'}
              </label>
              <textarea
                id="protocol-message-input"
                rows={2}
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  if (messageError) setMessageError('');
                }}
                placeholder="Escreva uma atualização ou resposta sobre este requerimento..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
              />
              {messageError && (
                <p role="alert" className="text-xs font-medium text-[#B20000]">
                  {messageError}
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#B20000] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F0000] transition-colors whitespace-nowrap"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Enviar Mensagem</span>
                </button>
              </div>
            </form>
          </div>

          {/* Printable Institutional Footer */}
          <div className="py-4 text-xs text-slate-500">
            <p className="font-medium text-slate-700">
              {ETEC_UNIT_INFO.name} · {ETEC_UNIT_INFO.unitCode} ({ETEC_UNIT_INFO.city})
            </p>
            <p>
              {ETEC_UNIT_INFO.address} · Tel. {ETEC_UNIT_INFO.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
