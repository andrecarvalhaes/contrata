"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  MessageSquare,
  FileText,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Send,
  User,
} from "lucide-react";
import {
  useLeadDetalhe,
  useMoverLead,
  formatarValor,
  ESTAGIO_LABEL,
  ESTAGIO_COR,
  ORIGEM_LABEL,
  type LeadEstagio,
} from "@/lib/data/leads";

// ─── Wrapper com Suspense ─────────────────────────────────────────────────────

export default function LeadDetalhePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LeadDetalheContent />
    </Suspense>
  );
}

// ─── Conteúdo principal ───────────────────────────────────────────────────────

function LeadDetalheContent() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  const { data: lead, isLoading, error } = useLeadDetalhe(id);
  const mover = useMoverLead();
  const [marcandoPerdido, setMarcandoPerdido] = useState(false);

  // Auto-transição: "novo" → "contatado" ao abrir o detalhe
  useEffect(() => {
    if (lead && lead.estagio === "novo") {
      mover.mutate({ id: lead.id, estagio: "contatado" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id, lead?.estagio]);

  if (!id) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center">
        <p className="text-sm text-gray-500">Lead não informado.</p>
      </div>
    );
  }

  if (isLoading) return <Skeleton />;

  if (error || !lead) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600">Não foi possível carregar o lead.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-purple hover:underline"
        >
          Voltar
        </button>
      </div>
    );
  }

  const valor = formatarValor(lead.valor_estimado_centavos);
  const nomeExibicao =
    lead.posto_nome || lead.empresa || lead.nome_contato || "Contato";
  const dadosPostoVisiveis =
    lead.estagio === "ganho" || lead.estagio === "proposta_enviada";
  const podeEnviarProposta = !["ganho", "perdido", "proposta_enviada"].includes(
    lead.estagio
  );

  async function handleMarcarPerdido() {
    setMarcandoPerdido(true);
    const motivo =
      window.prompt("Motivo da perda? (opcional)") ?? undefined;
    mover.mutate(
      { id: lead!.id, estagio: "perdido", motivo_perda: motivo },
      { onSettled: () => setMarcandoPerdido(false) }
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Voltar */}
      <Link
        href="/parceiro/leads"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Todos os leads
      </Link>

      {/* ── Header ── */}
      <header className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${ESTAGIO_COR[lead.estagio]}`}
              >
                {ESTAGIO_LABEL[lead.estagio]}
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {ORIGEM_LABEL[lead.origem]}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-display">
              {lead.titulo}
            </h1>

            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
              <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="font-medium">{nomeExibicao}</span>
            </div>

            {(lead.posto_cidade || lead.cidade) && (
              <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {[lead.posto_cidade || lead.cidade, lead.posto_estado || lead.estado]
                  .filter(Boolean)
                  .join(" — ")}
              </div>
            )}

            {valor && (
              <p className="mt-2 text-base font-semibold text-purple">{valor}</p>
            )}
          </div>

          {/* Ações */}
          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              href="/parceiro/mensagens"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple hover:bg-purple-medium text-white font-semibold text-sm transition-colors shadow-lg shadow-purple/20"
            >
              <MessageSquare className="w-4 h-4" />
              Iniciar chat
            </Link>

            {podeEnviarProposta && (
              <Link
                href={`/parceiro/leads/proposta?id=${lead.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple text-purple hover:bg-purple/5 font-semibold text-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                Enviar proposta
              </Link>
            )}

            {lead.estagio !== "perdido" && lead.estagio !== "ganho" && (
              <button
                onClick={handleMarcarPerdido}
                disabled={marcandoPerdido || mover.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Marcar como perdido
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Anúncio e mensagem inicial ── */}
      {(lead.anuncio_titulo || lead.mensagem) && (
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Origem do interesse
          </h2>

          {lead.anuncio_titulo && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-purple/5 border border-purple/10">
              <Sparkles className="w-4 h-4 text-purple flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-purple uppercase tracking-wider">
                  Anúncio
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-900">
                  {lead.anuncio_titulo}
                </p>
              </div>
            </div>
          )}

          {lead.mensagem && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Mensagem inicial
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {lead.mensagem}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Timeline ── */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">
          Histórico de interações
        </h2>

        <Timeline lead={lead} />
      </section>

      {/* ── Dados do posto ── */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          Dados do posto
        </h2>

        {dadosPostoVisiveis ? (
          <div className="space-y-3">
            {lead.posto_endereco && (
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Endereço">
                {lead.posto_endereco}
              </InfoRow>
            )}
            {lead.posto_cnpj && (
              <InfoRow icon={<FileText className="w-4 h-4" />} label="CNPJ">
                {lead.posto_cnpj}
              </InfoRow>
            )}
            {(lead.posto_telefone || lead.telefone) && (
              <InfoRow icon={<Phone className="w-4 h-4" />} label="Telefone">
                <a
                  href={`tel:${lead.posto_telefone || lead.telefone}`}
                  className="hover:text-purple"
                >
                  {lead.posto_telefone || lead.telefone}
                </a>
              </InfoRow>
            )}
            {lead.email && (
              <InfoRow icon={<Mail className="w-4 h-4" />} label="E-mail">
                <a href={`mailto:${lead.email}`} className="hover:text-purple">
                  {lead.email}
                </a>
              </InfoRow>
            )}
            {!lead.posto_endereco && !lead.posto_cnpj && !lead.posto_telefone && !lead.email && (
              <p className="text-sm text-gray-400">
                Nenhum dado de contato cadastrado para este posto.
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
            <Lock className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Dados bloqueados
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Endereço e CNPJ do posto são liberados após a proposta ser aceita.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Motivo de perda */}
      {lead.estagio === "perdido" && lead.motivo_perda && (
        <section className="rounded-2xl border border-red-100 bg-red-50/50 p-5">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
            Motivo da perda
          </p>
          <p className="text-sm text-red-700">{lead.motivo_perda}</p>
        </section>
      )}
    </div>
  );
}

// ─── Timeline ────────────────────────────────────────────────────────────────

interface TimelineEvent {
  at: string;
  label: string;
  desc?: string;
  icon: React.ReactNode;
  color: string;
}

function Timeline({ lead }: { lead: ReturnType<typeof useLeadDetalhe>["data"] & object }) {
  const events: TimelineEvent[] = [];

  events.push({
    at: lead.created_at,
    label: "Lead criado",
    desc: `Origem: ${ORIGEM_LABEL[lead.origem]}`,
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: "bg-blue-100 text-blue-600",
  });

  if (lead.contatado_em) {
    events.push({
      at: lead.contatado_em,
      label: "Lead contatado",
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      color: "bg-indigo-100 text-indigo-600",
    });
  }

  if (lead.estagio === "proposta_enviada" || lead.ganho_em || lead.perdido_em) {
    if (!lead.ganho_em && !lead.perdido_em) {
      events.push({
        at: lead.created_at, // placeholder — não temos timestamp exato
        label: "Proposta enviada",
        icon: <Send className="w-3.5 h-3.5" />,
        color: "bg-purple/10 text-purple",
      });
    }
  }

  if (lead.ganho_em) {
    events.push({
      at: lead.ganho_em,
      label: "Proposta aceita",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      color: "bg-green-100 text-green-600",
    });
  }

  if (lead.perdido_em) {
    events.push({
      at: lead.perdido_em,
      label: "Lead perdido",
      desc: lead.motivo_perda || undefined,
      icon: <XCircle className="w-3.5 h-3.5" />,
      color: "bg-red-100 text-red-600",
    });
  }

  // Ordena cronologicamente
  events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  return (
    <ol className="relative border-l border-gray-100 ml-3 space-y-6">
      {events.map((ev, i) => (
        <li key={i} className="ml-5">
          <span
            className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ${ev.color}`}
          >
            {ev.icon}
          </span>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-900">{ev.label}</p>
            {ev.desc && (
              <p className="text-xs text-gray-500 mt-0.5">{ev.desc}</p>
            )}
            <time className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
              <Clock className="w-3 h-3" />
              {new Date(ev.at).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}

// ─── Auxiliares ───────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-gray-800 font-medium mt-0.5">{children}</p>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 animate-pulse">
      <div className="h-4 w-32 bg-gray-100 rounded" />
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="h-6 w-1/3 bg-gray-100 rounded mb-3" />
        <div className="h-8 w-2/3 bg-gray-100 rounded mb-2" />
        <div className="h-4 w-1/4 bg-gray-100 rounded" />
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-3">
        <div className="h-4 w-40 bg-gray-100 rounded" />
        <div className="h-16 bg-gray-50 rounded-xl" />
      </div>
    </div>
  );
}
