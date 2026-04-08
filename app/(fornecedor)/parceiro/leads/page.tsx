"use client";

import { useMemo, useState } from "react";
import {
  Target,
  Plus,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  ArrowRight,
  Sparkles,
  Trash2,
  Building2,
  X,
} from "lucide-react";
import {
  useMeusLeads,
  useMoverLead,
  useRemoverLead,
  useCriarLeadManual,
  ESTAGIOS_FUNIL,
  ESTAGIO_LABEL,
  ESTAGIO_COR,
  ORIGEM_LABEL,
  formatarValor,
  type LeadListItem,
  type LeadEstagio,
} from "@/lib/data/leads";

export default function MeusLeadsPage() {
  const { data: leads = [], isLoading } = useMeusLeads();
  const [filtroEstagio, setFiltroEstagio] = useState<LeadEstagio | "todos">("todos");
  const [showForm, setShowForm] = useState(false);

  const contagens = useMemo(() => {
    const c: Record<string, number> = { todos: leads.length };
    for (const l of leads) c[l.estagio] = (c[l.estagio] ?? 0) + 1;
    return c;
  }, [leads]);

  const filtrados = useMemo(
    () =>
      filtroEstagio === "todos"
        ? leads
        : leads.filter((l) => l.estagio === filtroEstagio),
    [leads, filtroEstagio]
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-purple">
            <Target className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Meus leads
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 font-display">
            Funil de oportunidades
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Acompanhe os postos interessados nos seus serviços e mova cada
            lead pelos estágios do funil.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple hover:bg-purple-medium text-white font-semibold text-sm transition-colors shadow-lg shadow-purple/20"
        >
          <Plus className="w-4 h-4" />
          Novo lead
        </button>
      </header>

      {/* Funil (contagens) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ESTAGIOS_FUNIL.map((e) => {
          const count = contagens[e] ?? 0;
          const active = filtroEstagio === e;
          return (
            <button
              key={e}
              onClick={() => setFiltroEstagio(active ? "todos" : e)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-purple bg-purple/5 shadow-lg shadow-purple/10"
                  : "border-gray-100 bg-white hover:border-purple/30"
              }`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                {ESTAGIO_LABEL[e]}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 font-display">
                {count}
              </p>
            </button>
          );
        })}
      </section>

      {/* Botão "limpar filtro" quando filtrado */}
      {filtroEstagio !== "todos" && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          Mostrando apenas <strong className="text-purple">{ESTAGIO_LABEL[filtroEstagio]}</strong>
          <button
            onClick={() => setFiltroEstagio("todos")}
            className="underline hover:text-purple"
          >
            limpar filtro
          </button>
        </div>
      )}

      {/* Lista */}
      {isLoading ? (
        <LoadingState />
      ) : filtrados.length === 0 ? (
        <EmptyState onCreate={() => setShowForm(true)} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </div>
      )}

      {/* Drawer / modal de novo lead manual */}
      {showForm && <NovoLeadModal onClose={() => setShowForm(false)} />}
    </div>
  );
}

// ─── Linha do lead ───────────────────────────────────────────────────────────

function LeadRow({ lead }: { lead: LeadListItem }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const mover = useMoverLead();
  const remover = useRemoverLead();

  const valor = formatarValor(lead.valor_estimado_centavos);
  const nomeExibicao = lead.posto_nome || lead.empresa || lead.nome_contato || "Contato";

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-purple/30 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${ESTAGIO_COR[lead.estagio]}`}
            >
              {ESTAGIO_LABEL[lead.estagio]}
            </span>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              {ORIGEM_LABEL[lead.origem]}
            </span>
          </div>
          <h3 className="mt-2 text-base font-bold text-gray-900">{lead.titulo}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
            <Building2 className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate">{nomeExibicao}</span>
          </div>

          {/* Contato */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {lead.telefone && (
              <a
                href={`tel:${lead.telefone}`}
                className="flex items-center gap-1 hover:text-purple"
              >
                <Phone className="w-3 h-3" />
                {lead.telefone}
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-1 hover:text-purple"
              >
                <Mail className="w-3 h-3" />
                {lead.email}
              </a>
            )}
            {(lead.cidade || lead.estado) && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {[lead.cidade, lead.estado].filter(Boolean).join(" - ")}
              </span>
            )}
          </div>

          {(lead.anuncio_titulo || valor) && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              {lead.anuncio_titulo && (
                <span className="inline-flex items-center gap-1 text-gray-500">
                  <Sparkles className="w-3 h-3 text-purple" />
                  {lead.anuncio_titulo}
                </span>
              )}
              {valor && (
                <span className="font-semibold text-purple">{valor}</span>
              )}
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            aria-label="Ações do lead"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-10 cursor-default"
                aria-label="Fechar menu"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-56 z-20 rounded-xl bg-white shadow-lg border border-gray-100 py-1">
                <p className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Mover para
                </p>
                {ESTAGIOS_FUNIL.filter((e) => e !== lead.estagio).map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setMenuOpen(false);
                      if (e === "perdido") {
                        const motivo = window.prompt("Motivo da perda? (opcional)") ?? undefined;
                        mover.mutate({ id: lead.id, estagio: e, motivo_perda: motivo });
                      } else {
                        mover.mutate({ id: lead.id, estagio: e });
                      }
                    }}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-purple/5"
                  >
                    <span>{ESTAGIO_LABEL[e]}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (window.confirm("Remover este lead?")) {
                        remover.mutate(lead.id);
                      }
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remover
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Modal de novo lead manual ───────────────────────────────────────────────

function NovoLeadModal({ onClose }: { onClose: () => void }) {
  const criar = useCriarLeadManual();
  const [form, setForm] = useState({
    titulo: "",
    nome_contato: "",
    empresa: "",
    telefone: "",
    email: "",
    cidade: "",
    estado: "",
    mensagem: "",
    valor_reais: "",
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.titulo.trim().length < 4) {
      setError("Informe um título de pelo menos 4 caracteres.");
      return;
    }
    try {
      await criar.mutateAsync({
        titulo: form.titulo,
        nome_contato: form.nome_contato || undefined,
        empresa: form.empresa || undefined,
        telefone: form.telefone || undefined,
        email: form.email || undefined,
        cidade: form.cidade || undefined,
        estado: form.estado || undefined,
        mensagem: form.mensagem || undefined,
        valor_estimado_centavos: form.valor_reais
          ? Math.round(Number(form.valor_reais.replace(",", ".")) * 100)
          : null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar lead.");
    }
  }

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center justify-between px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900 font-display">
            Novo lead
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <Field label="Título" required>
            <input
              value={form.titulo}
              onChange={(e) => update("titulo", e.target.value)}
              placeholder="Ex: Posto Rodovia — manutenção bomba"
              className={inputCls()}
              required
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nome do contato">
              <input
                value={form.nome_contato}
                onChange={(e) => update("nome_contato", e.target.value)}
                className={inputCls()}
              />
            </Field>
            <Field label="Empresa / Posto">
              <input
                value={form.empresa}
                onChange={(e) => update("empresa", e.target.value)}
                className={inputCls()}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Telefone">
              <input
                value={form.telefone}
                onChange={(e) => update("telefone", e.target.value)}
                className={inputCls()}
              />
            </Field>
            <Field label="E-mail">
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputCls()}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-4">
            <Field label="Cidade">
              <input
                value={form.cidade}
                onChange={(e) => update("cidade", e.target.value)}
                className={inputCls()}
              />
            </Field>
            <Field label="UF">
              <input
                value={form.estado}
                onChange={(e) =>
                  update("estado", e.target.value.toUpperCase().slice(0, 2))
                }
                maxLength={2}
                className={inputCls()}
              />
            </Field>
          </div>

          <Field label="Valor estimado (R$)">
            <input
              value={form.valor_reais}
              onChange={(e) => update("valor_reais", e.target.value)}
              placeholder="0,00"
              inputMode="decimal"
              className={inputCls()}
            />
          </Field>

          <Field label="Observações">
            <textarea
              value={form.mensagem}
              onChange={(e) => update("mensagem", e.target.value)}
              rows={3}
              className={`${inputCls()} resize-none`}
              placeholder="Contexto da negociação, necessidade do posto, urgência..."
            />
          </Field>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={criar.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple hover:bg-purple-medium text-white text-sm font-semibold shadow-lg shadow-purple/20 disabled:opacity-60"
            >
              {criar.isPending ? "Criando..." : "Criar lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-purple ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function inputCls() {
  return "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none bg-white focus:border-purple focus:ring-2 focus:ring-purple/10 transition-all";
}

// ─── Estados auxiliares ──────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100 bg-white p-5 animate-pulse"
        >
          <div className="h-3 w-20 bg-gray-100 rounded" />
          <div className="mt-3 h-5 w-2/3 bg-gray-100 rounded" />
          <div className="mt-2 h-3 w-1/3 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-purple/20 bg-white p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-purple/10 flex items-center justify-center mx-auto mb-4">
        <Target className="w-7 h-7 text-purple" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 font-display">
        Nenhum lead ainda
      </h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
        Os leads aparecem aqui quando um posto demonstra interesse nos seus
        anúncios ou no SOS Conekta. Você também pode cadastrar leads
        manualmente para organizar negociações em andamento.
      </p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-purple hover:bg-purple-medium text-white font-semibold text-sm transition-colors"
      >
        <Plus className="w-4 h-4" />
        Cadastrar lead manual
      </button>
    </div>
  );
}
