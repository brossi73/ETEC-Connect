import { FormEvent, useState } from 'react';
import { CalendarPlus, Megaphone, Ticket, UserCheck } from 'lucide-react';
import {
  ActiveRole,
  QueueCategory,
  QueueState,
  QueueTicket,
  ScheduledAppointment,
} from '../types/atendimento';
import {
  AVAILABLE_TIME_SLOTS,
  CURRENT_STUDENT,
  ETEC_COURSES,
} from '../data/etecCatalog';
import {
  AppointmentInput,
  selectNextQueueTicket,
  validateAppointmentForm,
} from '../utils/atendimentoRules';

interface PresencialQueueViewProps {
  activeRole: ActiveRole;
  queue: QueueTicket[];
  appointments: ScheduledAppointment[];
  onIssueQueueTicket: (input: {
    category: QueueCategory;
    studentName: string;
    studentRm: string;
    serviceHint: string;
  }) => QueueTicket;
  onCallNextTicket: (counterNumber: number) => QueueTicket | undefined;
  onCompleteCurrentTicket: (ticketId: string) => void;
  onCreateAppointment: (input: AppointmentInput) => ScheduledAppointment;
  onCancelAppointment: (appointmentId: string) => void;
}

const COUNTER_LABELS = [
  'Guichê 01 · Secretaria Geral',
  'Guichê 02 · Estágio',
  'Guichê 03 · Passe Escolar',
  'Guichê 04 · Atendimento Prioritário',
];

export function PresencialQueueView({
  activeRole,
  queue,
  appointments,
  onIssueQueueTicket,
  onCallNextTicket,
  onCompleteCurrentTicket,
  onCreateAppointment,
  onCancelAppointment,
}: PresencialQueueViewProps) {
  // Senha form state
  const [queueCategory, setQueueCategory] = useState<QueueCategory>(
    QueueCategory.GERAL
  );
  const [queueName, setQueueName] = useState(
    activeRole === 'aluno' ? CURRENT_STUDENT.name : ''
  );
  const [queueRm, setQueueRm] = useState(
    activeRole === 'aluno' ? CURRENT_STUDENT.rm : ''
  );
  const [queueHint, setQueueHint] = useState('');
  const [queueError, setQueueError] = useState('');
  const [lastIssuedCode, setLastIssuedCode] = useState<string | null>(null);

  // Secretariat counter selection
  const [selectedCounter, setSelectedCounter] = useState<number>(1);
  const [callFeedback, setCallFeedback] = useState<string | null>(null);

  // Appointment form state
  const [aptName, setAptName] = useState(CURRENT_STUDENT.name);
  const [aptRm, setAptRm] = useState(CURRENT_STUDENT.rm);
  const [aptCourse, setAptCourse] = useState(CURRENT_STUDENT.course);
  const [aptDate, setAptDate] = useState('2026-11-06');
  const [aptSlot, setAptSlot] = useState('19:30');
  const [aptCounter, setAptCounter] = useState(COUNTER_LABELS[0]);
  const [aptReason, setAptReason] = useState('');
  const [aptErrors, setAptErrors] = useState<
    Partial<Record<keyof AppointmentInput, string>>
  >({});
  const [aptSuccessMessage, setAptSuccessMessage] = useState<string | null>(null);

  const activeCalled = queue.filter((q) => q.state === QueueState.CHAMADO);
  const waitingList = queue.filter((q) => q.state === QueueState.AGUARDANDO);
  const nextUp = selectNextQueueTicket(queue);

  const handleIssueQueue = (e: FormEvent) => {
    e.preventDefault();
    const nameTrim = queueName.trim();
    const rmTrim = queueRm.trim();
    const hintTrim = queueHint.trim();

    if (nameTrim.length < 5 || !/^\d{5,6}$/.test(rmTrim) || hintTrim.length < 4) {
      setQueueError(
        'Informe nome completo, RM válido (5 ou 6 dígitos) e o assunto resumido.'
      );
      return;
    }

    setQueueError('');
    const issued = onIssueQueueTicket({
      category: queueCategory,
      studentName: nameTrim,
      studentRm: rmTrim,
      serviceHint: hintTrim,
    });
    setLastIssuedCode(issued.code);
    setQueueHint('');
  };

  const handleCallNext = () => {
    const called = onCallNextTicket(selectedCounter);
    if (!called) {
      setCallFeedback('Não há senhas aguardando na fila no momento.');
    } else {
      setCallFeedback(
        `Senha ${called.code} (${called.studentName}) chamada para o Guichê 0${selectedCounter}.`
      );
    }
  };

  const handleBookAppointment = (e: FormEvent) => {
    e.preventDefault();
    const input: AppointmentInput = {
      studentName: aptName,
      studentRm: aptRm,
      course: aptCourse,
      reason: aptReason,
      date: aptDate,
      timeSlot: aptSlot,
      counterLabel: aptCounter,
    };

    const validation = validateAppointmentForm(input, appointments);
    if (!validation.valid) {
      setAptErrors(validation.errors);
      setAptSuccessMessage(null);
      return;
    }

    setAptErrors({});
    const created = onCreateAppointment(input);
    setAptReason('');
    setAptSuccessMessage(
      `Horário confirmado para ${created.date.split('-').reverse().join('/')} às ${created.timeSlot} (${created.counterLabel}).`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Atendimento Presencial & Agendamento de Balcão
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Acompanhe o painel de chamadas dos Guichês 01 a 04 em tempo real, retire sua senha digital ou agende horário na Secretaria Acadêmica.
        </p>
      </div>

      {/* Live Counter Display Banner (Hardware-Inspired Dark Slate Institutional Panel) */}
      <section
        aria-label="Painel eletrônico de senhas"
        className="rounded-xl bg-[#253137] text-white p-6 sm:p-7"
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-300">
              Painel Eletrônico da Secretaria · Etec Prof. Dr. José Dagnoni
            </p>
            {activeCalled.length > 0 ? (
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <span className="font-mono text-4xl sm:text-5xl font-semibold tabular-nums tracking-tight text-white">
                  {activeCalled[0].code}
                </span>
                <span className="font-display text-xl sm:text-2xl font-semibold text-red-300 tabular-nums">
                  Guichê 0{activeCalled[0].counterNumber ?? 1}
                </span>
                <span className="text-sm text-slate-200">
                  {activeCalled[0].studentName} · RM {activeCalled[0].studentRm} (
                  {activeCalled[0].serviceHint})
                </span>
              </div>
            ) : (
              <p className="font-display text-2xl font-semibold text-slate-200">
                Guichês disponíveis — aguardando próxima chamada
              </p>
            )}
            <p className="text-xs text-slate-300 tabular-nums">
              {waitingList.length} na fila de espera
              {nextUp ? ` · Próxima previsão de chamada: ${nextUp.code} (${nextUp.category})` : ''}
            </p>
          </div>

          {/* Secretariat Counter Operator Controls */}
          {activeRole === 'secretaria' ? (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div>
                <label htmlFor="counter-number-select" className="sr-only">
                  Selecionar guichê de chamada
                </label>
                <select
                  id="counter-number-select"
                  value={selectedCounter}
                  onChange={(e) => setSelectedCounter(Number(e.target.value))}
                  className="rounded-lg border border-slate-600 bg-[#3E4E56] px-3 py-2.5 text-xs sm:text-sm font-medium text-white focus:border-white focus:outline-none"
                >
                  <option value={1}>Guichê 01</option>
                  <option value={2}>Guichê 02</option>
                  <option value={3}>Guichê 03</option>
                  <option value={4}>Guichê 04</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleCallNext}
                className="inline-flex items-center gap-2 rounded-lg bg-[#B20000] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#8F0000] transition-colors whitespace-nowrap shrink-0"
              >
                <Megaphone className="h-4 w-4 shrink-0" />
                <span>Chamar Próxima Senha</span>
              </button>
              {activeCalled[0] && (
                <button
                  type="button"
                  onClick={() => onCompleteCurrentTicket(activeCalled[0].id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-500 bg-transparent px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-100 hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
                >
                  <UserCheck className="h-4 w-4 shrink-0" />
                  <span>Concluir {activeCalled[0].code}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-300 lg:text-right">
              <p className="font-semibold text-white">Prioridade Legal Garantida</p>
              <p>Atendimento prioritário conforme Lei Federal nº 10.048/2000</p>
            </div>
          )}
        </div>

        {callFeedback && (
          <p
            role="status"
            className="mt-4 border-t border-slate-600/80 pt-3 text-xs font-medium text-emerald-300"
          >
            {callFeedback}
          </p>
        )}
      </section>

      {/* Two-Column Split: Queue Issuance + Waiting List (Left) & Scheduled Appointments (Right) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
        {/* Left 6 cols: Senha Presencial */}
        <section className="xl:col-span-6 rounded-xl border border-slate-200 bg-white divide-y divide-slate-200">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-base font-semibold text-slate-900">
                  Retirar Senha Presencial
                </h2>
                <p className="text-xs text-slate-500">
                  Emita sua senha para atendimento imediato nos guichês da unidade.
                </p>
              </div>
              {lastIssuedCode && (
                <span
                  role="status"
                  className="font-mono text-xs font-semibold tabular-nums text-emerald-700"
                >
                  Emitida: {lastIssuedCode}
                </span>
              )}
            </div>

            <form onSubmit={handleIssueQueue} noValidate className="space-y-3.5">
              <div>
                <label
                  htmlFor="queue-category"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Modalidade da Fila
                </label>
                <select
                  id="queue-category"
                  value={queueCategory}
                  onChange={(e) => setQueueCategory(e.target.value as QueueCategory)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                >
                  {Object.values(QueueCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="queue-student-name"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Nome do Estudante *
                  </label>
                  <input
                    id="queue-student-name"
                    type="text"
                    value={queueName}
                    onChange={(e) => setQueueName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="queue-student-rm"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    RM *
                  </label>
                  <input
                    id="queue-student-rm"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={queueRm}
                    onChange={(e) => setQueueRm(e.target.value)}
                    placeholder="241089"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm tabular-nums text-slate-900 focus:border-[#B20000] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="queue-hint"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Assunto Resumido *
                </label>
                <input
                  id="queue-hint"
                  type="text"
                  value={queueHint}
                  onChange={(e) => {
                    setQueueHint(e.target.value);
                    if (queueError) setQueueError('');
                  }}
                  placeholder="Ex.: Entrega de vias do TCE, retirada de histórico..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                />
              </div>

              {queueError && (
                <p role="alert" className="text-xs font-medium text-[#B20000]">
                  {queueError}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#B20000] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#8F0000] transition-colors whitespace-nowrap"
                >
                  <Ticket className="h-4 w-4" />
                  <span>Emitir Senha Presencial</span>
                </button>
              </div>
            </form>
          </div>

          {/* Waiting Queue Table */}
          <div>
            <div className="bg-slate-50/70 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-700">
                Ordem da Fila Presencial
              </h3>
              <span className="font-mono text-xs tabular-nums text-slate-500">
                {waitingList.length} aguardando
              </span>
            </div>

            {queue.length === 0 ? (
              <p className="px-6 py-8 text-center text-xs text-slate-500">
                Nenhuma senha emitida no turno atual.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                      <th scope="col" className="py-2.5 pl-6 pr-3">
                        Senha
                      </th>
                      <th scope="col" className="px-3 py-2.5">
                        Estudante / Assunto
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right">
                        Hora
                      </th>
                      <th scope="col" className="py-2.5 pl-3 pr-6 text-right">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                    {queue.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 pl-6 pr-3 font-mono font-semibold tabular-nums text-slate-900 whitespace-nowrap">
                          {item.code}
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-medium text-slate-800">
                            {item.studentName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.category} · {item.serviceHint}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-xs tabular-nums text-slate-500 whitespace-nowrap">
                          {item.issuedAt}
                        </td>
                        <td className="py-3 pl-3 pr-6 text-right whitespace-nowrap text-xs font-semibold">
                          {item.state === QueueState.CHAMADO ? (
                            <span className="text-[#B20000]">
                              Guichê 0{item.counterNumber ?? 1}
                            </span>
                          ) : item.state === QueueState.AGUARDANDO ? (
                            <span className="text-amber-700">Aguardando</span>
                          ) : (
                            <span className="text-emerald-700">Atendido</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Right 6 cols: Agendamento de Horário */}
        <section className="xl:col-span-6 rounded-xl border border-slate-200 bg-white divide-y divide-slate-200">
          <div className="p-6 space-y-4">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900">
                Agendar Atendimento Presencial
              </h2>
              <p className="text-xs text-slate-500">
                Reserve um horário fixo na Secretaria para evitar filas nos intervalos de aula.
              </p>
            </div>

            <form onSubmit={handleBookAppointment} noValidate className="space-y-3.5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="apt-name"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Nome do Estudante *
                  </label>
                  <input
                    id="apt-name"
                    type="text"
                    value={aptName}
                    onChange={(e) => setAptName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                  />
                  {aptErrors.studentName && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#B20000]">
                      {aptErrors.studentName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="apt-rm"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    RM *
                  </label>
                  <input
                    id="apt-rm"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={aptRm}
                    onChange={(e) => setAptRm(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm tabular-nums text-slate-900 focus:border-[#B20000] focus:outline-none"
                  />
                  {aptErrors.studentRm && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#B20000]">
                      {aptErrors.studentRm}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="apt-course"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Curso
                  </label>
                  <select
                    id="apt-course"
                    value={aptCourse}
                    onChange={(e) => setAptCourse(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                  >
                    {ETEC_COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="apt-counter"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Guichê / Setor
                  </label>
                  <select
                    id="apt-counter"
                    value={aptCounter}
                    onChange={(e) => setAptCounter(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                  >
                    {COUNTER_LABELS.map((lbl) => (
                      <option key={lbl} value={lbl}>
                        {lbl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="apt-date"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Data de Comparecimento *
                  </label>
                  <input
                    id="apt-date"
                    type="date"
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm tabular-nums text-slate-900 focus:border-[#B20000] focus:outline-none"
                  />
                  {aptErrors.date && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#B20000]">
                      {aptErrors.date}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="apt-slot"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Horário Disponível *
                  </label>
                  <select
                    id="apt-slot"
                    value={aptSlot}
                    onChange={(e) => setAptSlot(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm tabular-nums text-slate-900 focus:border-[#B20000] focus:outline-none"
                  >
                    {AVAILABLE_TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {aptErrors.timeSlot && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#B20000]">
                      {aptErrors.timeSlot}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="apt-reason"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Motivo do Comparecimento *
                </label>
                <input
                  id="apt-reason"
                  type="text"
                  value={aptReason}
                  onChange={(e) => {
                    setAptReason(e.target.value);
                    if (aptErrors.reason) {
                      setAptErrors((prev) => ({ ...prev, reason: undefined }));
                    }
                  }}
                  placeholder="Ex.: Conferência de documentos originais para diploma..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                />
                {aptErrors.reason && (
                  <p role="alert" className="mt-1 text-xs font-medium text-[#B20000]">
                    {aptErrors.reason}
                  </p>
                )}
              </div>

              {aptSuccessMessage && (
                <p role="status" className="text-xs font-semibold text-emerald-700">
                  {aptSuccessMessage}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#3E4E56] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#253137] transition-colors whitespace-nowrap"
                >
                  <CalendarPlus className="h-4 w-4" />
                  <span>Confirmar Agendamento</span>
                </button>
              </div>
            </form>
          </div>

          {/* Appointments List */}
          <div>
            <div className="bg-slate-50/70 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-700">
                Agendamentos Registrados
              </h3>
              <span className="font-mono text-xs tabular-nums text-slate-500">
                {appointments.filter((a) => a.status === 'Confirmado').length} ativos
              </span>
            </div>

            {appointments.length === 0 ? (
              <p className="px-6 py-8 text-center text-xs text-slate-500">
                Nenhum agendamento registrado.
              </p>
            ) : (
              <div className="divide-y divide-slate-200">
                {appointments
                  .filter(
                    (apt) =>
                      activeRole === 'secretaria' || apt.studentRm === CURRENT_STUDENT.rm
                  )
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between gap-4 px-6 py-3.5 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{apt.reason}</p>
                        <p className="mt-0.5 text-xs text-slate-500 tabular-nums">
                          {apt.date.split('-').reverse().join('/')} às {apt.timeSlot} ·{' '}
                          {apt.counterLabel} · {apt.studentName} (RM {apt.studentRm})
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-xs font-semibold ${
                            apt.status === 'Confirmado'
                              ? 'text-emerald-700'
                              : 'text-slate-400 line-through'
                          }`}
                        >
                          {apt.status}
                        </span>
                        {apt.status === 'Confirmado' && (
                          <button
                            type="button"
                            onClick={() => onCancelAppointment(apt.id)}
                            aria-label={`Cancelar agendamento de ${apt.studentName} às ${apt.timeSlot}`}
                            className="text-xs font-semibold text-[#B20000] hover:underline whitespace-nowrap"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
