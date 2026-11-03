/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  ActiveRole,
  AppView,
  QueueCategory,
  QueueState,
  QueueTicket,
  ScheduledAppointment,
  SupportTicket,
  TicketStatus,
} from './types/atendimento';
import {
  CURRENT_STUDENT,
  ETEC_UNIT_INFO,
  INITIAL_APPOINTMENTS,
  INITIAL_QUEUE,
  INITIAL_TICKETS,
  SERVICE_CATALOG,
} from './data/etecCatalog';
import {
  AppointmentInput,
  calculateDueDateBusinessDays,
  generateProtocolCode,
  generateQueueCode,
  NewTicketInput,
  selectNextQueueTicket,
} from './utils/atendimentoRules';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { OverviewView } from './components/OverviewView';
import { TicketsView } from './components/TicketsView';
import { NewTicketView } from './components/NewTicketView';
import { PresencialQueueView } from './components/PresencialQueueView';
import { AcademicGuideView } from './components/AcademicGuideView';
import { TicketDetailModal } from './components/TicketDetailModal';

const STORAGE_KEYS = {
  TICKETS: 'etec_dagnoni_tickets_v1',
  QUEUE: 'etec_dagnoni_queue_v1',
  APPOINTMENTS: 'etec_dagnoni_appointments_v1',
  ROLE: 'etec_dagnoni_role_v1',
  VIEW: 'etec_dagnoni_view_v1',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>(() =>
    loadFromStorage<AppView>(STORAGE_KEYS.VIEW, 'overview')
  );
  const [activeRole, setActiveRole] = useState<ActiveRole>(() =>
    loadFromStorage<ActiveRole>(STORAGE_KEYS.ROLE, 'aluno')
  );
  const [tickets, setTickets] = useState<SupportTicket[]>(() =>
    loadFromStorage<SupportTicket[]>(STORAGE_KEYS.TICKETS, INITIAL_TICKETS)
  );
  const [queue, setQueue] = useState<QueueTicket[]>(() =>
    loadFromStorage<QueueTicket[]>(STORAGE_KEYS.QUEUE, INITIAL_QUEUE)
  );
  const [appointments, setAppointments] = useState<ScheduledAppointment[]>(() =>
    loadFromStorage<ScheduledAppointment[]>(
      STORAGE_KEYS.APPOINTMENTS,
      INITIAL_APPOINTMENTS
    )
  );

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(
    null
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nowIso = '2026-11-03T13:10:00-03:00';

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    } catch {
      // Ignore storage quota errors in restricted frames
    }
  }, [tickets]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
    } catch {
      // Ignore storage quota errors
    }
  }, [queue]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.APPOINTMENTS,
        JSON.stringify(appointments)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [appointments]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.ROLE, JSON.stringify(activeRole));
    } catch {
      // Ignore storage quota errors
    }
  }, [activeRole]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.VIEW, JSON.stringify(activeView));
    } catch {
      // Ignore storage quota errors
    }
  }, [activeView]);

  const selectedTicket =
    tickets.find((t) => t.id === selectedTicketId) ?? null;

  const scopedTicketCount =
    activeRole === 'aluno'
      ? tickets.filter((t) => t.studentRm === CURRENT_STUDENT.rm).length
      : tickets.length;

  const waitingQueueCount = queue.filter(
    (q) => q.state === QueueState.AGUARDANDO
  ).length;

  const handleStartServiceRequest = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setActiveView('new-ticket');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigate = (view: AppView) => {
    if (view !== 'new-ticket') {
      setPreselectedServiceId(null);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCreateTicket = (input: NewTicketInput): SupportTicket => {
    const service =
      SERVICE_CATALOG.find((s) => s.id === input.serviceId) ?? SERVICE_CATALOG[0];
    const createdIso = new Date().toISOString();
    const protocol = generateProtocolCode(tickets, 2026);
    const dueDate = calculateDueDateBusinessDays(
      createdIso,
      service.slaBusinessDays
    );

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      protocol,
      serviceId: service.id,
      serviceTitle: service.title,
      sector: service.sector,
      studentName: input.studentName.trim(),
      studentRm: input.studentRm.trim(),
      studentEmail: input.studentEmail.trim(),
      course: input.course,
      shift: input.shift,
      moduleOrSeries: input.moduleOrSeries,
      disciplineName: input.disciplineName?.trim() || undefined,
      description: input.description.trim(),
      checkedDocuments: input.checkedDocuments,
      status: TicketStatus.ABERTO,
      createdAt: createdIso,
      updatedAt: createdIso,
      dueDate,
      messages: [],
    };

    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const handleAddMessage = (
    ticketId: string,
    content: string,
    authorRole: ActiveRole
  ) => {
    const timestamp = new Date().toISOString();
    const authorName =
      authorRole === 'aluno'
        ? CURRENT_STUDENT.name
        : 'Cláudia Helena Ribeiro (Secretaria Acadêmica)';

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        return {
          ...ticket,
          updatedAt: timestamp,
          messages: [
            ...ticket.messages,
            {
              id: `msg-${Date.now()}`,
              authorName,
              authorRole,
              content,
              createdAt: timestamp,
            },
          ],
        };
      })
    );
  };

  const handleUpdateSecretariaDispatch = (
    ticketId: string,
    updates: {
      status: TicketStatus;
      assignedTo: string;
      resolutionNote: string;
    }
  ) => {
    const timestamp = new Date().toISOString();
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        return {
          ...ticket,
          status: updates.status,
          assignedTo: updates.assignedTo,
          resolutionNote: updates.resolutionNote,
          updatedAt: timestamp,
        };
      })
    );
  };

  const handleIssueQueueTicket = (input: {
    category: QueueCategory;
    studentName: string;
    studentRm: string;
    serviceHint: string;
  }): QueueTicket => {
    const code = generateQueueCode(queue, input.category);
    const nowTime = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    const created: QueueTicket = {
      id: `q-${Date.now()}`,
      code,
      category: input.category,
      studentName: input.studentName,
      studentRm: input.studentRm,
      serviceHint: input.serviceHint,
      state: QueueState.AGUARDANDO,
      issuedAt: nowTime,
    };

    setQueue((prev) => [...prev, created]);
    return created;
  };

  const handleCallNextTicket = (counterNumber: number): QueueTicket | undefined => {
    const next = selectNextQueueTicket(queue);
    if (!next) return undefined;

    const nowTime = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    const updatedNext: QueueTicket = {
      ...next,
      state: QueueState.CHAMADO,
      counterNumber,
      calledAt: nowTime,
    };

    setQueue((prev) =>
      prev.map((item) => {
        if (item.id === next.id) return updatedNext;
        if (
          item.state === QueueState.CHAMADO &&
          item.counterNumber === counterNumber
        ) {
          return { ...item, state: QueueState.ATENDIDO };
        }
        return item;
      })
    );

    return updatedNext;
  };

  const handleCompleteCurrentTicket = (ticketId: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === ticketId ? { ...item, state: QueueState.ATENDIDO } : item
      )
    );
  };

  const handleCreateAppointment = (
    input: AppointmentInput
  ): ScheduledAppointment => {
    const created: ScheduledAppointment = {
      id: `apt-${Date.now()}`,
      studentName: input.studentName.trim(),
      studentRm: input.studentRm.trim(),
      course: input.course,
      reason: input.reason.trim(),
      date: input.date,
      timeSlot: input.timeSlot,
      counterLabel: input.counterLabel,
      status: 'Confirmado',
    };
    setAppointments((prev) => [created, ...prev]);
    return created;
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'Cancelado' } : apt
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900">
      <Sidebar
        activeView={activeView}
        onSelectView={handleNavigate}
        activeRole={activeRole}
        onChangeRole={setActiveRole}
        ticketCount={scopedTicketCount}
        waitingQueueCount={waitingQueueCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader
          activeView={activeView}
          activeRole={activeRole}
          onNavigate={handleNavigate}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-[1360px] w-full mx-auto">
          {activeView === 'overview' && (
            <OverviewView
              activeRole={activeRole}
              tickets={tickets}
              queue={queue}
              nowIso={nowIso}
              onNavigate={handleNavigate}
              onStartServiceRequest={handleStartServiceRequest}
              onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)}
            />
          )}

          {activeView === 'tickets' && (
            <TicketsView
              activeRole={activeRole}
              tickets={tickets}
              nowIso={nowIso}
              onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === 'new-ticket' && (
            <NewTicketView
              activeRole={activeRole}
              preselectedServiceId={preselectedServiceId}
              onCreateTicket={handleCreateTicket}
              onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === 'presencial' && (
            <PresencialQueueView
              activeRole={activeRole}
              queue={queue}
              appointments={appointments}
              onIssueQueueTicket={handleIssueQueueTicket}
              onCallNextTicket={handleCallNextTicket}
              onCompleteCurrentTicket={handleCompleteCurrentTicket}
              onCreateAppointment={handleCreateAppointment}
              onCancelAppointment={handleCancelAppointment}
            />
          )}

          {activeView === 'guide' && (
            <AcademicGuideView
              onStartServiceRequest={handleStartServiceRequest}
            />
          )}
        </main>

        <footer className="no-print border-t border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-2 text-xs text-slate-500 sm:flex-row sm:items-center">
            <p>
              {ETEC_UNIT_INFO.name} · {ETEC_UNIT_INFO.unitCode} ·{' '}
              {ETEC_UNIT_INFO.institution}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <p className="tabular-nums">
                Secretaria Acadêmica · {ETEC_UNIT_INFO.phone} · {ETEC_UNIT_INFO.email}
              </p>
              <a
                href={typeof window !== 'undefined' ? window.location.href : '#'}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir sistema em nova aba do navegador"
                aria-label="Abrir sistema em nova aba do navegador"
                className="inline-flex items-center gap-1 font-semibold text-[#B20000] hover:text-[#8F0000] hover:underline"
              >
                <span>Abrir no navegador</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </footer>
      </div>

      <TicketDetailModal
        ticket={selectedTicket}
        activeRole={activeRole}
        nowIso={nowIso}
        onClose={() => setSelectedTicketId(null)}
        onAddMessage={handleAddMessage}
        onUpdateSecretariaDispatch={handleUpdateSecretariaDispatch}
      />
    </div>
  );
}
