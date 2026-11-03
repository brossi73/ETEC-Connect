import {
  ActiveRole,
  QueueCategory,
  QueueState,
  QueueTicket,
  ScheduledAppointment,
  ServiceCatalogItem,
  ServiceSector,
  StudyShift,
  SupportTicket,
  TicketStatus,
} from '../types/atendimento';

export interface NewTicketInput {
  serviceId: string;
  studentName: string;
  studentRm: string;
  studentEmail: string;
  course: string;
  shift: StudyShift;
  moduleOrSeries: string;
  disciplineName?: string;
  description: string;
  checkedDocuments: string[];
}

export interface ValidationResult<T> {
  valid: boolean;
  errors: Partial<Record<keyof T, string>>;
}

export interface TicketFilterOptions {
  role: ActiveRole;
  currentStudentRm: string;
  searchQuery: string;
  statusFilter: TicketStatus | 'TODOS';
  sectorFilter: ServiceSector | 'TODOS';
}

export interface TicketMetrics {
  total: number;
  openCount: number;
  inAnalysisCount: number;
  waitingStudentCount: number;
  completedCount: number;
  overdueCount: number;
}

export interface AppointmentInput {
  studentName: string;
  studentRm: string;
  course: string;
  reason: string;
  date: string;
  timeSlot: string;
  counterLabel: string;
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function generateProtocolCode(
  existingTickets: Pick<SupportTicket, 'protocol'>[],
  year = 2026
): string {
  const prefix = `ETEC-${year}-`;
  let maxSeq = 100;

  for (const ticket of existingTickets) {
    if (ticket.protocol.startsWith(prefix)) {
      const numericPart = Number.parseInt(ticket.protocol.slice(prefix.length), 10);
      if (!Number.isNaN(numericPart) && numericPart > maxSeq) {
        maxSeq = numericPart;
      }
    }
  }

  return `${prefix}${String(maxSeq + 1).padStart(4, '0')}`;
}

export function calculateDueDateBusinessDays(
  createdAtIso: string,
  slaBusinessDays: number
): string {
  const baseDate = new Date(createdAtIso);
  const utcCursor = new Date(
    Date.UTC(
      baseDate.getUTCFullYear(),
      baseDate.getUTCMonth(),
      baseDate.getUTCDate(),
      21,
      0,
      0
    )
  );

  let remaining = Math.max(1, slaBusinessDays);
  while (remaining > 0) {
    utcCursor.setUTCDate(utcCursor.getUTCDate() + 1);
    const dayOfWeek = utcCursor.getUTCDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      remaining -= 1;
    }
  }

  const yyyy = utcCursor.getUTCFullYear();
  const mm = String(utcCursor.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utcCursor.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T18:00:00-03:00`;
}

export function validateNewTicketForm(
  input: NewTicketInput,
  selectedService?: ServiceCatalogItem
): ValidationResult<NewTicketInput> {
  const errors: Partial<Record<keyof NewTicketInput, string>> = {};

  if (!input.serviceId || !selectedService) {
    errors.serviceId = 'Selecione o tipo de requerimento acadêmico.';
  }

  const trimmedName = input.studentName.trim();
  if (trimmedName.length < 5 || !trimmedName.includes(' ')) {
    errors.studentName = 'Informe o nome completo do estudante.';
  }

  const trimmedRm = input.studentRm.trim();
  if (!/^\d{5,6}$/.test(trimmedRm)) {
    errors.studentRm = 'O RM deve conter 5 ou 6 dígitos numéricos (ex.: 241089).';
  }

  const trimmedEmail = input.studentEmail.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.studentEmail = 'Informe um endereço de e-mail válido.';
  }

  if (!input.course.trim()) {
    errors.course = 'Selecione o curso de matrícula.';
  }

  if (!input.moduleOrSeries.trim()) {
    errors.moduleOrSeries = 'Selecione o módulo ou série atual.';
  }

  if (selectedService?.requiresDiscipline && !input.disciplineName?.trim()) {
    errors.disciplineName = 'Informe o componente curricular (disciplina) referente ao pedido.';
  }

  if (input.description.trim().length < 15) {
    errors.description =
      'Descreva a finalidade ou justificativa com pelo menos 15 caracteres.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function filterTickets(
  tickets: SupportTicket[],
  options: TicketFilterOptions
): SupportTicket[] {
  const normalizedQuery = normalizeSearchText(options.searchQuery);

  return tickets
    .filter((ticket) => {
      if (options.role === 'aluno' && ticket.studentRm !== options.currentStudentRm) {
        return false;
      }
      if (options.statusFilter !== 'TODOS' && ticket.status !== options.statusFilter) {
        return false;
      }
      if (options.sectorFilter !== 'TODOS' && ticket.sector !== options.sectorFilter) {
        return false;
      }
      if (normalizedQuery.length > 0) {
        const searchable = normalizeSearchText(
          [
            ticket.protocol,
            ticket.studentName,
            ticket.studentRm,
            ticket.serviceTitle,
            ticket.course,
            ticket.sector,
            ticket.description,
          ].join(' ')
        );
        if (!searchable.includes(normalizedQuery)) {
          return false;
        }
      }
      return true;
    })
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function isTicketOverdue(ticket: SupportTicket, nowIso: string): boolean {
  if (
    ticket.status === TicketStatus.CONCLUIDO ||
    ticket.status === TicketStatus.INDEFERIDO
  ) {
    return false;
  }
  return new Date(ticket.dueDate).getTime() < new Date(nowIso).getTime();
}

export function computeTicketMetrics(
  tickets: SupportTicket[],
  nowIso: string
): TicketMetrics {
  let openCount = 0;
  let inAnalysisCount = 0;
  let waitingStudentCount = 0;
  let completedCount = 0;
  let overdueCount = 0;

  for (const ticket of tickets) {
    if (ticket.status === TicketStatus.ABERTO) openCount += 1;
    if (ticket.status === TicketStatus.EM_ANALISE) inAnalysisCount += 1;
    if (ticket.status === TicketStatus.AGUARDANDO_ALUNO) waitingStudentCount += 1;
    if (ticket.status === TicketStatus.CONCLUIDO) completedCount += 1;
    if (isTicketOverdue(ticket, nowIso)) overdueCount += 1;
  }

  return {
    total: tickets.length,
    openCount,
    inAnalysisCount,
    waitingStudentCount,
    completedCount,
    overdueCount,
  };
}

export function generateQueueCode(
  existingQueue: Pick<QueueTicket, 'code'>[],
  category: QueueCategory
): string {
  const prefix =
    category === QueueCategory.PRIORITARIO
      ? 'P'
      : category === QueueCategory.ESTAGIO
        ? 'E'
        : 'A';

  let maxNum = 0;
  for (const item of existingQueue) {
    if (item.code.startsWith(`${prefix}-`)) {
      const parsed = Number.parseInt(item.code.slice(2), 10);
      if (!Number.isNaN(parsed) && parsed > maxNum) {
        maxNum = parsed;
      }
    }
  }

  return `${prefix}-${String(maxNum + 1).padStart(3, '0')}`;
}

export function selectNextQueueTicket(queue: QueueTicket[]): QueueTicket | undefined {
  const waiting = queue.filter((item) => item.state === QueueState.AGUARDANDO);
  if (waiting.length === 0) return undefined;

  const priorityItem = waiting.find(
    (item) => item.category === QueueCategory.PRIORITARIO
  );
  return priorityItem ?? waiting[0];
}

export function validateAppointmentForm(
  input: AppointmentInput,
  existingAppointments: ScheduledAppointment[]
): ValidationResult<AppointmentInput> {
  const errors: Partial<Record<keyof AppointmentInput, string>> = {};

  const trimmedName = input.studentName.trim();
  if (trimmedName.length < 5 || !trimmedName.includes(' ')) {
    errors.studentName = 'Informe o nome completo do estudante.';
  }

  if (!/^\d{5,6}$/.test(input.studentRm.trim())) {
    errors.studentRm = 'Informe um RM válido com 5 ou 6 dígitos.';
  }

  if (!input.course.trim()) {
    errors.course = 'Selecione o curso.';
  }

  if (input.reason.trim().length < 8) {
    errors.reason = 'Descreva o motivo do atendimento presencial (mín. 8 caracteres).';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    errors.date = 'Selecione uma data válida para comparecimento.';
  }

  if (!input.timeSlot) {
    errors.timeSlot = 'Selecione um horário disponível.';
  }

  if (input.date && input.timeSlot) {
    const hasConflict = existingAppointments.some(
      (apt) =>
        apt.status === 'Confirmado' &&
        apt.date === input.date &&
        apt.timeSlot === input.timeSlot &&
        apt.counterLabel === input.counterLabel
    );
    if (hasConflict) {
      errors.timeSlot =
        'Este horário já possui agendamento confirmado para o guichê selecionado.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatShortDatePtBr(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateTimePtBr(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
