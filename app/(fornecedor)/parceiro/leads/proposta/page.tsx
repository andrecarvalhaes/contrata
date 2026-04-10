"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Send,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useLeadDetalhe } from "@/lib/data/leads";

export default function PropostaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PropostaContent />
    </Suspense>
  );
}

function PropostaContent() {
  const params = useSearchParams();
  const router = useRouter();
  const leadId = params.get("id");

  const { data: lead, isLoading } = useLeadDetalhe(leadId);

  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    prazo_dias: "",
    validade_dias: "3",
    usar_conekta_lock: true,
    condicoes: "",
  });
  const [enviado, setEnviado] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Edge Function ainda não publicada — exibir aviso de em construção
    setEnviado(true);
  }

  if (!leadId) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <p className="text-sm text-gray-500">Lead não informado.</p>
      </div>
    );
  }

  if (isLoading) return <Skeleton />;

  if (enviado) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-purple/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-purple" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 font-display">
          Proposta registrada
        </h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Sua proposta foi salva. O envio via Conekta Lock será ativado assim
          que a integração de pagamentos for concluída.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href={`/parceiro/leads/detalhe?id=${leadId}`}
            className="px-5 py-2.5 rounded-xl bg-purple hover:bg-purple-medium text-white font-semibold text-sm transition-colors"
          >
            Ver lead
          </Link>
          <Link
            href="/parceiro/leads"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Todos os leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Voltar */}
      <Link
        href={`/parceiro/leads/detalhe?id=${leadId}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao lead
      </Link>

      {/* Header */}
      <header>
        <div className="inline-flex items-center gap-2 text-purple mb-2">
          <Send className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Nova proposta
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">
          Enviar proposta
        </h1>
        {lead && (
          <p className="mt-1 text-sm text-gray-600">
            Para:{" "}
            <span className="font-semibold text-gray-800">
              {lead.titulo}
            </span>
          </p>
        )}
      </header>

      {/* Aviso em construção */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
        <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Conekta Lock em integração
          </p>
          <p className="text-xs text-amber-600 mt-0.5">
            O envio real da proposta e a cobrança via Conekta Lock serão
            ativados quando a Edge Function de pagamentos for publicada. Por
            enquanto, a proposta é registrada localmente.
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5"
      >
        <Field label="Descrição da proposta" required>
          <textarea
            value={form.descricao}
            onChange={(e) => update("descricao", e.target.value)}
            rows={4}
            required
            placeholder="Descreva o serviço, escopo, materiais incluídos e condições..."
            className={inputCls + " resize-none"}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Valor (R$)" required>
            <input
              type="text"
              inputMode="decimal"
              value={form.valor}
              onChange={(e) => update("valor", e.target.value)}
              required
              placeholder="0,00"
              className={inputCls}
            />
          </Field>
          <Field label="Prazo de execução (dias)" required>
            <input
              type="number"
              min={1}
              value={form.prazo_dias}
              onChange={(e) => update("prazo_dias", e.target.value)}
              required
              placeholder="Ex: 5"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Validade da proposta (dias)">
          <select
            value={form.validade_dias}
            onChange={(e) => update("validade_dias", e.target.value)}
            className={inputCls}
          >
            <option value="1">1 dia</option>
            <option value="3">3 dias</option>
            <option value="7">7 dias</option>
            <option value="15">15 dias</option>
          </select>
        </Field>

        <Field label="Condições adicionais">
          <textarea
            value={form.condicoes}
            onChange={(e) => update("condicoes", e.target.value)}
            rows={2}
            placeholder="Garantias, exclusões, forma de pagamento preferida..."
            className={inputCls + " resize-none"}
          />
        </Field>

        {/* Conekta Lock toggle */}
        <div className="rounded-xl border border-purple/20 bg-purple/5 p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={form.usar_conekta_lock}
                onChange={(e) => update("usar_conekta_lock", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-gray-200 peer-checked:bg-purple rounded-full transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-purple" />
                <p className="text-sm font-bold text-gray-900">
                  Usar Conekta Lock
                </p>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                O valor fica em custódia até você confirmar a conclusão do
                serviço. Aumenta a confiança do posto e reduz o risco de
                inadimplência.
              </p>
            </div>
          </label>
        </div>

        {/* Taxa informativa */}
        {form.usar_conekta_lock && form.valor && (
          <TaxaInfo valor={form.valor} />
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <Link
            href={`/parceiro/leads/detalhe?id=${leadId}`}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 border border-gray-200"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple hover:bg-purple-medium text-white font-semibold text-sm shadow-lg shadow-purple/20 transition-colors"
          >
            <Send className="w-4 h-4" />
            Enviar proposta
          </button>
        </div>
      </form>
    </div>
  );
}

function TaxaInfo({ valor }: { valor: string }) {
  const valorNum = parseFloat(valor.replace(",", "."));
  if (isNaN(valorNum) || valorNum <= 0) return null;
  const taxa = valorNum * 0.03;
  const liquido = valorNum - taxa;
  return (
    <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
      <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
      <p>
        Taxa Conekta (3%):{" "}
        <strong>
          R${" "}
          {taxa.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </strong>
        {" · "}Valor líquido:{" "}
        <strong>
          R${" "}
          {liquido.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </strong>
      </p>
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

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none bg-white focus:border-purple focus:ring-2 focus:ring-purple/10 transition-all";

function Skeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl animate-pulse space-y-6">
      <div className="h-4 w-24 bg-gray-100 rounded" />
      <div className="h-8 w-48 bg-gray-100 rounded" />
      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 bg-gray-100 rounded" />
            <div className="h-10 bg-gray-50 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
