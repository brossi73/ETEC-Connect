export enum TicketStatus {
  ABERTO = 'Aberto',
  EM_ANALISE = 'Em Análise',
  AGUARDANDO_ALUNO = 'Aguardando Aluno',
  CONCLUIDO = 'Concluído',
  INDEFERIDO = 'Indeferido',
}

export enum ServiceSector {
  SECRETARIA = 'Secretaria Acadêmica',
  ESTAGIO = 'Coordenação de Estágio',
  PEDAGOGICO = 'Coordenação Pedagógica',
  ADMINISTRATIVO = 'Diretoria de Serviços Administrativos',
  SUPORTE = 'Suporte Acadêmico & Laboratórios',
}

export enum StudyShift {
  MANHA = 'Manhã (M-Tec / Integrado)',
  TARDE = 'Tarde (M-Tec / Modular)',
  NOITE = 'Noite (Técnico Modular)',
}

export enum QueueCategory {
  GERAL = 'Atendimento Geral',
  PRIORITARIO = 'Prioritário (Lei 10.048/00)',
  ESTAGIO = 'Entrega de Estágio / TCE',
}

export enum QueueState {
  AGUARDANDO = 'Aguardando',
  CHAMADO = 'Em Atendimento no Guichê',
  ATENDIDO = 'Finalizado',
}

export type ActiveRole = 'aluno' | 'secretaria';

export type AppView =
  | 'overview'
  | 'tickets'
  | 'new-ticket'
  | 'presencial'
  | 'guide';

export interface ServiceCatalogItem {
  id: string;
  title: string;
  sector: ServiceSector;
  slaBusinessDays: number;
  summary: string;
  requiredDocuments: string[];
  requiresDiscipline?: boolean;
}

export interface TicketMessage {
  id: string;
  authorName: string;
  authorRole: 'aluno' | 'secretaria';
  content: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  protocol: string;
  serviceId: string;
  serviceTitle: string;
  sector: ServiceSector;
  studentName: string;
  studentRm: string;
  studentEmail: string;
  course: string;
  shift: StudyShift;
  moduleOrSeries: string;
  disciplineName?: string;
  description: string;
  checkedDocuments: string[];
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  assignedTo?: string;
  resolutionNote?: string;
  messages: TicketMessage[];
}

export interface QueueTicket {
  id: string;
  code: string;
  category: QueueCategory;
  studentName: string;
  studentRm: string;
  serviceHint: string;
  state: QueueState;
  counterNumber?: number;
  issuedAt: string;
  calledAt?: string;
}

export interface ScheduledAppointment {
  id: string;
  studentName: string;
  studentRm: string;
  course: string;
  reason: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  counterLabel: string;
  status: 'Confirmado' | 'Realizado' | 'Cancelado';
}

export interface StudentProfile {
  name: string;
  rm: string;
  email: string;
  course: string;
  shift: StudyShift;
  moduleOrSeries: string;
  raSp: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  legalBasis?: string;
}
