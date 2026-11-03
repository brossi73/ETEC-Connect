import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDueDateBusinessDays,
  computeTicketMetrics,
  filterTickets,
  generateProtocolCode,
  generateQueueCode,
  selectNextQueueTicket,
  validateAppointmentForm,
  validateNewTicketForm,
} from './atendimentoRules';
import { INITIAL_QUEUE, INITIAL_TICKETS, SERVICE_CATALOG } from '../data/etecCatalog';
import {
  QueueCategory,
  QueueState,
  ServiceSector,
  StudyShift,
  TicketStatus,
} from '../types/atendimento';

test('generateProtocolCode increments highest existing protocol sequence', () => {
  const code = generateProtocolCode(INITIAL_TICKETS, 2026);
  assert.equal(code, 'ETEC-2026-0107');
});

test('calculateDueDateBusinessDays skips weekends accurately', () => {
  // Friday 2026-11-06 + 2 business days -> Tuesday 2026-11-10
  const due = calculateDueDateBusinessDays('2026-11-06T14:00:00Z', 2);
  assert.equal(due, '2026-11-10T18:00:00-03:00');
});

test('validateNewTicketForm rejects invalid RM, missing discipline, and short description', () => {
  const aproveitamento = SERVICE_CATALOG.find((s) => s.id === 'aproveitamento-estudos');
  const result = validateNewTicketForm(
    {
      serviceId: 'aproveitamento-estudos',
      studentName: 'Ana',
      studentRm: '12AB',
      studentEmail: 'invalido',
      course: '',
      shift: StudyShift.NOITE,
      moduleOrSeries: '1º Módulo',
      disciplineName: '',
      description: 'curto',
      checkedDocuments: [],
    },
    aproveitamento
  );

  assert.equal(result.valid, false);
  assert.ok(result.errors.studentName);
  assert.ok(result.errors.studentRm);
  assert.ok(result.errors.studentEmail);
  assert.ok(result.errors.course);
  assert.ok(result.errors.disciplineName);
  assert.ok(result.errors.description);
});

test('validateNewTicketForm accepts complete valid academic request', () => {
  const declaracao = SERVICE_CATALOG.find((s) => s.id === 'decl-matricula');
  const result = validateNewTicketForm(
    {
      serviceId: 'decl-matricula',
      studentName: 'Beatriz Almeida Santos',
      studentRm: '241089',
      studentEmail: 'beatriz.santos94@etec.sp.gov.br',
      course: 'Técnico em Desenvolvimento de Sistemas',
      shift: StudyShift.NOITE,
      moduleOrSeries: '3º Módulo',
      description: 'Solicito declaração de matrícula para apresentação na empresa de estágio.',
      checkedDocuments: ['Documento oficial com foto (RG ou CIN)'],
    },
    declaracao
  );

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('filterTickets scopes student view by RM and allows accent-insensitive search in secretaria view', () => {
  const studentTickets = filterTickets(INITIAL_TICKETS, {
    role: 'aluno',
    currentStudentRm: '241089',
    searchQuery: '',
    statusFilter: 'TODOS',
    sectorFilter: 'TODOS',
  });
  assert.equal(studentTickets.length, 2);
  assert.ok(studentTickets.every((t) => t.studentRm === '241089'));

  const secretariaSearch = filterTickets(INITIAL_TICKETS, {
    role: 'secretaria',
    currentStudentRm: '241089',
    searchQuery: 'quimica',
    statusFilter: TicketStatus.AGUARDANDO_ALUNO,
    sectorFilter: ServiceSector.ADMINISTRATIVO,
  });
  assert.equal(secretariaSearch.length, 1);
  assert.equal(secretariaSearch[0].studentRm, '251042');
});

test('computeTicketMetrics counts statuses and SLA overdue items accurately', () => {
  const metrics = computeTicketMetrics(INITIAL_TICKETS, '2026-11-03T15:00:00-03:00');
  assert.equal(metrics.total, 5);
  assert.equal(metrics.openCount, 2);
  assert.equal(metrics.inAnalysisCount, 1);
  assert.equal(metrics.waitingStudentCount, 1);
  assert.equal(metrics.completedCount, 1);
  // tkt-102 had dueDate 2026-11-02 and is still ABERTO
  assert.equal(metrics.overdueCount, 1);
});

test('selectNextQueueTicket prioritizes Lei 10.048/00 priority tickets and generateQueueCode increments prefix', () => {
  const next = selectNextQueueTicket(INITIAL_QUEUE);
  assert.ok(next);
  assert.equal(next.code, 'P-011');

  const newGeneralCode = generateQueueCode(INITIAL_QUEUE, QueueCategory.GERAL);
  assert.equal(newGeneralCode, 'A-043');

  const queueWithoutPriority = INITIAL_QUEUE.map((q) =>
    q.code === 'P-011' ? { ...q, state: QueueState.ATENDIDO } : q
  );
  const nextRegular = selectNextQueueTicket(queueWithoutPriority);
  assert.ok(nextRegular);
  assert.equal(nextRegular.code, 'E-018');
});

test('validateAppointmentForm blocks conflicting confirmed guiche slot', () => {
  const conflict = validateAppointmentForm(
    {
      studentName: 'Carlos Eduardo Silva',
      studentRm: '249911',
      course: 'Técnico em Logística',
      reason: 'Entrega de documentos de estágio obrigatório',
      date: '2026-11-05',
      timeSlot: '19:00',
      counterLabel: 'Guichê 02 · Estágio',
    },
    [
      {
        id: 'apt-1',
        studentName: 'Beatriz Almeida Santos',
        studentRm: '241089',
        course: 'Técnico em Desenvolvimento de Sistemas',
        reason: 'Retirada de TCE',
        date: '2026-11-05',
        timeSlot: '19:00',
        counterLabel: 'Guichê 02 · Estágio',
        status: 'Confirmado',
      },
    ]
  );

  assert.equal(conflict.valid, false);
  assert.ok(conflict.errors.timeSlot);
});
