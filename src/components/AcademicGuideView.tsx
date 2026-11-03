import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import {
  ETEC_UNIT_INFO,
  INSTITUTIONAL_FAQS,
  SERVICE_CATALOG,
} from '../data/etecCatalog';
import { normalizeSearchText } from '../utils/atendimentoRules';

interface AcademicGuideViewProps {
  onStartServiceRequest: (serviceId: string) => void;
}

export function AcademicGuideView({
  onStartServiceRequest,
}: AcademicGuideViewProps) {
  const [query, setQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    INSTITUTIONAL_FAQS[0]?.id ?? null
  );

  const normalized = normalizeSearchText(query);
  const filteredFaqs = INSTITUTIONAL_FAQS.filter((faq) => {
    if (!normalized) return true;
    return normalizeSearchText(
      `${faq.category} ${faq.question} ${faq.answer} ${faq.legalBasis ?? ''}`
    ).includes(normalized);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Guia Acadêmico, Prazos & Regimento Comum das Etecs
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Consulte normas de avaliação por menções, prazos regimentais de expedição de documentos e canais da Unidade 118.
          </p>
        </div>
      </div>

      {/* CPS Mention Scale Reference Strip */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-display text-base font-semibold text-slate-900">
            Escala Oficial de Menções — Centro Paula Souza (CPS)
          </h2>
          <p className="text-xs text-slate-500">
            Critérios de aproveitamento escolar e promoção conforme Regimento Comum das Etecs (frequência mínima exigida: 75%).
          </p>
        </div>
        <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
          <div className="p-5">
            <p className="font-mono text-2xl font-bold text-emerald-700">MB</p>
            <p className="mt-1 font-display text-sm font-semibold text-slate-900">
              Muito Bom
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Domínio pleno e autônomo das competências, habilidades e bases tecnológicas previstas no componente.
            </p>
          </div>
          <div className="p-5">
            <p className="font-mono text-2xl font-bold text-[#3E4E56]">B</p>
            <p className="mt-1 font-display text-sm font-semibold text-slate-900">
              Bom
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Desenvolvimento consistente das competências previstas, assegurando aprovação plena no componente.
            </p>
          </div>
          <div className="p-5">
            <p className="font-mono text-2xl font-bold text-amber-700">R</p>
            <p className="mt-1 font-display text-sm font-semibold text-slate-900">
              Regular
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Domínio mínimo essencial das competências exigidas para continuidade dos estudos e promoção.
            </p>
          </div>
          <div className="p-5">
            <p className="font-mono text-2xl font-bold text-[#B20000]">I</p>
            <p className="mt-1 font-display text-sm font-semibold text-slate-900">
              Insatisfatório
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Competências ainda não atingidas; encaminha o estudante à recuperação contínua e análise de Conselho.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
        {/* FAQ Accordion (7 cols) */}
        <section className="xl:col-span-7 rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900">
                Dúvidas Frequentes dos Estudantes
              </h2>
              <p className="text-xs text-slate-500">
                Base normativa: Deliberação CEETEPS nº 85/2022 e orientações NSA.
              </p>
            </div>
            <div className="relative sm:w-64">
              <label htmlFor="faq-search" className="sr-only">
                Pesquisar dúvidas no guia acadêmico
              </label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar tema (ex.: estágio, NSA)..."
                className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-[#B20000] focus:outline-none"
              />
            </div>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm font-medium text-slate-800">
                Nenhum tópico encontrado para &ldquo;{query}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-3 text-xs font-semibold text-[#B20000] hover:underline"
              >
                Exibir todas as orientações
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="px-6 py-4">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                    >
                      <div>
                        <p className="text-xs font-medium text-[#B20000]">
                          {faq.category}
                        </p>
                        <p className="mt-0.5 font-display text-sm font-semibold text-slate-900">
                          {faq.question}
                        </p>
                      </div>
                      <ChevronDown
                        className={`mt-1 h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-[#B20000]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
                        <p>{faq.answer}</p>
                        {faq.legalBasis && (
                          <p className="text-xs font-medium text-slate-500">
                            Fundamentação: {faq.legalBasis}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SLA Table & Unit Contact Info (5 cols) */}
        <section className="xl:col-span-5 rounded-xl border border-slate-200 bg-white divide-y divide-slate-200">
          <div className="px-6 py-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Tabela de Prazos de Expedição (SLA)
            </h2>
            <p className="text-xs text-slate-500">
              Contagem em dias úteis a partir do protocolo completo da documentação.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {SERVICE_CATALOG.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between gap-4 px-6 py-3 text-xs sm:text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">
                    {service.title}
                  </p>
                  <p className="text-xs text-slate-500">{service.sector}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs font-semibold tabular-nums text-slate-700">
                    {service.slaBusinessDays}d úteis
                  </span>
                  <button
                    type="button"
                    onClick={() => onStartServiceRequest(service.id)}
                    aria-label={`Iniciar protocolo de ${service.title}`}
                    className="text-xs font-semibold text-[#B20000] hover:underline whitespace-nowrap"
                  >
                    Abrir
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 space-y-1.5 text-xs text-slate-600 bg-slate-50/60">
            <p className="font-display text-sm font-semibold text-slate-900">
              {ETEC_UNIT_INFO.name} ({ETEC_UNIT_INFO.unitCode})
            </p>
            <p>{ETEC_UNIT_INFO.address}</p>
            <p className="tabular-nums">
              Telefone Secretaria: {ETEC_UNIT_INFO.phone} · E-mail:{' '}
              {ETEC_UNIT_INFO.email}
            </p>
            <p className="text-slate-500">Atendimento: {ETEC_UNIT_INFO.hours}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
