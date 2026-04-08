"use client";

import { useState, useMemo } from "react";
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Mail,
} from "lucide-react";
import {
  useMyFornecedor,
  useMeusDocumentos,
  useSubmeterOnboarding,
  DOCUMENTOS_OBRIGATORIOS,
  DOCUMENTOS_OPCIONAIS,
  type FornecedorDocumento,
  type DocumentoTipo,
} from "@/lib/data/onboarding";
import { DocumentoUploadItem } from "@/components/fornecedor/DocumentoUploadItem";
import { CadastroEmpresaForm } from "@/components/fornecedor/CadastroEmpresaForm";

export default function OnboardingPage() {
  const { data, isLoading } = useMyFornecedor();

  if (isLoading || !data) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (data.status === "sem_cadastro" || !data.fornecedor) {
    return <CadastroEmpresaForm />;
  }

  if (data.status === "em_analise") {
    return <EmAnaliseView />;
  }

  return (
    <EnvioDocumentosView
      fornecedorId={data.fornecedor.id}
      motivoRecusa={data.fornecedor.motivo_recusa}
      recusado={data.status === "recusado"}
    />
  );
}

// ─── Estado: em análise ──────────────────────────────────────────────────────

function EmAnaliseView() {
  const { data } = useMyFornecedor();
  const submetidoEm = data?.fornecedor?.submetido_em;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-amber-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold uppercase tracking-wide">
              <Clock className="w-3 h-3" />
              Em análise
            </div>
            <h1 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 font-display">
              Seu cadastro está sob análise
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Nossa equipe está revisando os documentos enviados. Assim que
              tudo estiver validado, você receberá a confirmação por e-mail e
              poderá acessar todas as seções da sua área de parceiro.
            </p>
            {submetidoEm && (
              <p className="mt-3 text-xs text-gray-500">
                Enviado para análise em{" "}
                <time dateTime={submetidoEm}>
                  {new Date(submetidoEm).toLocaleString("pt-BR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </time>
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 p-4 flex items-start gap-3">
          <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-600">
            O tempo médio de análise é de <strong>1 a 2 dias úteis</strong>. Se
            precisar falar com a gente, escreva para{" "}
            <a
              href="mailto:parceiros@conekta.com.br"
              className="text-purple font-semibold hover:underline"
            >
              parceiros@conekta.com.br
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Estado: envio de documentos (rascunho ou recusado) ─────────────────────

function EnvioDocumentosView({
  fornecedorId,
  recusado,
  motivoRecusa,
}: {
  fornecedorId: string;
  recusado: boolean;
  motivoRecusa: string | null;
}) {
  const { data: docs = [] } = useMeusDocumentos(fornecedorId);
  const submeter = useSubmeterOnboarding(fornecedorId);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Mapa tipo → documento mais recente
  const docsByTipo = useMemo(() => {
    const map = new Map<DocumentoTipo, FornecedorDocumento>();
    for (const doc of docs) {
      const existing = map.get(doc.tipo);
      if (!existing || doc.created_at > existing.created_at) {
        map.set(doc.tipo, doc);
      }
    }
    return map;
  }, [docs]);

  const obrigatoriosEnviados = DOCUMENTOS_OBRIGATORIOS.every((d) => {
    const doc = docsByTipo.get(d.tipo);
    return doc && doc.status !== "recusado";
  });

  async function handleSubmit() {
    setSubmitError(null);
    try {
      await submeter.mutateAsync();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Falha ao enviar.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Header */}
      <header>
        <div className="inline-flex items-center gap-2 text-purple">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Verificação do parceiro
          </span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 font-display">
          Envie seus documentos
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Para liberar sua área, precisamos validar a documentação da sua
          empresa. Anexe os arquivos abaixo e envie para análise.
        </p>
      </header>

      {/* Recusado */}
      {recusado && motivoRecusa && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-red-700">
                Cadastro recusado
              </h2>
              <p className="mt-1 text-xs text-red-700">{motivoRecusa}</p>
              <p className="mt-2 text-xs text-red-600">
                Corrija os pontos indicados e reenvie os documentos abaixo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Obrigatórios */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Documentos obrigatórios
        </h2>
        <div className="flex flex-col gap-3">
          {DOCUMENTOS_OBRIGATORIOS.map((d) => (
            <DocumentoUploadItem
              key={d.tipo}
              tipo={d.tipo}
              label={d.label}
              descricao={d.descricao}
              obrigatorio
              fornecedorId={fornecedorId}
              documento={docsByTipo.get(d.tipo) ?? null}
            />
          ))}
        </div>
      </section>

      {/* Opcionais */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Documentos complementares (opcional)
        </h2>
        <div className="flex flex-col gap-3">
          {DOCUMENTOS_OPCIONAIS.map((d) => (
            <DocumentoUploadItem
              key={d.tipo}
              tipo={d.tipo}
              label={d.label}
              descricao={d.descricao}
              fornecedorId={fornecedorId}
              documento={docsByTipo.get(d.tipo) ?? null}
            />
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="rounded-2xl border border-purple/20 bg-gradient-to-br from-purple/5 to-purple-light/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              obrigatoriosEnviados ? "text-green-500" : "text-gray-300"
            }`}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {obrigatoriosEnviados
                ? "Tudo pronto para enviar"
                : "Envie todos os documentos obrigatórios"}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Após o envio, o cadastro entra em análise e não poderá ser
              editado até a resposta da nossa equipe.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!obrigatoriosEnviados || submeter.isPending}
          className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple hover:bg-purple-medium text-white font-semibold text-sm transition-colors shadow-lg shadow-purple/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submeter.isPending ? "Enviando..." : "Enviar para análise"}
          {!submeter.isPending && <ArrowRight className="w-4 h-4" />}
        </button>
        {submitError && (
          <p className="mt-2 text-xs text-red-600 text-center">{submitError}</p>
        )}
      </div>
    </div>
  );
}
