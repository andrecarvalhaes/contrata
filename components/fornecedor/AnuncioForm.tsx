"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Save, Sparkles } from "lucide-react";
import { useCategorias } from "@/lib/data/queries";
import {
  useAnuncio,
  useAtualizarAnuncio,
  useCriarAnuncio,
  MODALIDADE_LABEL,
  type PrecoModalidade,
} from "@/lib/data/anuncios";
import { supabase } from "@/lib/supabase/client";

interface Servico {
  id: string;
  nome: string;
}

const schema = z
  .object({
    categoria_id: z.string().uuid("Selecione uma categoria"),
    servico_id: z.string().optional(),
    titulo: z.string().min(6, "Título muito curto").max(120, "Máximo 120 caracteres"),
    resumo: z.string().max(160, "Máximo 160 caracteres").optional(),
    descricao: z.string().min(30, "Descreva em pelo menos 30 caracteres"),
    preco_modalidade: z.enum(["fixo", "a_partir_de", "sob_consulta"]),
    preco_reais: z.string().optional(),
    unidade_preco: z.string().optional(),
    cidades_atendidas: z.string().optional(),
    raio_atendimento_km: z.string().optional(),
  })
  .refine(
    (d) =>
      d.preco_modalidade === "sob_consulta" ||
      (d.preco_reais && Number(d.preco_reais.replace(",", ".")) > 0),
    { message: "Informe o preço", path: ["preco_reais"] }
  );

type FormData = z.infer<typeof schema>;

interface Props {
  anuncioId?: string;
}

export function AnuncioForm({ anuncioId }: Props) {
  const router = useRouter();
  const isEdit = !!anuncioId;

  const { data: categorias = [], isLoading: loadingCats } = useCategorias();
  const { data: anuncio, isLoading: loadingAnuncio } = useAnuncio(anuncioId ?? null);
  const criar = useCriarAnuncio();
  const atualizar = useAtualizarAnuncio();
  const [error, setError] = useState<string | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      preco_modalidade: "sob_consulta",
    },
  });

  const categoriaId = watch("categoria_id");
  const modalidade = watch("preco_modalidade");

  // Popula o form quando o anúncio carrega (edição)
  useEffect(() => {
    if (!isEdit || !anuncio) return;
    reset({
      categoria_id: anuncio.categoria_id,
      servico_id: anuncio.servico_id ?? undefined,
      titulo: anuncio.titulo,
      resumo: anuncio.resumo ?? "",
      descricao: anuncio.descricao,
      preco_modalidade: anuncio.preco_modalidade,
      preco_reais: anuncio.preco_centavos
        ? (anuncio.preco_centavos / 100).toFixed(2).replace(".", ",")
        : "",
      unidade_preco: anuncio.unidade_preco ?? "",
      cidades_atendidas: (anuncio.cidades_atendidas ?? []).join(", "),
      raio_atendimento_km: anuncio.raio_atendimento_km
        ? String(anuncio.raio_atendimento_km)
        : "",
    });
  }, [isEdit, anuncio, reset]);

  // Carrega os serviços da categoria escolhida
  useEffect(() => {
    if (!categoriaId) {
      setServicos([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("servicos")
        .select("id, nome")
        .eq("categoria_id", categoriaId)
        .eq("ativo", true)
        .order("nome");
      if (!cancelled) setServicos(data ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [categoriaId]);

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const preco_centavos =
        data.preco_modalidade === "sob_consulta"
          ? null
          : Math.round(Number(data.preco_reais!.replace(",", ".")) * 100);

      const cidades = data.cidades_atendidas
        ? data.cidades_atendidas
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : null;

      const raio = data.raio_atendimento_km
        ? parseInt(data.raio_atendimento_km, 10)
        : null;

      const payload = {
        categoria_id: data.categoria_id,
        servico_id: data.servico_id || null,
        titulo: data.titulo,
        resumo: data.resumo || null,
        descricao: data.descricao,
        preco_modalidade: data.preco_modalidade as PrecoModalidade,
        preco_centavos,
        unidade_preco: data.unidade_preco || null,
        cidades_atendidas: cidades,
        raio_atendimento_km: raio,
      };

      if (isEdit) {
        await atualizar.mutateAsync({ id: anuncioId!, ...payload });
      } else {
        await criar.mutateAsync(payload);
      }
      router.push("/parceiro/anuncios");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao salvar.");
    }
  }

  if (isEdit && loadingAnuncio) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple animate-spin" />
      </div>
    );
  }

  const saving = criar.isPending || atualizar.isPending;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/parceiro/anuncios"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-purple transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para anúncios
          </Link>
          <div className="mt-2 inline-flex items-center gap-2 text-purple">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {isEdit ? "Editar anúncio" : "Novo anúncio"}
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 font-display">
            {isEdit ? anuncio?.titulo || "Editar anúncio" : "Crie um anúncio"}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Descreva o serviço que você oferece e como os postos podem
            contratar.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-purple/20 bg-white p-6 sm:p-8 shadow-sm flex flex-col gap-5"
      >
        {/* Categoria */}
        <Field label="Categoria" error={errors.categoria_id?.message}>
          <select
            {...register("categoria_id")}
            disabled={loadingCats}
            className={inputCls(!!errors.categoria_id)}
            defaultValue=""
          >
            <option value="" disabled>
              {loadingCats ? "Carregando..." : "Selecione uma categoria"}
            </option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </Field>

        {/* Serviço específico (opcional) */}
        {servicos.length > 0 && (
          <Field
            label="Serviço específico"
            optional
            error={errors.servico_id?.message}
          >
            <select
              {...register("servico_id")}
              className={inputCls(false)}
              defaultValue=""
            >
              <option value="">Todos da categoria</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Título do anúncio" error={errors.titulo?.message}>
          <input
            {...register("titulo")}
            placeholder="Ex: Manutenção preventiva de bombas de combustível"
            className={inputCls(!!errors.titulo)}
          />
        </Field>

        <Field label="Resumo" optional error={errors.resumo?.message}>
          <input
            {...register("resumo")}
            placeholder="Uma frase curta que aparece no card da lista"
            className={inputCls(!!errors.resumo)}
          />
        </Field>

        <Field
          label="Descrição completa"
          error={errors.descricao?.message}
          hint="Detalhe o escopo, o que está incluso, tempo de execução e diferenciais."
        >
          <textarea
            {...register("descricao")}
            rows={6}
            className={`${inputCls(!!errors.descricao)} resize-none`}
            placeholder="Descreva em detalhes o serviço oferecido..."
          />
        </Field>

        {/* Preço */}
        <div className="rounded-xl bg-purple/5 p-4 space-y-4">
          <Field
            label="Modalidade de preço"
            error={errors.preco_modalidade?.message}
          >
            <Controller
              name="preco_modalidade"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(["fixo", "a_partir_de", "sob_consulta"] as const).map((m) => {
                    const active = field.value === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => field.onChange(m)}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                          active
                            ? "border-purple bg-purple text-white shadow-lg shadow-purple/20"
                            : "border-gray-200 bg-white text-gray-600 hover:border-purple/30"
                        }`}
                      >
                        {MODALIDADE_LABEL[m]}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </Field>

          {modalidade !== "sob_consulta" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Valor (R$)" error={errors.preco_reais?.message}>
                <input
                  {...register("preco_reais")}
                  placeholder="0,00"
                  inputMode="decimal"
                  className={inputCls(!!errors.preco_reais)}
                />
              </Field>
              <Field label="Unidade" optional>
                <input
                  {...register("unidade_preco")}
                  placeholder="por visita, por hora, por treinamento..."
                  className={inputCls(false)}
                />
              </Field>
            </div>
          )}
        </div>

        {/* Atendimento */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
          <Field
            label="Cidades atendidas"
            optional
            hint="Separe por vírgulas"
          >
            <input
              {...register("cidades_atendidas")}
              placeholder="São Paulo, Guarulhos, Santo André"
              className={inputCls(false)}
            />
          </Field>
          <Field label="Raio (km)" optional>
            <input
              {...register("raio_atendimento_km")}
              placeholder="100"
              inputMode="numeric"
              className={inputCls(false)}
            />
          </Field>
        </div>

        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <Link
            href="/parceiro/anuncios"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple hover:bg-purple-medium text-white text-sm font-semibold transition-colors shadow-lg shadow-purple/20 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? "Salvar alterações" : "Salvar rascunho"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  optional,
  error,
  hint,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
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
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
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
