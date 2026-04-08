"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  useUploadDocumento,
  useRemoverDocumento,
  type DocumentoTipo,
  type FornecedorDocumento,
} from "@/lib/data/onboarding";

interface Props {
  tipo: DocumentoTipo;
  label: string;
  descricao: string;
  obrigatorio?: boolean;
  fornecedorId: string;
  documento: FornecedorDocumento | null;
}

const ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";
const MAX_SIZE_MB = 10;

function formatBytes(bytes: number | null | undefined) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export function DocumentoUploadItem({
  tipo,
  label,
  descricao,
  obrigatorio,
  fornecedorId,
  documento,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const upload = useUploadDocumento(fornecedorId);
  const remover = useRemoverDocumento(fornecedorId);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Arquivo maior que ${MAX_SIZE_MB} MB.`);
      return;
    }
    try {
      await upload.mutateAsync({ tipo, file });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha no upload.");
    }
  }

  async function handleRemove() {
    if (!documento) return;
    setError(null);
    try {
      await remover.mutateAsync(documento);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao remover.");
    }
  }

  const isUploading = upload.isPending;
  const isRemoving = remover.isPending;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-purple" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-gray-900">{label}</h3>
              {obrigatorio && (
                <span className="text-[10px] font-semibold text-purple bg-purple/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Obrigatório
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{descricao}</p>
          </div>
        </div>
        <StatusBadge doc={documento} />
      </div>

      {documento && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {documento.nome_arquivo}
            </p>
            <p className="text-[11px] text-gray-500">
              {formatBytes(documento.tamanho_bytes)}
            </p>
          </div>
          {documento.status === "pendente" && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {isRemoving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              Remover
            </button>
          )}
        </div>
      )}

      {documento?.status === "recusado" && documento.motivo_recusa && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
          <p className="text-xs text-red-700">
            <strong>Motivo da recusa:</strong> {documento.motivo_recusa}
          </p>
        </div>
      )}

      {(!documento || documento.status === "recusado") && (
        <div className="mt-4">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-purple/30 bg-purple/5 text-sm font-semibold text-purple hover:bg-purple/10 transition-colors disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {documento ? "Reenviar arquivo" : "Selecionar arquivo"}
              </>
            )}
          </button>
          <p className="text-[11px] text-gray-400 mt-2 text-center">
            PDF, JPG ou PNG · máx {MAX_SIZE_MB} MB
          </p>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

function StatusBadge({ doc }: { doc: FornecedorDocumento | null }) {
  if (!doc) {
    return (
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
        Pendente
      </span>
    );
  }
  if (doc.status === "aprovado") {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
        <CheckCircle2 className="w-4 h-4" />
        Aprovado
      </span>
    );
  }
  if (doc.status === "recusado") {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
        <XCircle className="w-4 h-4" />
        Recusado
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
      <Clock className="w-4 h-4" />
      Em análise
    </span>
  );
}
