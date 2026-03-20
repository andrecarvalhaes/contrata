"use client";

import { useState, useCallback } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export interface CNPJData {
  razao_social: string;
  nome_fantasia: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
}

interface CNPJInputProps {
  value: string;
  onChange: (value: string) => void;
  onDataLoaded?: (data: CNPJData) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

// Mock CNPJ lookup
const mockCNPJLookup = async (cnpj: string): Promise<CNPJData> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    razao_social: "POSTO EXEMPLO LTDA",
    nome_fantasia: "Posto Exemplo",
    logradouro: "Rua das Flores",
    numero: "100",
    bairro: "Centro",
    municipio: "São Paulo",
    uf: "SP",
    cep: "01310-100",
  };
};

function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export default function CNPJInput({
  value,
  onChange,
  onDataLoaded,
  error,
  label = "CNPJ",
  placeholder = "00.000.000/0000-00",
}: CNPJInputProps) {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCNPJ(e.target.value);
      onChange(formatted);
      setLoaded(false);
      setLookupError(null);

      const digits = formatted.replace(/\D/g, "");
      if (digits.length === 14) {
        setLoading(true);
        try {
          const data = await mockCNPJLookup(digits);
          onDataLoaded?.(data);
          setLoaded(true);
        } catch {
          setLookupError("Não foi possível buscar os dados do CNPJ.");
        } finally {
          setLoading(false);
        }
      }
    },
    [onChange, onDataLoaded]
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#1A1A2E]">{label}</label>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={18}
          className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm text-[#1A1A2E] placeholder-gray-400 outline-none transition-all duration-150 ${
            error || lookupError
              ? "border-red-400 focus:border-red-400 bg-red-50"
              : loaded
              ? "border-green-400 focus:border-green-400 bg-green-50"
              : "border-gray-200 focus:border-[#E05C1A] bg-white"
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading && (
            <Loader2 className="w-4 h-4 text-[#E05C1A] animate-spin" />
          )}
          {!loading && loaded && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
          {!loading && (error || lookupError) && (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
        </div>
      </div>
      {(error || lookupError) && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          {error || lookupError}
        </p>
      )}
      {loaded && !error && (
        <p className="text-xs text-green-600">✓ Dados carregados com sucesso</p>
      )}
    </div>
  );
}
