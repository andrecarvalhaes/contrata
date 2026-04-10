"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard, Check, Zap, AlertCircle } from "lucide-react";
import {
  usePlanos,
  useMinhaAssinatura,
  formatarReais,
} from "@/lib/data/financeiro";

const ASSINATURA_STATUS_LABEL: Record<string, string> = {
  ativa: "Ativa",
  trial: "Período de teste",
  suspensa: "Suspensa",
  cancelada: "Cancelada",
};

const ASSINATURA_STATUS_COR: Record<string, string> = {
  ativa: "bg-green-100 text-green-700 border-green-200",
  trial: "bg-blue-100 text-blue-700 border-blue-200",
  suspensa: "bg-amber-100 text-amber-700 border-amber-200",
  cancelada: "bg-red-100 text-red-700 border-red-200",
};

export default function PlanoPage() {
  const { data: planos = [], isLoading: loadingPlanos } = usePlanos();
  const { data: assinatura, isLoading: loadingAssinatura } = useMinhaAssinatura();

  const isLoading = loadingPlanos || loadingAssinatura;

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
          <CreditCard className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Assinatura
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">
          Meu plano
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Gerencie sua assinatura e compare os planos disponíveis.
        </p>
      </header>

      {/* Assinatura atual */}
      {!isLoading && (
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4">
            Plano atual
          </h2>
          {assinatura ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-bold text-gray-900 font-display">
                    {assinatura.plano_nome}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {formatarReais(assinatura.preco_mensal_centavos)}
                    /mês
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    ASSINATURA_STATUS_COR[assinatura.status] ??
                    "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {ASSINATURA_STATUS_LABEL[assinatura.status] ?? assinatura.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Início
                  </p>
                  <p className="mt-0.5 font-semibold text-gray-900">
                    {new Date(assinatura.inicio_em).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                {assinatura.proximo_ciclo_em && (
                  <div className="p-3 rounded-xl bg-gray-50">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      Próxima cobrança
                    </p>
                    <p className="mt-0.5 font-semibold text-gray-900">
                      {new Date(assinatura.proximo_ciclo_em).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() =>
                    alert(
                      "Cancelamento será ativado via Conekta Subscriptions em breve."
                    )
                  }
                  className="text-sm text-red-600 hover:underline font-medium"
                >
                  Cancelar assinatura
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Nenhuma assinatura ativa. Escolha um plano abaixo para começar.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Aviso integração */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-purple/5 border border-purple/15">
        <Zap className="w-5 h-5 text-purple flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">
          <strong className="text-gray-900">Integração em andamento.</strong> A
          mudança de plano e assinatura online será ativada quando a integração
          com Conekta Subscriptions for concluída.
        </p>
      </div>

      {/* Lista de planos */}
      {isLoading ? (
        <PlanosSkeleton />
      ) : planos.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
          <p className="text-sm text-gray-400">Nenhum plano disponível no momento.</p>
        </div>
      ) : (
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-gray-700">
            Planos disponíveis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {planos.map((plano) => {
              const isAtual = assinatura?.plano_id === plano.id;
              return (
                <div
                  key={plano.id}
                  className={`rounded-2xl border p-5 shadow-sm transition-all ${
                    isAtual
                      ? "border-purple bg-purple/5 shadow-purple/10"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  {isAtual && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple text-white mb-3">
                      Plano atual
                    </span>
                  )}
                  <p className="text-lg font-bold text-gray-900 font-display">
                    {plano.nome}
                  </p>
                  {plano.descricao && (
                    <p className="text-xs text-gray-500 mt-1">{plano.descricao}</p>
                  )}
                  <p className="mt-3 text-2xl font-bold text-purple font-display">
                    {formatarReais(plano.preco_mensal_centavos)}
                    <span className="text-sm font-medium text-gray-500">/mês</span>
                  </p>
                  {plano.preco_anual_centavos && (
                    <p className="text-xs text-green-600 font-semibold mt-0.5">
                      {formatarReais(plano.preco_anual_centavos)}/ano (economia de{" "}
                      {Math.round(
                        (1 - plano.preco_anual_centavos / (plano.preco_mensal_centavos * 12)) * 100
                      )}
                      %)
                    </p>
                  )}

                  {plano.recursos.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {plano.recursos.map((r, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}

                  {!isAtual && (
                    <button
                      onClick={() =>
                        alert(
                          "Mudança de plano será ativada com a integração Conekta Subscriptions."
                        )
                      }
                      className="mt-4 w-full py-2.5 rounded-xl border border-purple text-purple font-semibold text-sm hover:bg-purple/5 transition-colors"
                    >
                      Assinar este plano
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function PlanosSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3">
          <div className="h-6 w-24 bg-gray-100 rounded" />
          <div className="h-8 w-32 bg-gray-100 rounded" />
          <div className="space-y-2 mt-2">
            {[0, 1, 2].map((j) => (
              <div key={j} className="h-4 w-3/4 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
