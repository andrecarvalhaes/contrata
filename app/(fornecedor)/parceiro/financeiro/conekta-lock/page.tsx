"use client";

import Link from "next/link";
import { ArrowLeft, Lock, CheckCircle2, Building2, Info } from "lucide-react";
import {
  useConektaLockItems,
  PAY_STATUS_LABEL,
  PAY_STATUS_COR,
  formatarReais,
  type TransacaoItem,
} from "@/lib/data/financeiro";

export default function ConektaLockPage() {
  const { data: itens = [], isLoading } = useConektaLockItems();

  const emCustodia = itens.filter((t) => t.status === "em_garantia");
  const liberados = itens.filter((t) => t.status === "liberada");
  const outros = itens.filter(
    (t) => t.status !== "em_garantia" && t.status !== "liberada"
  );

  const totalCustodia = emCustodia.reduce(
    (s, t) => s + t.valor_centavos,
    0
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Voltar */}
      <Link
        href="/parceiro/financeiro"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Extrato
      </Link>

      {/* Header */}
      <header>
        <div className="inline-flex items-center gap-2 text-purple mb-2">
          <Lock className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Conekta Lock
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">
          Valores em custódia
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Confirme a conclusão do serviço para liberar os valores retidos.
        </p>
      </header>

      {/* Explicação */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-purple/5 border border-purple/15">
        <Info className="w-5 h-5 text-purple flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong className="text-gray-900">Como funciona:</strong> o posto
            paga via Conekta Lock e o valor fica em custódia. Após você
            confirmar a conclusão do serviço, o posto aprova e o valor é
            liberado para sua conta em até 2 dias úteis.
          </p>
        </div>
      </div>

      {/* Total em custódia */}
      {totalCustodia > 0 && (
        <div className="rounded-2xl border border-purple/20 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total em custódia
            </p>
            <p className="mt-1 text-3xl font-bold text-gray-900 font-display">
              {formatarReais(totalCustodia)}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple/10 flex items-center justify-center">
            <Lock className="w-7 h-7 text-purple" />
          </div>
        </div>
      )}

      {isLoading ? (
        <Skeleton />
      ) : itens.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {/* Em custódia */}
          {emCustodia.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Aguardando confirmação
              </h2>
              {emCustodia.map((t) => (
                <LockItem key={t.id} item={t} showAction />
              ))}
            </section>
          )}

          {/* Liberados */}
          {liberados.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Liberados
              </h2>
              {liberados.map((t) => (
                <LockItem key={t.id} item={t} />
              ))}
            </section>
          )}

          {/* Outros */}
          {outros.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Outros
              </h2>
              {outros.map((t) => (
                <LockItem key={t.id} item={t} />
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function LockItem({
  item: t,
  showAction,
}: {
  item: TransacaoItem;
  showAction?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${PAY_STATUS_COR[t.status]}`}
            >
              {PAY_STATUS_LABEL[t.status]}
            </span>
            <Lock className="w-3.5 h-3.5 text-purple" />
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-700">
            <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="font-semibold">{t.posto_nome ?? "—"}</span>
          </div>
          {t.sos_titulo && (
            <p className="mt-0.5 text-xs text-gray-500 ml-5">
              {t.sos_titulo}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>
              <span className="font-medium text-gray-700">Valor bruto:</span>{" "}
              {formatarReais(t.valor_centavos)}
            </span>
            <span>
              <span className="font-medium text-gray-700">Taxa (3%):</span>{" "}
              -{formatarReais(Math.round(t.valor_centavos * 0.03))}
            </span>
            <span className="font-semibold text-green-700">
              Líquido:{" "}
              {formatarReais(t.valor_centavos - Math.round(t.valor_centavos * 0.03))}
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            {new Date(t.created_at).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            {t.liberado_em && (
              <> · Liberado em {new Date(t.liberado_em).toLocaleDateString("pt-BR")}</>
            )}
          </p>
        </div>

        {showAction && (
          <button
            onClick={() =>
              alert(
                "A confirmação de serviço será ativada com a integração Conekta Pay."
              )
            }
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors flex-shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirmar conclusão
          </button>
        )}
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3">
          <div className="h-5 w-24 bg-gray-100 rounded-full" />
          <div className="h-4 w-40 bg-gray-100 rounded" />
          <div className="h-3 w-56 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-purple/20 bg-white p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-purple/10 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-7 h-7 text-purple" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 font-display">
        Nenhum Conekta Lock ativo
      </h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
        Valores em custódia aparecerão aqui quando um posto aceitar uma
        proposta com Conekta Lock.
      </p>
    </div>
  );
}
