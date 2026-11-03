import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, FileCheck2, FolderKanban } from 'lucide-react';
import {
  ActiveRole,
  AppView,
  StudyShift,
  SupportTicket,
} from '../types/atendimento';
import {
  CURRENT_STUDENT,
  ETEC_COURSES,
  MODULE_OPTIONS,
  SERVICE_CATALOG,
} from '../data/etecCatalog';
import {
  formatShortDatePtBr,
  NewTicketInput,
  validateNewTicketForm,
} from '../utils/atendimentoRules';

interface NewTicketViewProps {
  activeRole: ActiveRole;
  preselectedServiceId: string | null;
  onCreateTicket: (input: NewTicketInput) => SupportTicket;
  onSelectTicket: (ticket: SupportTicket) => void;
  onNavigate: (view: AppView) => void;
}

export function NewTicketView({
  activeRole,
  preselectedServiceId,
  onCreateTicket,
  onSelectTicket,
  onNavigate,
}: NewTicketViewProps) {
  const initialServiceId = preselectedServiceId ?? SERVICE_CATALOG[0].id;
  const initialService = SERVICE_CATALOG.find((s) => s.id === initialServiceId);

  const [serviceId, setServiceId] = useState(initialServiceId);
  const [studentName, setStudentName] = useState(
    activeRole === 'aluno' ? CURRENT_STUDENT.name : ''
  );
  const [studentRm, setStudentRm] = useState(
    activeRole === 'aluno' ? CURRENT_STUDENT.rm : ''
  );
  const [studentEmail, setStudentEmail] = useState(
    activeRole === 'aluno' ? CURRENT_STUDENT.email : ''
  );
  const [course, setCourse] = useState(
    activeRole === 'aluno' ? CURRENT_STUDENT.course : ETEC_COURSES[0]
  );
  const [shift, setShift] = useState<StudyShift>(
    activeRole === 'aluno' ? CURRENT_STUDENT.shift : StudyShift.NOITE
  );
  const [moduleOrSeries, setModuleOrSeries] = useState(
    activeRole === 'aluno' ? CURRENT_STUDENT.moduleOrSeries : MODULE_OPTIONS[0]
  );
  const [disciplineName, setDisciplineName] = useState('');
  const [description, setDescription] = useState('');
  const [checkedDocuments, setCheckedDocuments] = useState<string[]>(
    initialService ? [...initialService.requiredDocuments] : []
  );

  const [errors, setErrors] = useState<Partial<Record<keyof NewTicketInput, string>>>({});
  const [createdTicket, setCreatedTicket] = useState<SupportTicket | null>(null);

  useEffect(() => {
    if (preselectedServiceId) {
      setServiceId(preselectedServiceId);
      const found = SERVICE_CATALOG.find((s) => s.id === preselectedServiceId);
      if (found) {
        setCheckedDocuments([...found.requiredDocuments]);
      }
    }
  }, [preselectedServiceId]);

  useEffect(() => {
    if (activeRole === 'aluno') {
      setStudentName(CURRENT_STUDENT.name);
      setStudentRm(CURRENT_STUDENT.rm);
      setStudentEmail(CURRENT_STUDENT.email);
      setCourse(CURRENT_STUDENT.course);
      setShift(CURRENT_STUDENT.shift);
      setModuleOrSeries(CURRENT_STUDENT.moduleOrSeries);
    }
  }, [activeRole]);

  const selectedService = SERVICE_CATALOG.find((s) => s.id === serviceId);

  const handleServiceChange = (nextId: string) => {
    setServiceId(nextId);
    const nextService = SERVICE_CATALOG.find((s) => s.id === nextId);
    setCheckedDocuments(nextService ? [...nextService.requiredDocuments] : []);
    setErrors((prev) => ({ ...prev, serviceId: undefined, disciplineName: undefined }));
  };

  const toggleDocument = (doc: string) => {
    setCheckedDocuments((prev) =>
      prev.includes(doc) ? prev.filter((item) => item !== doc) : [...prev, doc]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formInput: NewTicketInput = {
      serviceId,
      studentName,
      studentRm,
      studentEmail,
      course,
      shift,
      moduleOrSeries,
      disciplineName: selectedService?.requiresDiscipline ? disciplineName : undefined,
      description,
      checkedDocuments,
    };

    const validation = validateNewTicketForm(formInput, selectedService);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const newTicket = onCreateTicket(formInput);
    setCreatedTicket(newTicket);
  };

  const handleResetNew = () => {
    setCreatedTicket(null);
    setDescription('');
    setDisciplineName('');
    setErrors({});
  };

  if (createdTicket) {
    return (
      <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-700">
              Requerimento Registrado com Sucesso
            </p>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Protocolo {createdTicket.protocol}
            </h1>
            <p className="text-sm text-slate-600">
              Sua solicitação foi encaminhada para{' '}
              <strong className="font-semibold text-slate-800">
                {createdTicket.sector}
              </strong>{' '}
              com previsão regimental de atendimento até{' '}
              <span className="font-mono font-semibold tabular-nums text-slate-900">
                {formatShortDatePtBr(createdTicket.dueDate)}
              </span>
              .
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-200 border-t border-b border-slate-200 text-sm">
          <div className="py-3 flex justify-between gap-4">
            <span className="text-slate-500">Serviço Solicitado</span>
            <span className="font-medium text-slate-900 text-right">
              {createdTicket.serviceTitle}
            </span>
          </div>
          <div className="py-3 flex justify-between gap-4">
            <span className="text-slate-500">Estudante</span>
            <span className="font-medium text-slate-900 tabular-nums text-right">
              {createdTicket.studentName} · RM {createdTicket.studentRm}
            </span>
          </div>
          <div className="py-3 flex justify-between gap-4">
            <span className="text-slate-500">Curso / Módulo</span>
            <span className="text-slate-800 text-right">
              {createdTicket.course} ({createdTicket.moduleOrSeries})
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleResetNew}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
          >
            Registrar Outro Pedido
          </button>
          <button
            type="button"
            onClick={() => onSelectTicket(createdTicket)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#3E4E56] hover:bg-slate-50 whitespace-nowrap"
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Abrir Comprovante</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('tickets')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#B20000] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#8F0000] whitespace-nowrap"
          >
            <FolderKanban className="h-4 w-4" />
            <span>Ir para Protocolos</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          {activeRole === 'aluno'
            ? 'Nova Solicitação Acadêmica'
            : 'Registro de Requerimento no Balcão'}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Preencha os dados abaixo para gerar um protocolo oficial junto à Secretaria Acadêmica da Etec Prof. Dr. José Dagnoni.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start"
      >
        {/* Left Form Column (8 cols) */}
        <div className="xl:col-span-8 rounded-xl border border-slate-200 bg-white divide-y divide-slate-200">
          {/* Step 1: Service Selection */}
          <div className="p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              01. Tipo de Requerimento
            </h2>

            <div>
              <label
                htmlFor="service-select"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Serviço Acadêmico Desejado *
              </label>
              <select
                id="service-select"
                value={serviceId}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
              >
                {SERVICE_CATALOG.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title} ({service.slaBusinessDays}{' '}
                    {service.slaBusinessDays === 1 ? 'dia útil' : 'dias úteis'})
                  </option>
                ))}
              </select>
              {errors.serviceId && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B20000]">
                  {errors.serviceId}
                </p>
              )}
            </div>

            {selectedService?.requiresDiscipline && (
              <div>
                <label
                  htmlFor="discipline-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Componente Curricular (Disciplina) *
                </label>
                <input
                  id="discipline-input"
                  type="text"
                  value={disciplineName}
                  onChange={(e) => {
                    setDisciplineName(e.target.value);
                    if (errors.disciplineName) {
                      setErrors((prev) => ({ ...prev, disciplineName: undefined }));
                    }
                  }}
                  placeholder="Ex.: Programação Web III, Química Analítica..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                />
                {errors.disciplineName && (
                  <p role="alert" className="mt-1 text-xs font-medium text-[#B20000]">
                    {errors.disciplineName}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Student Identification */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-slate-900">
                02. Identificação do Estudante
              </h2>
              {activeRole === 'secretaria' && (
                <button
                  type="button"
                  onClick={() => {
                    setStudentName(CURRENT_STUDENT.name);
                    setStudentRm(CURRENT_STUDENT.rm);
                    setStudentEmail(CURRENT_STUDENT.email);
                    setCourse(CURRENT_STUDENT.course);
                    setShift(CURRENT_STUDENT.shift);
                    setModuleOrSeries(CURRENT_STUDENT.moduleOrSeries);
                    setErrors({});
                  }}
                  className="text-xs font-semibold text-[#B20000] hover:underline whitespace-nowrap"
                >
                  Carregar RM 241089
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="student-name"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Nome Completo do Aluno *
                </label>
                <input
                  id="student-name"
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    if (errors.studentName) {
                      setErrors((prev) => ({ ...prev, studentName: undefined }));
                    }
                  }}
                  placeholder="Nome completo conforme matrícula NSA"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                />
                {errors.studentName && (
                  <p role="alert" className="mt-1 text-xs font-medium text-[#B20000]">
                    {errors.studentName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="student-rm"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  RM (Matrícula) *
                </label>
                <input
                  id="student-rm"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={studentRm}
                  onChange={(e) => {
                    setStudentRm(e.target.value);
                    if (errors.studentRm) {
                      setErrors((prev) => ({ ...prev, studentRm: undefined }));
                    }
                  }}
                  placeholder="Ex.: 241089"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-sm tabular-nums text-slate-900 focus:border-[#B20000] focus:outline-none"
                />
                {errors.studentRm && (
                  <p role="alert" className="mt-1 text-xs font-medium text-[#B20000]">
                    {errors.studentRm}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="student-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  E-mail Institucional ou Contato *
                </label>
                <input
                  id="student-email"
                  type="email"
                  value={studentEmail}
                  onChange={(e) => {
                    setStudentEmail(e.target.value);
                    if (errors.studentEmail) {
                      setErrors((prev) => ({ ...prev, studentEmail: undefined }));
                    }
                  }}
                  placeholder="aluno@etec.sp.gov.br"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                />
                {errors.studentEmail && (
                  <p role="alert" className="mt-1 text-xs font-medium text-[#B20000]">
                    {errors.studentEmail}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="student-course"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Habilitação / Curso *
                </label>
                <select
                  id="student-course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                >
                  {ETEC_COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="student-shift"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Período / Turno
                </label>
                <select
                  id="student-shift"
                  value={shift}
                  onChange={(e) => setShift(e.target.value as StudyShift)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                >
                  {Object.values(StudyShift).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="student-module"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Módulo / Série Atual *
                </label>
                <select
                  id="student-module"
                  value={moduleOrSeries}
                  onChange={(e) => setModuleOrSeries(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
                >
                  {MODULE_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Justification & Submit */}
          <div className="p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              03. Finalidade e Observações
            </h2>

            <div>
              <label
                htmlFor="ticket-description"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Detalhamento e Motivo do Pedido *
              </label>
              <textarea
                id="ticket-description"
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: undefined }));
                  }
                }}
                placeholder="Informe a finalidade do documento (ex.: entrega em empresa concedente de estágio, comprovação no trabalho, período de atestado médico, etc.)..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
              />
              {errors.description ? (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B20000]">
                  {errors.description}
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  Mínimo de 15 caracteres para instrução do processo acadêmico.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('overview')}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#B20000] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#8F0000] transition-colors whitespace-nowrap"
              >
                Protocolar Solicitação
              </button>
            </div>
          </div>
        </div>

        {/* Right Info & Checklist Column (4 cols) */}
        {selectedService && (
          <aside className="xl:col-span-4 rounded-xl border border-slate-200 bg-white divide-y divide-slate-200">
            <div className="p-6 space-y-2">
              <p className="text-xs font-semibold text-[#B20000]">
                Orientação Regimental
              </p>
              <h3 className="font-display text-base font-bold text-slate-900">
                {selectedService.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                {selectedService.summary}
              </p>
              <div className="pt-2 text-xs text-slate-600 tabular-nums">
                <span className="font-semibold text-slate-800">Setor:</span>{' '}
                {selectedService.sector}
                <span className="mx-1.5 text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span className="font-semibold text-slate-800">Prazo SLA:</span>{' '}
                {selectedService.slaBusinessDays}{' '}
                {selectedService.slaBusinessDays === 1 ? 'dia útil' : 'dias úteis'}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <p className="text-xs font-semibold text-slate-800">
                Checklist de Documentação Exigida
              </p>
              <p className="text-xs text-slate-500">
                Marque os documentos que você já possui em mãos para apresentação ou conferência:
              </p>
              <div className="space-y-2.5 pt-1">
                {selectedService.requiredDocuments.map((doc) => {
                  const checked = checkedDocuments.includes(doc);
                  return (
                    <label
                      key={doc}
                      className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDocument(doc)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#B20000]"
                      />
                      <span className="leading-snug">{doc}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>
        )}
      </form>
    </div>
  );
}
