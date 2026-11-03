# Central de Atendimento ao Aluno — Etec Prof. Dr. José Dagnoni (Unidade 118)

> **Centro Paula Souza (CPS) · Governo do Estado de São Paulo**  
> Sistema web institucional para gestão acadêmica, protocolo eletrônico de requerimentos, triagem de secretaria, chamada de fila presencial e agendamento para os estudantes e servidores da Etec Prof. Dr. José Dagnoni (Santa Bárbara d'Oeste — SP).

---

### 🌐 Acesso Direto no Navegador
Acesse a aplicação em tela cheia através do link direto abaixo:

👉 **[https://ais-pre-xpkftsbqialxe5kdnvp64h-536810008499.us-west1.run.app](https://ais-pre-xpkftsbqialxe5kdnvp64h-536810008499.us-west1.run.app)**

---

## 📌 Descrição do Projeto

A **Central de Atendimento ao Aluno da Etec Prof. Dr. José Dagnoni** é uma solução digital concebida para modernizar, agilizar e humanizar o atendimento escolar técnico e integrado do Centro Paula Souza. O sistema substitui formulários manuais em papel por um fluxo digital transparente, com prazos regimentais (SLA em dias úteis) pré-definidos, cálculo automático de vencimento, checklist documental rigoroso e controle de chamadas em guichês físicos.

O sistema atende a dois perfis principais integrados em tempo real:
1. **Portal do Aluno**: o estudante visualiza seus protocolos, abre requerimentos oficiais, tira dúvidas regimentais sobre menções (`MB`, `B`, `R`, `I`), emite senhas para atendimento imediato e agenda horário na Secretaria Acadêmica para evitar filas nos intervalos.
2. **Balcão da Secretaria Acadêmica & Coordenações**: os servidores realizam triagem de solicitações, atualizam pareceres com códigos de autenticação NSA (*Novo Sistema Acadêmico*), dialogam com os alunos, despacham documentos e operam o painel eletrônico de chamadas dos Guichês 01 a 04 com garantia de prioridade legal (Lei Federal nº 10.048/2000).

---

## 🎨 Identidade Visual & Cores da Marca

O sistema segue rigorosamente o manual de identidade visual institucional do **Centro Paula Souza (CPS)** e das **Etecs**, utilizando o logotipo oficial da Unidade 118 e paleta cromática padronizada:

| Elemento | Código HEX / Token | Aplicação |
| :--- | :--- | :--- |
| **Vermelho CPS** | `#B20000` (`--color-cps-red`) | Botões de ação primária, alertas regimentais, destaques da marca e senha chamada |
| **Vermelho CPS Hover** | `#8F0000` (`--color-cps-red-hover`) | Estados interativos e foco ativo de controles primários |
| **Fundo Suave CPS** | `#FDF2F2` (`--color-cps-red-tint`) | Seleção ativa de navegação e realces de protocolo |
| **Azul-Petróleo Etec** | `#3E4E56` (`--color-etec-slate`) | Tipografia de títulos institucionais, botões secundários e detalhes do wordmark |
| **Grafite Escuro Etec** | `#253137` (`--color-etec-dark`) | Painel eletrônico de senhas dos guichês e rodapé escuro |
| **Superfície Neutra** | `#F8FAFC` / `#FFFFFF` | Canvas neutro de leitura limpa em conformidade com WCAG AA (60-30-10) |

- **Logotipo Oficial**: Integrado diretamente via `/public/assets/aistudio/image_5f2cace4.png` com componente resiliente (`BrandLogo.tsx`) e fallback SVG institucional.
- **Tipografia**: *Plus Jakarta Sans* (títulos institucionais), *Public Sans* (leitura densa de formulários e tabelas) e *JetBrains Mono* (protocolos, datas e contadores numéricos com `font-variant-numeric: tabular-nums`).

---

## 🚀 Funcionalidades Principais

### 1. Painel de Controle e Indicadores (Overview)
- **Métricas em Tempo Real**: Total de protocolos, quantidade em triagem inicial, solicitações com pendência documental do aluno e taxa de cumprimento de prazos regimentais.
- **Chamada Ativa do Guichê**: Indicação visual imediata da senha em atendimento no balcão e contagem de estudantes em espera.
- **Tabela de Requerimentos Recentes**: Acesso com 1 clique aos detalhes de cada protocolo e atalho para o catálogo de serviços.
- **Alternador de Perfis**: Chaveamento instantâneo entre o **Portal do Aluno** (escopo do estudante logado) e o **Balcão da Secretaria** (visão administrativa unificada).

### 2. Catálogo e Protocolo Digital de Requerimentos
- **Cálculo Regimental de SLA**: Contagem matemática exata de dias úteis com exclusão automática de finais de semana.
- **Serviços Acadêmicos Parametrizados**:
  - *Declaração de Matrícula e Frequência Escolar* (SLA: 2 dias úteis);
  - *Solicitação / Renovação de Passe Escolar EMTU e Municipal* (SLA: 5 dias úteis);
  - *Assinatura de Termo de Compromisso de Estágio — TCE / Aditivo* (SLA: 3 dias úteis);
  - *Histórico Escolar Parcial ou Certificado de Conclusão / SISTEC* (SLA: 15 dias úteis);
  - *Aproveitamento de Estudos e Avaliação de Competências* (SLA: 10 dias úteis — exige disciplina);
  - *Justificativa de Faltas / Regime de Exercícios Domiciliares* (SLA: 2 dias úteis);
  - *Reconsideração de Menção Final junto ao Conselho de Classe* (SLA: 5 dias úteis);
  - *2ª Via de Carteirinha Escolar e Acesso NSA / Teams* (SLA: 2 dias úteis).
- **Checklist Documental**: O estudante visualiza e confirma os documentos obrigatórios exigidos antes de submeter.
- **Código de Protocolo Sequencial Unificado**: Geração no formato oficial `ETEC-2026-XXXX`.

### 3. Gestão e Triagem de Protocolos
- **Filtros Segmentados e Busca Acento-Insensível**: Busca por número de protocolo, RM, nome, serviço ou justificativa, com abas por situação (*Abertos*, *Em Análise*, *Pendência*, *Concluídos*) e setor acadêmico.
- **Gaveta Lateral de Detalhes**:
  - Visualização completa dos dados da matrícula (Curso, Turno, Módulo, RM, RA-SP);
  - Histórico de mensagens bidirecional com registro temporal de interações;
  - Despacho da Secretaria: alteração de status, designação de servidor/coordenação responsável e parecer oficial com instruções de retirada;
  - Comprovante de protocolo formatado para impressão (`window.print()`) com ocultação automática de controles navegacionais (`no-print`).

### 4. Atendimento Presencial & Agendamento
- **Painel Eletrônico dos Guichês 01 a 04**: Exibição em estilo display de alta visibilidade da senha atual, guichê de chamada e próximo aluno previsto.
- **Fila Prioritária Legal**: Sistema de chamada que prioriza automaticamente senhas categoria `P` (Lei Federal nº 10.048/2000 — idosos, gestantes, pessoas com deficiência ou com crianças de colo) antes das categorias Geral (`A`) e Estágio (`E`).
- **Agendamento com Prevenção de Conflitos**: Agendamento de horário fixo na secretaria com validação automática para impedir choque de horário no mesmo guichê.

### 5. Guia Acadêmico & Regimento Comum das Etecs
- **Escala de Menções do CPS**: Explicação didática e normativa das menções conceituais **MB** (*Muito Bom*), **B** (*Bom*), **R** (*Regular*) e **I** (*Insatisfatório*).
- **Base Normativa CEETEPS**: FAQ interativo com fundamentação legal (Deliberação CEETEPS nº 85/2022, Decreto-Lei nº 1.044/1969, Lei do Estágio nº 11.788/2008).
- **Tabela de Prazos de Expedição**: Consulta rápida aos prazos máximos com atalho direto para emissão de cada requerimento.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) com tokens de tema customizados (`@theme`) e utilitários modernos
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Animações / Transições**: [Motion](https://motion.dev/)
- **Empacotador & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Testes Unitários**: Test runner nativo do Node.js (`node:test` e `node:assert/strict`) executado via `tsx`
- **Persistência**: Armazenamento local no navegador (`localStorage`) com fallback resiliente para sandboxes

---

## 📂 Estrutura de Diretórios

```
├── public/
│   └── assets/
│       └── aistudio/
│           └── image_5f2cace4.png      # Logotipo oficial Etec Prof. Dr. José Dagnoni / CPS
├── src/
│   ├── components/
│   │   ├── AcademicGuideView.tsx       # Guia acadêmico, escala de menções e FAQ
│   │   ├── BrandLogo.tsx               # Logotipo institucional com fallback à prova de falhas
│   │   ├── NewTicketView.tsx           # Formulário de solicitação com validação e checklist
│   │   ├── OverviewView.tsx            # Dashboard inicial com KPIs, chamadas e serviços rápidos
│   │   ├── PresencialQueueView.tsx     # Painel eletrônico de senhas e agendamento de guichês
│   │   ├── Sidebar.tsx                 # Barra lateral fixa com navegação e perfil de acesso
│   │   ├── TicketDetailModal.tsx       # Modal/drawer de detalhes, despacho, chat e impressão
│   │   ├── TicketsView.tsx             # Listagem, pesquisa acento-insensível e filtros de protocolos
│   │   └── TopHeader.tsx               # Top bar contract com breadcrumbs e CTA principal
│   ├── data/
│   │   └── etecCatalog.ts              # Catálogo de serviços, cursos da unidade e dados semente
│   ├── types/
│   │   └── atendimento.ts              # Interfaces TypeScript e enums padrão do domínio
│   ├── utils/
│   │   ├── atendimentoRules.ts         # Regras de negócio puras (cálculo SLA, validações, filas)
│   │   └── atendimentoRules.test.ts    # Testes unitários automatizados (node:test)
│   ├── App.tsx                         # Orquestrador de estado global e navegação
│   ├── index.css                       # Configuração Tailwind v4, tipografia e print styles
│   └── main.tsx                        # Ponto de montagem React 19
├── index.html                          # Metadados institucionais, Google Fonts e SEO
├── metadata.json                       # Configuração de capacidades e permissões do applet
├── package.json                        # Scripts e dependências do projeto
└── tsconfig.json                       # Configurações do compilador TypeScript
```

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
- Node.js (v20+ recomendado)
- Gerenciador de pacotes `npm` ou `bun`

### Instalação e Execução

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em ambiente de desenvolvimento**:
   ```bash
   npm run dev
   ```
   O aplicativo estará disponível em: `http://localhost:3000`.

3. **Executar a suíte de testes unitários**:
   ```bash
   npx --yes tsx --test src/utils/atendimentoRules.test.ts
   ```

4. **Validar tipos TypeScript e compilação**:
   ```bash
   npm run lint
   npm run build
   ```

---

## 🏛️ Dados da Unidade Escolar

- **Instituição**: Centro Estadual de Educação Tecnológica Paula Souza (CEETEPS) · Governo de São Paulo
- **Unidade**: Etec Prof. Dr. José Dagnoni (Código 118)
- **Localização**: Av. Antônio Pedroso, 1731 — Cidade Nova, Santa Bárbara d'Oeste — SP, CEP 13454-409
- **Horário de Atendimento da Secretaria**: Segunda a Sexta-feira das 08h00 às 12h00, 13h30 às 17h00 e 18h30 às 21h30
- **Contato**: (19) 3457-4624 · `e118acad@cps.sp.gov.br`
