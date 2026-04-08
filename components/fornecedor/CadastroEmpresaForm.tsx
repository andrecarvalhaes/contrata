"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, ArrowRight, Loader2 } from "lucide-react";
import { useCriarFornecedor } from "@/lib/data/onboarding";

const UFS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
] as const;

function formatCNPJ(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12)
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const schema = z.object({
  razao_social: z.string().min(3, "Razão social obrigatória"),
  nome_fantasia: z.string().optional(),
  cnpj: z.string().min(18, "CNPJ inválido"),
  telefone: z.string().min(14, "Telefone inválido"),
  whatsapp: z.string().optional(),
  cidade: z.string().min(2, "Cidade obrigatória"),
  estado: z.string().length(2, "UF inválida"),
  descricao: z
    .string()
    .min(20, "Descreva seus serviços em pelo menos 20 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function CadastroEmpresaForm() {
  const criar = useCriarFornecedor();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      await criar.mutateAsync(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao salvar.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-purple/20 bg-white p-6 sm:p-8 shadow-sm">
        <header className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-purple" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-display">
              Dados da sua empresa
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Preencha as informações básicas para começar. Você poderá enviar
              documentos e ajustar detalhes na próxima etapa.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field label="Razão social" error={errors.razao_social?.message}>
            <input
              {...register("razao_social")}
              placeholder="EMPRESA EXEMPLO LTDA"
              className={inputCls(!!errors.razao_social)}
            />
          </Field>

          <Field
            label="Nome fantasia"
            optional
            error={errors.nome_fantasia?.message}
          >
            <input
              {...register("nome_fantasia")}
              placeholder="Como seus clientes conhecem"
              className={inputCls(!!errors.nome_fantasia)}
            />
          </Field>

          <Field label="CNPJ" error={errors.cnpj?.message}>
            <input
              {...register("cnpj", {
                onChange: (e) =>
                  setValue("cnpj", formatCNPJ(e.target.value), {
                    shouldValidate: true,
                  }),
              })}
              placeholder="00.000.000/0000-00"
              className={inputCls(!!errors.cnpj)}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Telefone comercial" error={errors.telefone?.message}>
              <input
                {...register("telefone", {
                  onChange: (e) =>
                    setValue("telefone", formatPhone(e.target.value), {
                      shouldValidate: true,
                    }),
                })}
                placeholder="(11) 99999-9999"
                className={inputCls(!!errors.telefone)}
              />
            </Field>
            <Field label="WhatsApp" optional error={errors.whatsapp?.message}>
              <input
                {...register("whatsapp", {
                  onChange: (e) =>
                    setValue("whatsapp", formatPhone(e.target.value)),
                })}
                placeholder="(11) 99999-9999"
                className={inputCls(!!errors.whatsapp)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-4">
            <Field label="Cidade" error={errors.cidade?.message}>
              <input
                {...register("cidade")}
                placeholder="São Paulo"
                className={inputCls(!!errors.cidade)}
              />
            </Field>
            <Field label="UF" error={errors.estado?.message}>
              <select
                {...register("estado")}
                defaultValue=""
                className={inputCls(!!errors.estado)}
              >
                <option value="" disabled>
                  —
                </option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Descrição dos serviços"
            error={errors.descricao?.message}
          >
            <textarea
              {...register("descricao")}
              rows={4}
              placeholder="Descreva os serviços que sua empresa oferece, experiência, equipamentos, diferenciais..."
              className={`${inputCls(!!errors.descricao)} resize-none`}
            />
          </Field>

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={criar.isPending}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 mt-2 rounded-xl bg-purple hover:bg-purple-medium text-white font-semibold text-sm transition-colors shadow-lg shadow-purple/20 disabled:opacity-60"
          >
            {criar.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                Continuar para envio de documentos
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900">
        {label}
        {optional && (
          <span className="text-gray-400 font-normal"> (opcional)</span>
        )}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-all bg-white ${
    hasError
      ? "border-red-400 bg-red-50"
      : "border-gray-200 focus:border-purple focus:ring-2 focus:ring-purple/10"
  }`;
}
