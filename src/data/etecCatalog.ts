import {
  FaqItem,
  QueueCategory,
  QueueState,
  QueueTicket,
  ScheduledAppointment,
  ServiceCatalogItem,
  ServiceSector,
  StudentProfile,
  StudyShift,
  SupportTicket,
  TicketStatus,
} from '../types/atendimento';

export const CURRENT_STUDENT: StudentProfile = {
  name: 'Beatriz Almeida Santos',
  rm: '241089',
  email: 'beatriz.santos94@etec.sp.gov.br',
  course: 'Técnico em Desenvolvimento de Sistemas',
  shift: StudyShift.NOITE,
  moduleOrSeries: '3º Módulo',
  raSp: '000109482715-9 SP',
};

export const ETEC_UNIT_INFO = {
  name: 'Etec Prof. Dr. José Dagnoni',
  unitCode: 'Unidade 118',
  city: "Santa Bárbara d'Oeste — SP",
  institution: 'Centro Paula Souza · Governo do Estado de São Paulo',
  address: 'Av. Antônio Pedroso, 1731 — Cidade Nova, CEP 13454-409',
  phone: '(19) 3457-4624',
  email: 'e118acad@cps.sp.gov.br',
  hours: 'Segunda a Sexta · 08h00 às 12h00, 13h30 às 17h00 e 18h30 às 21h30',
};

export const ETEC_COURSES: string[] = [
  'Técnico em Desenvolvimento de Sistemas',
  'M-Tec Integrado em Desenvolvimento de Sistemas',
  'M-Tec Integrado em Administração',
  'M-Tec Integrado em Química',
  'M-Tec Integrado em Nutrição e Dietética',
  'Técnico em Enfermagem',
  'Técnico em Recursos Humanos',
  'Técnico em Contabilidade',
  'Técnico em Segurança do Trabalho',
  'Técnico em Logística',
];

export const MODULE_OPTIONS: string[] = [
  '1º Módulo',
  '2º Módulo',
  '3º Módulo',
  '4º Módulo',
  '1ª Série (Ensino Médio Integrado)',
  '2ª Série (Ensino Médio Integrado)',
  '3ª Série (Ensino Médio Integrado)',
  'Egresso / Concluinte',
];

export const SERVICE_CATALOG: ServiceCatalogItem[] = [
  {
    id: 'decl-matricula',
    title: 'Declaração de Matrícula e Frequência Escolar',
    sector: ServiceSector.SECRETARIA,
    slaBusinessDays: 2,
    summary:
      'Emissão de documento oficial assinado pela Diretoria de Serviços Acadêmicos comprovando vínculo ativo, turno e frequência no semestre vigente.',
    requiredDocuments: [
      'Documento oficial com foto (RG ou CIN)',
      'Finalidade da declaração informada na justificativa (Estágio, Trabalho, Convênio ou Outros)',
    ],
  },
  {
    id: 'passe-escolar',
    title: 'Solicitação / Renovação de Passe Escolar (EMTU e Municipal)',
    sector: ServiceSector.ADMINISTRATIVO,
    slaBusinessDays: 5,
    summary:
      'Cadastro e homologação de cota estudantil junto à empresa de transporte urbano ou intermunicipal para estudantes residentes a mais de 1 km da unidade.',
    requiredDocuments: [
      'Comprovante de endereço recente (máximo 90 dias) em nome do aluno ou responsável',
      'RG e CPF do estudante',
      'Número do cartão de transporte (se renovação)',
    ],
  },
  {
    id: 'estagio-tce',
    title: 'Assinatura de Termo de Compromisso de Estágio (TCE / Aditivo)',
    sector: ServiceSector.ESTAGIO,
    slaBusinessDays: 3,
    summary:
      'Conferência pedagógica e assinatura institucional do contrato de estágio supervisionado obrigatório ou não obrigatório (Lei Federal nº 11.788/2008).',
    requiredDocuments: [
      '3 vias do Termo de Compromisso de Estágio assinadas pela empresa e pelo estudante',
      'Plano de Atividades compatível com o eixo tecnológico do curso',
      'Número da apólice e seguradora contra acidentes pessoais',
    ],
  },
  {
    id: 'historico-certificado',
    title: 'Histórico Escolar Parcial ou Certificado de Conclusão',
    sector: ServiceSector.SECRETARIA,
    slaBusinessDays: 15,
    summary:
      'Expedição de Histórico Escolar oficial com menções e carga horária cumprida, ou Certificado de Conclusão de Curso Técnico registrado no SISTEC/MEC.',
    requiredDocuments: [
      'RG atualizado (não é aceita CNH para expedição de diploma/certificado)',
      'Certidão de Nascimento ou Casamento legível',
      'Histórico de conclusão do Ensino Médio (para cursos técnicos modulares)',
      'Nada consta da Biblioteca escolar',
    ],
  },
  {
    id: 'aproveitamento-estudos',
    title: 'Aproveitamento de Estudos e Avaliação de Competências',
    sector: ServiceSector.PEDAGOGICO,
    slaBusinessDays: 10,
    summary:
      'Solicitação de dispensa de componente curricular cursado com aproveitamento em outra habilitação técnica ou ensino superior correlato.',
    requiredDocuments: [
      'Histórico Escolar oficial da instituição de origem',
      'Ementa / Plano de Ensino detalhado com carga horária do componente',
    ],
    requiresDiscipline: true,
  },
  {
    id: 'justificativa-faltas',
    title: 'Justificativa de Faltas / Regime de Exercícios Domiciliares',
    sector: ServiceSector.SECRETARIA,
    slaBusinessDays: 2,
    summary:
      'Protocolo de atestado médico, convocação judicial, serviço militar ou afastamento superior a 15 dias (Decreto-Lei nº 1.044/69 e Lei nº 6.202/75).',
    requiredDocuments: [
      'Atestado médico original contendo CID, carimbo, CRM e período de afastamento (protocolar em até 5 dias úteis do início)',
    ],
  },
  {
    id: 'reconsideracao-mencao',
    title: 'Reconsideração de Menção Final (Conselho de Classe)',
    sector: ServiceSector.PEDAGOGICO,
    slaBusinessDays: 5,
    summary:
      'Pedido formal de revisão de menção final (MB, B, R ou I) dirigido à Direção da Etec dentro do prazo regimental após divulgação no NSA.',
    requiredDocuments: [
      'Exposição fundamentada dos motivos pedagógicos e avaliações realizadas no bimestre/semestre',
    ],
    requiresDiscipline: true,
  },
  {
    id: 'carteirinha-nsa',
    title: '2ª Via de Carteirinha Escolar / Redefinição de Acesso NSA e Teams',
    sector: ServiceSector.SUPORTE,
    slaBusinessDays: 2,
    summary:
      'Emissão de nova identificação estudantil física ou regularização de credenciais do e-mail institucional (@etec.sp.gov.br) e Novo Sistema Acadêmico.',
    requiredDocuments: [
      'Foto 3x4 recente (para carteirinha física)',
      'Documento de identificação com foto',
    ],
  },
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-104',
    protocol: 'ETEC-2026-0104',
    serviceId: 'estagio-tce',
    serviceTitle: 'Assinatura de Termo de Compromisso de Estágio (TCE / Aditivo)',
    sector: ServiceSector.ESTAGIO,
    studentName: 'Beatriz Almeida Santos',
    studentRm: '241089',
    studentEmail: 'beatriz.santos94@etec.sp.gov.br',
    course: 'Técnico em Desenvolvimento de Sistemas',
    shift: StudyShift.NOITE,
    moduleOrSeries: '3º Módulo',
    description:
      'Encaminho dados do Termo de Compromisso de Estágio junto à empresa TechVale Sistemas Ltda (CIEE), início previsto em 10/11/2026, carga horária de 30h semanais das 09h às 16h.',
    checkedDocuments: [
      '3 vias do Termo de Compromisso de Estágio assinadas pela empresa e pelo estudante',
      'Plano de Atividades compatível com o eixo tecnológico do curso',
      'Número da apólice e seguradora contra acidentes pessoais',
    ],
    status: TicketStatus.EM_ANALISE,
    createdAt: '2026-11-02T14:20:00-03:00',
    updatedAt: '2026-11-03T09:15:00-03:00',
    dueDate: '2026-11-05T18:00:00-03:00',
    assignedTo: 'Prof. Marcos Vinícius Prado (Coord. Estágio)',
    messages: [
      {
        id: 'msg-1',
        authorName: 'Beatriz Almeida Santos',
        authorRole: 'aluno',
        content:
          'Boa tarde! Já entreguei as vias assinadas pelo agente de integração e confirmei o número da apólice Porto Seguro no formulário.',
        createdAt: '2026-11-02T14:20:00-03:00',
      },
      {
        id: 'msg-2',
        authorName: 'Prof. Marcos Vinícius Prado',
        authorRole: 'secretaria',
        content:
          'Olá, Beatriz. O Plano de Atividades foi validado pela coordenação de Desenvolvimento de Sistemas. O documento segue hoje para assinatura da Direção.',
        createdAt: '2026-11-03T09:15:00-03:00',
      },
    ],
  },
  {
    id: 'tkt-101',
    protocol: 'ETEC-2026-0101',
    serviceId: 'decl-matricula',
    serviceTitle: 'Declaração de Matrícula e Frequência Escolar',
    sector: ServiceSector.SECRETARIA,
    studentName: 'Beatriz Almeida Santos',
    studentRm: '241089',
    studentEmail: 'beatriz.santos94@etec.sp.gov.br',
    course: 'Técnico em Desenvolvimento de Sistemas',
    shift: StudyShift.NOITE,
    moduleOrSeries: '3º Módulo',
    description:
      'Solicito declaração de matrícula atualizada constando horário de aulas das 19h00 às 22h50 para apresentação no setor de RH da empresa contratante.',
    checkedDocuments: [
      'Documento oficial com foto (RG ou CIN)',
      'Finalidade da declaração informada na justificativa (Estágio, Trabalho, Convênio ou Outros)',
    ],
    status: TicketStatus.CONCLUIDO,
    createdAt: '2026-10-28T19:05:00-03:00',
    updatedAt: '2026-10-29T15:40:00-03:00',
    dueDate: '2026-10-30T18:00:00-03:00',
    assignedTo: 'Cláudia Helena Ribeiro (Secretaria Acadêmica)',
    resolutionNote:
      'Declaração emitida com código de autenticidade NSA #9982-SP e disponibilizada para retirada no Guichê 01 ou impressão de comprovante.',
    messages: [
      {
        id: 'msg-3',
        authorName: 'Cláudia Helena Ribeiro',
        authorRole: 'secretaria',
        content:
          'Documento emitido e assinado digitalmente pela Diretoria de Serviços Acadêmicos. Disponível na secretaria.',
        createdAt: '2026-10-29T15:40:00-03:00',
      },
    ],
  },
  {
    id: 'tkt-105',
    protocol: 'ETEC-2026-0105',
    serviceId: 'passe-escolar',
    serviceTitle: 'Solicitação / Renovação de Passe Escolar (EMTU e Municipal)',
    sector: ServiceSector.ADMINISTRATIVO,
    studentName: 'Gabriel Henrique Oliveira',
    studentRm: '251042',
    studentEmail: 'gabriel.oliveira112@etec.sp.gov.br',
    course: 'M-Tec Integrado em Química',
    shift: StudyShift.MANHA,
    moduleOrSeries: '2ª Série (Ensino Médio Integrado)',
    description:
      'Renovação de cota estudantil intermunicipal EMTU (Americana -> Santa Bárbara d’Oeste) para o mês de novembro.',
    checkedDocuments: [
      'RG e CPF do estudante',
      'Número do cartão de transporte (se renovação)',
    ],
    status: TicketStatus.AGUARDANDO_ALUNO,
    createdAt: '2026-10-30T10:12:00-03:00',
    updatedAt: '2026-11-01T11:30:00-03:00',
    dueDate: '2026-11-06T18:00:00-03:00',
    assignedTo: 'Renato Tavares (Serviços Administrativos)',
    messages: [
      {
        id: 'msg-4',
        authorName: 'Renato Tavares',
        authorRole: 'secretaria',
        content:
          'Gabriel, o comprovante de endereço apresentado é de maio/2026. Por gentileza, apresente conta de consumo emitida nos últimos 90 dias no balcão ou informe a regularização aqui.',
        createdAt: '2026-11-01T11:30:00-03:00',
      },
    ],
  },
  {
    id: 'tkt-106',
    protocol: 'ETEC-2026-0106',
    serviceId: 'aproveitamento-estudos',
    serviceTitle: 'Aproveitamento de Estudos e Avaliação de Competências',
    sector: ServiceSector.PEDAGOGICO,
    studentName: 'Larissa Ferreira Costa',
    studentRm: '242318',
    studentEmail: 'larissa.costa28@etec.sp.gov.br',
    course: 'Técnico em Enfermagem',
    shift: StudyShift.TARDE,
    moduleOrSeries: '1º Módulo',
    disciplineName: 'Primeiros Socorros e Biossegurança',
    description:
      'Solicito análise de aproveitamento de estudos referente ao componente cursado com menção MB na habilitação de Técnico em Segurança do Trabalho concluída em 2025.',
    checkedDocuments: [
      'Histórico Escolar oficial da instituição de origem',
      'Ementa / Plano de Ensino detalhado com carga horária do componente',
    ],
    status: TicketStatus.ABERTO,
    createdAt: '2026-11-03T08:45:00-03:00',
    updatedAt: '2026-11-03T08:45:00-03:00',
    dueDate: '2026-11-17T18:00:00-03:00',
    messages: [],
  },
  {
    id: 'tkt-102',
    protocol: 'ETEC-2026-0102',
    serviceId: 'historico-certificado',
    serviceTitle: 'Histórico Escolar Parcial ou Certificado de Conclusão',
    sector: ServiceSector.SECRETARIA,
    studentName: 'Lucas Martins Nogueira',
    studentRm: '231099',
    studentEmail: 'lucas.nogueira09@etec.sp.gov.br',
    course: 'Técnico em Logística',
    shift: StudyShift.NOITE,
    moduleOrSeries: 'Egresso / Concluinte',
    description:
      'Expedição de Certificado de Conclusão de Curso Técnico e registro SISTEC para posse em concurso público municipal.',
    checkedDocuments: [
      'RG atualizado (não é aceita CNH para expedição de diploma/certificado)',
      'Certidão de Nascimento ou Casamento legível',
      'Histórico de conclusão do Ensino Médio (para cursos técnicos modulares)',
      'Nada consta da Biblioteca escolar',
    ],
    status: TicketStatus.ABERTO,
    createdAt: '2026-10-12T16:10:00-03:00',
    updatedAt: '2026-10-20T14:00:00-03:00',
    dueDate: '2026-11-02T18:00:00-03:00',
    assignedTo: 'Cláudia Helena Ribeiro (Secretaria Acadêmica)',
    messages: [
      {
        id: 'msg-5',
        authorName: 'Cláudia Helena Ribeiro',
        authorRole: 'secretaria',
        content:
          'Conferência de laudas concluída; aguardando publicação do código validador SISTEC.',
        createdAt: '2026-10-20T14:00:00-03:00',
      },
    ],
  },
];

export const INITIAL_QUEUE: QueueTicket[] = [
  {
    id: 'q-1',
    code: 'A-041',
    category: QueueCategory.GERAL,
    studentName: 'Matheus Rocha Lima',
    studentRm: '251190',
    serviceHint: 'Retirada de Declaração de Matrícula',
    state: QueueState.CHAMADO,
    counterNumber: 1,
    issuedAt: '13:02',
    calledAt: '13:06',
  },
  {
    id: 'q-2',
    code: 'P-011',
    category: QueueCategory.PRIORITARIO,
    studentName: 'Helena Souza Camargo',
    studentRm: '241502',
    serviceHint: 'Protocolo de Atestado Médico',
    state: QueueState.AGUARDANDO,
    issuedAt: '13:04',
  },
  {
    id: 'q-3',
    code: 'E-018',
    category: QueueCategory.ESTAGIO,
    studentName: 'Pedro Augusto Mendes',
    studentRm: '241877',
    serviceHint: 'Entrega de 3 vias do TCE',
    state: QueueState.AGUARDANDO,
    issuedAt: '13:05',
  },
  {
    id: 'q-4',
    code: 'A-042',
    category: QueueCategory.GERAL,
    studentName: 'Camila Viana Barros',
    studentRm: '252008',
    serviceHint: '2ª Via de Carteirinha Escolar',
    state: QueueState.AGUARDANDO,
    issuedAt: '13:07',
  },
  {
    id: 'q-5',
    code: 'A-040',
    category: QueueCategory.GERAL,
    studentName: 'Rafael Batista Pires',
    studentRm: '232410',
    serviceHint: 'Consulta de Passe Escolar EMTU',
    state: QueueState.ATENDIDO,
    counterNumber: 2,
    issuedAt: '12:48',
    calledAt: '12:55',
  },
];

export const INITIAL_APPOINTMENTS: ScheduledAppointment[] = [
  {
    id: 'apt-1',
    studentName: 'Beatriz Almeida Santos',
    studentRm: '241089',
    course: 'Técnico em Desenvolvimento de Sistemas',
    reason: 'Retirada de Termo de Estágio assinado pela Direção',
    date: '2026-11-05',
    timeSlot: '19:00',
    counterLabel: 'Guichê 02 · Estágio',
    status: 'Confirmado',
  },
  {
    id: 'apt-2',
    studentName: 'Gabriel Henrique Oliveira',
    studentRm: '251042',
    course: 'M-Tec Integrado em Química',
    reason: 'Entrega de comprovante de residência atualizado (EMTU)',
    date: '2026-11-04',
    timeSlot: '10:30',
    counterLabel: 'Guichê 03 · Passe Escolar',
    status: 'Confirmado',
  },
];

export const AVAILABLE_TIME_SLOTS: string[] = [
  '08:30',
  '09:30',
  '10:30',
  '14:00',
  '15:30',
  '18:45',
  '19:00',
  '19:30',
  '20:15',
];

export const INSTITUTIONAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Avaliação e Menções',
    question: 'Como funciona a escala de menções (MB, B, R e I) nas Etecs do Centro Paula Souza?',
    answer:
      'Nas Etecs, a avaliação do aproveitamento escolar é expressa por menções conceituais: MB (Muito Bom), B (Bom) e R (Regular) indicam promoção/aprovação na competência avaliada, enquanto I (Insatisfatório) indica retenção caso persista após o processo de recuperação contínua e Conselho de Classe Final, respeitada a frequência mínima obrigatória de 75%.',
    legalBasis: 'Regimento Comum das Etecs — Deliberação CEETEPS nº 85/2022',
  },
  {
    id: 'faq-2',
    category: 'Frequência e Atestados',
    question: 'O atestado médico abona faltas ou apenas justifica a ausência?',
    answer:
      'O atestado médico ampara o direito à realização de avaliações aplicadas no período de ausência e, para afastamentos iguais ou superiores a 15 dias consecutivos, permite requerer o Regime de Exercícios Domiciliares para compensação de ausências. Deve ser protocolado na Secretaria Acadêmica em até 5 dias úteis contados do início do afastamento.',
    legalBasis: 'Decreto-Lei nº 1.044/1969 e Lei Federal nº 6.202/1975',
  },
  {
    id: 'faq-3',
    category: 'Reconsideração e Recursos',
    question: 'Qual é o prazo para solicitar reconsideração de menção final?',
    answer:
      'O estudante ou seu responsável legal (quando menor de 18 anos) pode protocolar pedido de reconsideração de resultado final junto à Secretaria Acadêmica no prazo máximo de 5 (cinco) dias corridos após a divulgação oficial dos resultados finais no NSA.',
    legalBasis: 'Regimento Comum das Etecs — Artigos de Reconsideração e Recursos',
  },
  {
    id: 'faq-4',
    category: 'Estágio Supervisionado',
    question: 'Posso iniciar as atividades de estágio antes da assinatura da Direção no TCE?',
    answer:
      'Não. Conforme a Lei do Estágio, o início efetivo das atividades na concedente depende da assinatura prévia de todas as partes (empresa, estudante/responsável e instituição de ensino) no Termo de Compromisso de Estágio (TCE), além de apólice vigente de seguro contra acidentes pessoais.',
    legalBasis: 'Lei Federal nº 11.788/2008',
  },
  {
    id: 'faq-5',
    category: 'Sistemas Digitais',
    question: 'Como acessar o NSA (Novo Sistema Acadêmico) e o e-mail institucional @etec.sp.gov.br?',
    answer:
      'O acesso ao NSA Aluno utiliza o código da unidade (118 para a Etec Prof. Dr. José Dagnoni), seu RM (Registro de Matrícula) e senha pessoal. Já o e-mail institucional Microsoft 365 / Teams utiliza o endereço fornecido no ato da matrícula; caso tenha esquecido a senha, abra um protocolo na categoria Suporte Acadêmico.',
    legalBasis: 'Diretrizes de TI — Centro Paula Souza (CPS)',
  },
];
