"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Wallet,
  Lock,
  CreditCard,
  TrendingUp,
  Download,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import {
  useMinhasTransacoes,
  PAY_STATUS_LABEL,
  PAY_STATUS_COR,
  formatarReais,
  type PayStatus,
} from "@/lib/data/financeiro";

const FILTROS: Array<{ value: PayStatus | "todas"; label: string }> = [
  { value: "todas", label: "Todos" },
  { value: "liberada", label: "Liberados" },
  { value: "em_garantia", label: "Em custódia" },
  { value: "pendente", label: "Pendentes" },
];

export default function FinanceiroPage() {
  const [filtro, setFiltro] = useState<PayStatus | "todas">("todas");
  const { data: transacoes = [], isLoading } = useMinhasTransacoes(filtro);

  const totalMes = useMemo(() => {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);
    return transacoes
      .filter(
        (t) =>
          t.status === "liberada" &&
          new Date(t.created_at) >= inicioMes
      )
      .reduce((s, t) => s + t.valor_centavos, 0);
  }, [transacoes]);

  const totalEmCustodia = useMemo(
    () =>
      transacoes
        .filter((t) => t.status === "em_garantia")
        .reduce((s, t) => s + t.valor_centavos, 0),
    [transacoes]
  );

  function exportarCSV() {
    const header = "Data,Posto,Serviço,Valor,Status";
    const rows = transacoes.map((t) =>
      [
        new Date(t.created_at).toLocaleDateString("pt-BR"),
        t.posto_nome ?? "—",
        t.sos_titulo ?? "—",
        formatarReais(t.valor_centavos),
        PAY_STATUS_LABEL[t.status],
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extrato-conekta.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-purple">
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Financeiro
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 font-display">
            Extrato e recebimentos
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Acompanhe seus recebimentos e valores em custódia via Conekta Lock.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportarCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
          <Link
            href="/parceiro/financeiro/plano"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple/30 text-purple font-semibold text-sm hover:bg-purple/5 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Meu plano
          </Link>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-purple/10 bg-white p-5 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Receita do mês
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 font-display">
            {formatarReais(totalMes)}
          </p>
          <p className="mt-1 text-xs text-gray-500">Via Conekta Pay</p>
        </div>
        <div className="rounded-2xl border border-purple/10 bg-white p-5 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-purple/10 flex items-center justify-center mb-3">
            <Lock className="w-4 h-4 text-purple" />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Em custódia
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 font-display">
            {formatarReais(totalEmCustodia)}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <Link
              href="/parceiro/financeiro/conekta-lock"
              className="text-xs text-purple hover:underline flex items-center gap-0.5"
            >
              Ver Conekta Lock
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-purple/10 bg-white p-5 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
            <Wallet className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Total recebido
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 font-display">
            {formatarReais(
              transacoes
                .filter((t) => t.status === "liberada")
                .reduce((s, t) => s + t.valor_centavos, 0)
            )}
          </p>
          <p className="mt-1 text-xs text-gray-500">Acumulado</p>
        </div>
      </section>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filtro === f.value
                ? "bg-purple text-white border-purple shadow-lg shadow-purple/20"
                : "border-gray-200 text-gray-600 hover:border-purple/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tabela */}
      {isLoading ? (
        <TabelaSkeleton />
      ) : transacoes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Posto / Serviço
                  </th>
                  <th className="text-right px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="text-right px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Taxa
                  </th>
                  <th className="text-right px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Líquido
                  </th>
                  <th className="text-center px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transacoes.map((t) => {
                  const taxa = Math.round(t.valor_centavos * 0.03);
                  const liquido = t.valor_centavos - taxa;
                  return (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                        {new Date(t.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[160px]">
                              {t.posto_nome ?? "—"}
                            </p>
                            {t.sos_titulo && (
                              <p className="text-xs text-gray-400 truncate max-w-[160px]">
                                {t.sos_titulo}
                              </p>
                            )}
                          </div>
                          {t.conekta_lock && (
                            <Lock className="w-3 h-3 text-purple flex-shrink-0" aria-label="Conekta Lock" />
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-gray-900 whitespace-nowrap">
                        {formatarReais(t.valor_centavos)}
                      </td>
                      <td className="px-5 py-4 text-right text-gray-500 whitespace-nowrap">
                        -{formatarReais(taxa)}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-green-700 whitespace-nowrap">
                        {formatarReais(liquido)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${PAY_STATUS_COR[t.status]}`}
                        >
                          {PAY_STATUS_LABEL[t.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function TabelaSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4 animate-pulse">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between gap-4">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-4 w-40 bg-gray-100 rounded" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-purple/20 bg-white p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-purple/10 flex items-center justify-center mx-auto mb-4">
        <Wallet className="w-7 h-7 text-purple" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 font-display">
        Nenhuma transação ainda
      </h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
        Suas transações via Conekta Pay aparecerão aqui após o primeiro
        recebimento.
      </p>
    </div>
  );
}
