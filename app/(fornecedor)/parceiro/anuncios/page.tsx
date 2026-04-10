"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Megaphone,
  Plus,
  Eye,
  MousePointerClick,
  Pencil,
  Play,
  Pause,
  Trash2,
  MoreVertical,
  ImageOff,
  BarChart2,
} from "lucide-react";
import {
  useMeusAnuncios,
  useAlterarStatusAnuncio,
  useRemoverAnuncio,
  formatarPrecoAnuncio,
  STATUS_LABEL,
  type AnuncioListItem,
  type AnuncioStatus,
} from "@/lib/data/anuncios";
import { supabase } from "@/lib/supabase/client";

const TABS: Array<{ label: string; value: AnuncioStatus | "todos" }> = [
  { label: "Todos", value: "todos" },
  { label: "Ativos", value: "ativo" },
  { label: "Pausados", value: "pausado" },
  { label: "Rascunhos", value: "rascunho" },
  { label: "Encerrados", value: "encerrado" },
];

export default function MeusAnunciosPage() {
  const { data: anuncios = [], isLoading } = useMeusAnuncios();
  const [tab, setTab] = useState<AnuncioStatus | "todos">("todos");

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: anuncios.length };
    for (const a of anuncios) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [anuncios]);

  const filtrados = useMemo(
    () => (tab === "todos" ? anuncios : anuncios.filter((a) => a.status === tab)),
    [anuncios, tab]
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-purple">
            <Megaphone className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Meus anúncios
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 font-display">
            Gerencie suas ofertas
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Crie anúncios dos serviços que você oferece, controle status e
            acompanhe a performance.
          </p>
        </div>
        <Link
          href="/parceiro/anuncios/novo"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple hover:bg-purple-medium text-white font-semibold text-sm transition-colors shadow-lg shadow-purple/20"
        >
          <Plus className="w-4 h-4" />
          Novo anúncio
        </Link>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-2">
        {TABS.map((t) => {
          const active = tab === t.value;
          const count = counts[t.value] ?? 0;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                active
                  ? "bg-purple text-white shadow-lg shadow-purple/20"
                  : "text-gray-600 hover:bg-purple/5"
              }`}
            >
              {t.label}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista */}
      {isLoading ? (
        <LoadingState />
      ) : filtrados.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtrados.map((a) => (
            <AnuncioCard key={a.id} anuncio={a} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────

function AnuncioCard({ anuncio }: { anuncio: AnuncioListItem }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const alterarStatus = useAlterarStatusAnuncio();
  const remover = useRemoverAnuncio();

  const capa = anuncio.fotos[0] ?? null;
  const capaUrl = capa
    ? supabase.storage.from("anuncio-fotos").getPublicUrl(capa).data.publicUrl
    : null;

  const preco = formatarPrecoAnuncio({
    preco_modalidade: anuncio.preco_modalidade,
    preco_centavos: anuncio.preco_centavos,
    unidade_preco: null,
  });

  const canActivate = anuncio.status === "pausado" || anuncio.status === "rascunho";
  const canPause = anuncio.status === "ativo";
  const canDelete = anuncio.status === "rascunho" || anuncio.status === "encerrado";

  return (
    <article className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-purple/30 transition-all overflow-hidden flex flex-col">
      {/* Capa */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-purple/5 to-purple-light/10">
        {capaUrl ? (
          <Image
            src={capaUrl}
            alt={anuncio.titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-purple/30">
            <ImageOff className="w-10 h-10" />
          </div>
        )}
        <StatusBadge status={anuncio.status} />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {anuncio.categoria_nome && (
              <p className="text-[11px] font-semibold text-purple uppercase tracking-wide">
                {anuncio.categoria_nome}
              </p>
            )}
            <h3 className="mt-1 text-base font-bold text-gray-900 line-clamp-2">
              {anuncio.titulo}
            </h3>
          </div>
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              aria-label="Ações"
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
                <div className="absolute right-0 top-full mt-1 w-48 z-20 rounded-xl bg-white shadow-lg border border-gray-100 py-1">
                  <Link
                    href={`/parceiro/anuncios/editar?id=${anuncio.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-purple/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Pencil className="w-4 h-4 text-gray-400" />
                    Editar
                  </Link>
                  <Link
                    href={`/parceiro/anuncios/performance?id=${anuncio.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-purple/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    <BarChart2 className="w-4 h-4 text-gray-400" />
                    Performance
                  </Link>
                  {canActivate && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        alterarStatus.mutate({ id: anuncio.id, status: "ativo" });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-purple/5"
                    >
                      <Play className="w-4 h-4 text-gray-400" />
                      Ativar
                    </button>
                  )}
                  {canPause && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        alterarStatus.mutate({ id: anuncio.id, status: "pausado" });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-purple/5"
                    >
                      <Pause className="w-4 h-4 text-gray-400" />
                      Pausar
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        if (confirm("Remover este anúncio definitivamente?")) {
                          remover.mutate(anuncio.id);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remover
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {anuncio.resumo && (
          <p className="text-xs text-gray-500 line-clamp-2">{anuncio.resumo}</p>
        )}

        <p className="text-sm font-semibold text-purple">{preco}</p>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {anuncio.views}
          </span>
          <span className="flex items-center gap-1">
            <MousePointerClick className="w-3.5 h-3.5" />
            {anuncio.cliques}
          </span>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: AnuncioStatus }) {
  const color = {
    rascunho: "bg-gray-100 text-gray-700",
    ativo: "bg-green-100 text-green-700",
    pausado: "bg-amber-100 text-amber-700",
    encerrado: "bg-red-100 text-red-700",
  }[status];
  return (
    <span
      className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${color}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100 bg-white overflow-hidden"
        >
          <div className="aspect-[16/10] bg-gray-100 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
            <div className="h-5 w-full rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-32 rounded bg-gray-100 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ tab }: { tab: AnuncioStatus | "todos" }) {
  const isRoot = tab === "todos";
  return (
    <div className="rounded-2xl border-2 border-dashed border-purple/20 bg-white p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-purple/10 flex items-center justify-center mx-auto mb-4">
        <Megaphone className="w-7 h-7 text-purple" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 font-display">
        {isRoot ? "Você ainda não tem anúncios" : "Nenhum anúncio nesta aba"}
      </h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
        {isRoot
          ? "Crie seu primeiro anúncio para começar a aparecer para os postos da sua região."
          : "Mude o filtro acima ou crie um novo anúncio."}
      </p>
      {isRoot && (
        <Link
          href="/parceiro/anuncios/novo"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-purple hover:bg-purple-medium text-white font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Criar anúncio
        </Link>
      )}
    </div>
  );
}
