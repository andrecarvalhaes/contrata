"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Wrench,
  MapPin,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import StepIndicator from "@/components/auth/StepIndicator";
import CNPJInput, { CNPJData } from "@/components/auth/CNPJInput";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const step1Schema = z
  .object({
    cnpj: z.string().min(18, "CNPJ inválido"),
    razao_social: z.string().min(3, "Razão Social obrigatória"),
    nome_fantasia: z.string().optional(),
    logradouro: z.string().min(3, "Endereço obrigatório"),
    numero: z.string().min(1, "Número obrigatório"),
    bairro: z.string().min(2, "Bairro obrigatório"),
    municipio: z.string().min(2, "Cidade obrigatória"),
    uf: z.string().length(2, "UF inválida"),
    cep: z.string().min(8, "CEP inválido"),
    telefone: z.string().min(10, "Telefone inválido").max(15),
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    confirmarSenha: z.string().min(1, "Confirmação obrigatória"),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

const step2Schema = z.object({
  categorias: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma categoria"),
  descricao: z
    .string()
    .min(20, "Descreva seus serviços em pelo menos 20 caracteres"),
  raio: z.string().min(1, "Selecione o raio de atendimento"),
  aceitar_termos: z
    .boolean()
    .refine((v) => v === true, "Você precisa aceitar os termos"),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;

// ─── Categorias ───────────────────────────────────────────────────────────────

const CATEGORIAS = [
  { id: "bombas", label: "Bombas de combustível" },
  { id: "eletrica", label: "Elétrica automotiva" },
  { id: "hidraulica", label: "Hidráulica" },
  { id: "calibradores", label: "Calibradores e medidores" },
  { id: "filtragem", label: "Sistemas de filtragem" },
  { id: "seguranca", label: "Segurança (extintores, câmeras)" },
  { id: "civil", label: "Manutenção civil" },
  { id: "outros", label: "Outros" },
];

const RAIOS = [
  { value: "50km", label: "Até 50 km" },
  { value: "100km", label: "Até 100 km" },
  { value: "200km", label: "Até 200 km" },
  { value: "estado", label: "Estado inteiro" },
  { value: "nacional", label: "Nacional" },
];

const STEPS = ["Dados da empresa", "Perfil de serviços"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCEP(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CadastroFornecedor() {
  const [step, setStep] = useState(0);
  const [step1Data, setStep1Data] = useState<Step1 | null>(null);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Step 1 form ──
  const {
    register: r1,
    handleSubmit: hs1,
    setValue: sv1,
    control: c1,
    watch: w1,
    formState: { errors: e1 },
  } = useForm<Step1>({ resolver: zodResolver(step1Schema) });

  // ── Step 2 form ──
  const {
    register: r2,
    handleSubmit: hs2,
    watch: w2,
    setValue: sv2,
    formState: { errors: e2 },
  } = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    defaultValues: { categorias: [], aceitar_termos: false },
  });

  const cnpjValue = w1("cnpj") ?? "";
  const categoriasValue = w2("categorias") ?? [];

  // ── CNPJ auto-fill ──
  function handleCNPJData(data: CNPJData) {
    sv1("razao_social", data.razao_social);
    sv1("nome_fantasia", data.nome_fantasia ?? "");
    sv1("logradouro", data.logradouro);
    sv1("numero", data.numero);
    sv1("bairro", data.bairro);
    sv1("municipio", data.municipio);
    sv1("uf", data.uf);
    sv1("cep", data.cep);
  }

  // ── Category toggle ──
  function toggleCategoria(id: string) {
    const current = categoriasValue;
    const next = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id];
    sv2("categorias", next);
  }

  // ── Submit step 1 ──
  function onStep1(data: Step1) {
    setStep1Data(data);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Submit final ──
  async function onStep2(data: Step2) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
  }

  // ── Success screen ──
  if (success) {
    return (
      <div className="w-full max-w-md text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A2E] mb-3">
          Cadastro enviado! 🎉
        </h2>
        <p className="text-gray-500 mb-2">
          Recebemos os dados da sua empresa. Nossa equipe irá analisar o cadastro
          e você receberá uma confirmação por e-mail em breve.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          {step1Data?.email}
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-3 rounded-xl bg-[#E05C1A] text-white font-semibold text-center hover:bg-[#c54d15] transition-colors"
        >
          Ir para o Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#E05C1A]/10 flex items-center justify-center mx-auto mb-3">
            <Wrench className="w-6 h-6 text-[#E05C1A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">
            Cadastro de Fornecedor
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Comece a receber demandas qualificadas
          </p>
        </div>

        <StepIndicator steps={STEPS} currentStep={step} />

        {/* ── STEP 1 ── */}
        {step === 0 && (
          <form onSubmit={hs1(onStep1)} className="mt-6 flex flex-col gap-5">
            {/* CNPJ */}
            <Controller
              name="cnpj"
              control={c1}
              defaultValue=""
              render={({ field }) => (
                <CNPJInput
                  value={field.value}
                  onChange={field.onChange}
                  onDataLoaded={handleCNPJData}
                  error={e1.cnpj?.message}
                />
              )}
            />

            {/* Razão Social */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">
                Razão Social
              </label>
              <input
                {...r1("razao_social")}
                placeholder="EMPRESA EXEMPLO LTDA"
                className={inputCls(!!e1.razao_social)}
              />
              {e1.razao_social && <ErrMsg msg={e1.razao_social.message} />}
            </div>

            {/* Nome Fantasia */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">
                Nome Fantasia{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                {...r1("nome_fantasia")}
                placeholder="Como é conhecido"
                className={inputCls(false)}
              />
            </div>

            {/* Endereço */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E05C1A]" />
                Endereço
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 flex flex-col gap-1">
                  <input
                    {...r1("logradouro")}
                    placeholder="Logradouro"
                    className={inputCls(!!e1.logradouro)}
                  />
                  {e1.logradouro && <ErrMsg msg={e1.logradouro.message} />}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    {...r1("numero")}
                    placeholder="Nº"
                    className={inputCls(!!e1.numero)}
                  />
                  {e1.numero && <ErrMsg msg={e1.numero.message} />}
                </div>
              </div>
              <input
                {...r1("bairro")}
                placeholder="Bairro"
                className={inputCls(!!e1.bairro)}
              />
              {e1.bairro && <ErrMsg msg={e1.bairro.message} />}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 flex flex-col gap-1">
                  <input
                    {...r1("municipio")}
                    placeholder="Cidade"
                    className={inputCls(!!e1.municipio)}
                  />
                  {e1.municipio && <ErrMsg msg={e1.municipio.message} />}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    {...r1("uf")}
                    placeholder="UF"
                    maxLength={2}
                    className={inputCls(!!e1.uf)}
                  />
                  {e1.uf && <ErrMsg msg={e1.uf.message} />}
                </div>
              </div>
              <Controller
                name="cep"
                control={c1}
                defaultValue=""
                render={({ field }) => (
                  <input
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(formatCEP(e.target.value))
                    }
                    placeholder="CEP"
                    className={inputCls(!!e1.cep)}
                  />
                )}
              />
              {e1.cep && <ErrMsg msg={e1.cep.message} />}
            </div>

            {/* Telefone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#E05C1A]" />
                Telefone Comercial
              </label>
              <Controller
                name="telefone"
                control={c1}
                defaultValue=""
                render={({ field }) => (
                  <input
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(formatPhone(e.target.value))
                    }
                    placeholder="(11) 99999-9999"
                    className={inputCls(!!e1.telefone)}
                  />
                )}
              />
              {e1.telefone && <ErrMsg msg={e1.telefone.message} />}
            </div>

            {/* E-mail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E] flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#E05C1A]" />
                E-mail comercial
              </label>
              <input
                {...r1("email")}
                type="email"
                placeholder="contato@suaempresa.com.br"
                className={inputCls(!!e1.email)}
              />
              {e1.email && <ErrMsg msg={e1.email.message} />}
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">Senha</label>
              <div className="relative">
                <input
                  {...r1("senha")}
                  type={showSenha ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className={inputCls(!!e1.senha) + " pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showSenha ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {e1.senha && <ErrMsg msg={e1.senha.message} />}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  {...r1("confirmarSenha")}
                  type={showConfirmar ? "text" : "password"}
                  placeholder="Repita a senha"
                  className={inputCls(!!e1.confirmarSenha) + " pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmar((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmar ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {e1.confirmarSenha && (
                <ErrMsg msg={e1.confirmarSenha.message} />
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#E05C1A] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#c54d15] transition-colors mt-2"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ── STEP 2 ── */}
        {step === 1 && (
          <form onSubmit={hs2(onStep2)} className="mt-6 flex flex-col gap-6">
            {/* Categorias */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1A1A2E] flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-[#E05C1A]" />
                Categorias de serviço
                <span className="text-xs text-gray-400 font-normal ml-1">
                  (selecione todos que se aplicam)
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIAS.map((cat) => {
                  const selected = categoriasValue.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategoria(cat.id)}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                        selected
                          ? "border-[#E05C1A] bg-[#E05C1A]/5 text-[#E05C1A]"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                            selected
                              ? "bg-[#E05C1A] border-[#E05C1A]"
                              : "border-gray-300"
                          }`}
                        >
                          {selected && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              viewBox="0 0 10 10"
                              fill="none"
                            >
                              <path
                                d="M1.5 5L4 7.5L8.5 2.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {e2.categorias && <ErrMsg msg={e2.categorias.message} />}
            </div>

            {/* Descrição */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E] flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#E05C1A]" />
                Descrição dos serviços
              </label>
              <textarea
                {...r2("descricao")}
                rows={4}
                placeholder="Descreva os serviços que sua empresa oferece, experiência, equipamentos, diferenciais..."
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1A1A2E] placeholder-gray-400 outline-none transition-all resize-none ${
                  e2.descricao
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-[#E05C1A] bg-white"
                }`}
              />
              {e2.descricao && <ErrMsg msg={e2.descricao.message} />}
            </div>

            {/* Raio de atendimento */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E05C1A]" />
                Raio de atendimento
              </label>
              <select
                {...r2("raio")}
                defaultValue=""
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1A1A2E] outline-none transition-all bg-white ${
                  e2.raio
                    ? "border-red-400"
                    : "border-gray-200 focus:border-[#E05C1A]"
                }`}
              >
                <option value="" disabled>
                  Selecione o raio de atendimento
                </option>
                {RAIOS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              {e2.raio && <ErrMsg msg={e2.raio.message} />}
            </div>

            {/* Termos */}
            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...r2("aceitar_termos")}
                  className="mt-0.5 w-4 h-4 accent-[#E05C1A] cursor-pointer"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  Li e aceito os{" "}
                  <Link
                    href="#"
                    className="text-[#E05C1A] font-medium underline-offset-2 hover:underline"
                  >
                    Termos de Uso
                  </Link>{" "}
                  e a{" "}
                  <Link
                    href="#"
                    className="text-[#E05C1A] font-medium underline-offset-2 hover:underline"
                  >
                    Política de Privacidade
                  </Link>
                </span>
              </label>
              {e2.aceitar_termos && (
                <ErrMsg msg={e2.aceitar_termos.message} />
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-[#E05C1A] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#c54d15] transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Criando conta...
                  </>
                ) : (
                  <>
                    Criar conta de fornecedor
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="text-[#E05C1A] font-semibold hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return `w-full px-4 py-3 rounded-xl border text-sm text-[#1A1A2E] placeholder-gray-400 outline-none transition-all duration-150 ${
    hasError
      ? "border-red-400 focus:border-red-400 bg-red-50"
      : "border-gray-200 focus:border-[#E05C1A] bg-white"
  }`;
}

function ErrMsg({ msg }: { msg?: string }) {
  return <p className="text-xs text-red-500">{msg}</p>;
}
