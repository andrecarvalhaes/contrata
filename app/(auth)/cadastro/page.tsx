"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Plus, Trash2, CheckCircle2, ArrowLeft, ArrowRight, Store } from "lucide-react";
import StepIndicator from "@/components/auth/StepIndicator";
import CNPJInput, { CNPJData } from "@/components/auth/CNPJInput";
import GoogleButton from "@/components/auth/GoogleButton";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { signUp, signInWithGoogle } from "@/lib/supabase/auth";
import { supabase } from "@/lib/supabase/client";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const step1Schema = z
  .object({
    nome: z.string().min(3, "Nome completo obrigatório"),
    email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
    senha: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    confirmarSenha: z.string().min(1, "Confirmação obrigatória"),
    telefone: z
      .string()
      .min(10, "Telefone inválido")
      .max(15, "Telefone inválido"),
    tipoConta: z.enum(["cliente", "revendedor", "consultor"]),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type Step1Data = z.infer<typeof step1Schema>;

const lojaSchema = z.object({
  cnpj: z.string().length(18, "CNPJ inválido"),
  razao_social: z.string().min(1, "Razão social obrigatória"),
  nome_fantasia: z.string().min(1, "Nome fantasia obrigatório"),
  logradouro: z.string().min(1, "Endereço obrigatório"),
  numero: z.string().min(1, "Número obrigatório"),
  bairro: z.string().min(1, "Bairro obrigatório"),
  municipio: z.string().min(1, "Município obrigatório"),
  uf: z.string().min(2, "UF obrigatória"),
  cep: z.string().min(9, "CEP obrigatório"),
});

type LojaData = z.infer<typeof lojaSchema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTelefone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const STEPS = ["Dados pessoais", "Suas lojas", "Revisão"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CadastroPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [lojas, setLojas] = useState<LojaData[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [authLoading, isAuthenticated, router]);

  // Current CNPJ form state (step 2)
  const [cnpjValue, setCnpjValue] = useState("");
  const [cnpjData, setCnpjData] = useState<CNPJData | null>(null);
  const [lojaEditData, setLojaEditData] = useState<Partial<LojaData>>({});
  const [lojaError, setLojaError] = useState<string | null>(null);
  const [addingLoja, setAddingLoja] = useState(true);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { tipoConta: "cliente" },
  });

  // ── Step 1 Submit ──────────────────────────────────────────────────────────

  const handleStep1 = step1Form.handleSubmit((data) => {
    setStep1Data(data);
    setCurrentStep(1);
  });

  // ── CNPJ Data Loaded ───────────────────────────────────────────────────────

  const handleCNPJLoaded = (data: CNPJData) => {
    setCnpjData(data);
    setLojaEditData({
      cnpj: cnpjValue,
      ...data,
    });
  };

  // ── Save Loja ──────────────────────────────────────────────────────────────

  const handleSaveLoja = () => {
    const digits = cnpjValue.replace(/\D/g, "");
    if (digits.length !== 14) {
      setLojaError("Insira um CNPJ completo válido");
      return;
    }
    if (!lojaEditData.razao_social || !lojaEditData.logradouro) {
      setLojaError("Preencha todos os campos da loja");
      return;
    }
    const novaLoja: LojaData = {
      cnpj: cnpjValue,
      razao_social: lojaEditData.razao_social || "",
      nome_fantasia: lojaEditData.nome_fantasia || "",
      logradouro: lojaEditData.logradouro || "",
      numero: lojaEditData.numero || "",
      bairro: lojaEditData.bairro || "",
      municipio: lojaEditData.municipio || "",
      uf: lojaEditData.uf || "",
      cep: lojaEditData.cep || "",
    };
    setLojas((prev) => [...prev, novaLoja]);
    setCnpjValue("");
    setCnpjData(null);
    setLojaEditData({});
    setLojaError(null);
    setAddingLoja(false);
  };

  const handleRemoveLoja = (index: number) => {
    setLojas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextStep2 = () => {
    if (lojas.length === 0) {
      setLojaError("Adicione pelo menos uma loja para continuar");
      setAddingLoja(true);
      return;
    }
    setLojaError(null);
    setCurrentStep(2);
  };

  // ── Final Submit ───────────────────────────────────────────────────────────

  const handleFinalSubmit = async () => {
    if (!termsAccepted) {
      setTermsError(true);
      return;
    }
    if (!step1Data) return;
    setTermsError(false);
    setSubmitError(null);
    setIsLoading(true);
    try {
      const { user } = await signUp(
        step1Data.email,
        step1Data.senha,
        step1Data.nome,
        "posto"
      );

      // Cria um posto + lojas para o usuário recém criado
      if (user && lojas.length > 0) {
        const { data: postoRow, error: postoErr } = await supabase
          .from("postos")
          .insert({
            user_id: user.id,
            razao_social: lojas[0].razao_social,
            nome_fantasia: lojas[0].nome_fantasia,
            cnpj: lojas[0].cnpj.replace(/\D/g, ""),
            telefone: step1Data.telefone,
          })
          .select("id")
          .single();

        if (postoErr) throw new Error(postoErr.message);

        if (postoRow) {
          const lojasInsert = lojas.map((l) => ({
            posto_id: postoRow.id,
            nome: l.nome_fantasia,
            endereco: `${l.logradouro}, ${l.numero} - ${l.bairro}`,
            cidade: l.municipio,
            estado: l.uf,
            cep: l.cep,
          }));
          const { error: lojasErr } = await supabase
            .from("posto_lojas")
            .insert(lojasInsert);
          if (lojasErr) throw new Error(lojasErr.message);
        }
      }

      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setSubmitError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setSubmitError(err?.message || "Erro ao cadastrar com Google.");
    }
  };

  // ── Success Screen ─────────────────────────────────────────────────────────

  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-3">
            Conta criada com sucesso! 🎉
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Bem-vindo ao Conekta, <strong>{step1Data?.nome.split(" ")[0]}</strong>!
            Sua conta foi criada e suas lojas estão cadastradas.
          </p>
          <div className="bg-orange-50 rounded-xl p-4 mb-8 text-left">
            <p className="text-xs font-semibold text-[#E05C1A] mb-1">Próximos passos:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Verificar seu e-mail para confirmar a conta</li>
              <li>• Completar o perfil da sua empresa</li>
              <li>• Explorar fornecedores disponíveis</li>
            </ul>
          </div>
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#E05C1A] hover:bg-[#c54d15] text-white font-semibold text-sm transition-colors"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-1">
            Criar conta
          </h1>
          <p className="text-sm text-gray-500">
            Cadastre-se e comece a usar o Conekta
          </p>
        </div>

        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* ── Step 1: Dados Pessoais ─────────────────────────────────────── */}
        {currentStep === 0 && (
          <form onSubmit={handleStep1} className="flex flex-col gap-4">
            {/* Google Button */}
            <GoogleButton label="Cadastrar com Google" onClick={handleGoogleSignup} />
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">ou preencha abaixo</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Nome */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">Nome completo</label>
              <input
                {...step1Form.register("nome")}
                placeholder="João da Silva"
                className={`w-full px-4 py-3 rounded-xl border text-sm placeholder-gray-400 outline-none transition-all ${
                  step1Form.formState.errors.nome
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-[#E05C1A]"
                }`}
              />
              {step1Form.formState.errors.nome && (
                <p className="text-xs text-red-500">{step1Form.formState.errors.nome.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">E-mail</label>
              <input
                {...step1Form.register("email")}
                type="email"
                placeholder="seu@email.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm placeholder-gray-400 outline-none transition-all ${
                  step1Form.formState.errors.email
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-[#E05C1A]"
                }`}
              />
              {step1Form.formState.errors.email && (
                <p className="text-xs text-red-500">{step1Form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Telefone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">
                Telefone (WhatsApp)
              </label>
              <input
                {...step1Form.register("telefone")}
                type="tel"
                placeholder="(11) 99999-9999"
                onChange={(e) => {
                  const formatted = formatTelefone(e.target.value);
                  step1Form.setValue("telefone", formatted, { shouldValidate: true });
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm placeholder-gray-400 outline-none transition-all ${
                  step1Form.formState.errors.telefone
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-[#E05C1A]"
                }`}
              />
              {step1Form.formState.errors.telefone && (
                <p className="text-xs text-red-500">{step1Form.formState.errors.telefone.message}</p>
              )}
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">Senha</label>
              <div className="relative">
                <input
                  {...step1Form.register("senha")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm placeholder-gray-400 outline-none transition-all ${
                    step1Form.formState.errors.senha
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-[#E05C1A]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {step1Form.formState.errors.senha && (
                <p className="text-xs text-red-500">{step1Form.formState.errors.senha.message}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1A1A2E]">Confirmar senha</label>
              <div className="relative">
                <input
                  {...step1Form.register("confirmarSenha")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repita a senha"
                  className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm placeholder-gray-400 outline-none transition-all ${
                    step1Form.formState.errors.confirmarSenha
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-[#E05C1A]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {step1Form.formState.errors.confirmarSenha && (
                <p className="text-xs text-red-500">
                  {step1Form.formState.errors.confirmarSenha.message}
                </p>
              )}
            </div>

            {/* Tipo de conta */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1A1A2E]">Tipo de conta</label>
              <div className="grid grid-cols-3 gap-2">
                {(["cliente", "revendedor", "consultor"] as const).map((tipo) => (
                  <label
                    key={tipo}
                    className="flex flex-col items-center gap-1.5 cursor-pointer"
                  >
                    <input
                      {...step1Form.register("tipoConta")}
                      type="radio"
                      value={tipo}
                      className="sr-only"
                    />
                    <div
                      className={`w-full py-3 rounded-xl border-2 text-xs font-semibold text-center capitalize transition-all ${
                        step1Form.watch("tipoConta") === tipo
                          ? "border-[#E05C1A] bg-orange-50 text-[#E05C1A]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </div>
                  </label>
                ))}
              </div>
              {step1Form.formState.errors.tipoConta && (
                <p className="text-xs text-red-500">
                  {step1Form.formState.errors.tipoConta.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 rounded-xl bg-[#E05C1A] hover:bg-[#c54d15] text-white font-semibold text-sm transition-colors"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-sm text-gray-500">
              Já tem conta?{" "}
              <Link href="/login" className="text-[#E05C1A] font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        )}

        {/* ── Step 2: Suas Lojas ─────────────────────────────────────────── */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-5">
            {/* Lista de lojas salvas */}
            {lojas.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-[#1A1A2E]">
                  Lojas adicionadas ({lojas.length})
                </h3>
                {lojas.map((loja, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#E05C1A] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Store className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1A1A2E]">
                          {loja.nome_fantasia}
                        </p>
                        <p className="text-xs text-gray-500">{loja.cnpj}</p>
                        <p className="text-xs text-gray-500">
                          {loja.logradouro}, {loja.numero} — {loja.municipio}/{loja.uf}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLoja(index)}
                      className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new loja form */}
            {addingLoja ? (
              <div className="flex flex-col gap-4 p-5 rounded-xl border-2 border-dashed border-gray-200">
                <h3 className="text-sm font-semibold text-[#1A1A2E]">
                  {lojas.length === 0 ? "Adicionar loja" : "Nova loja"}
                </h3>

                <CNPJInput
                  value={cnpjValue}
                  onChange={(v) => {
                    setCnpjValue(v);
                    setLojaError(null);
                  }}
                  onDataLoaded={handleCNPJLoaded}
                  error={undefined}
                />

                {cnpjData && (
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5 col-span-2">
                        <label className="text-xs font-medium text-gray-500">Razão Social</label>
                        <input
                          value={lojaEditData.razao_social || ""}
                          onChange={(e) =>
                            setLojaEditData((p) => ({ ...p, razao_social: e.target.value }))
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#E05C1A] text-sm outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 col-span-2">
                        <label className="text-xs font-medium text-gray-500">Nome Fantasia</label>
                        <input
                          value={lojaEditData.nome_fantasia || ""}
                          onChange={(e) =>
                            setLojaEditData((p) => ({ ...p, nome_fantasia: e.target.value }))
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#E05C1A] text-sm outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-medium text-gray-500">Logradouro</label>
                        <input
                          value={lojaEditData.logradouro || ""}
                          onChange={(e) =>
                            setLojaEditData((p) => ({ ...p, logradouro: e.target.value }))
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#E05C1A] text-sm outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500">Número</label>
                        <input
                          value={lojaEditData.numero || ""}
                          onChange={(e) =>
                            setLojaEditData((p) => ({ ...p, numero: e.target.value }))
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#E05C1A] text-sm outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500">Bairro</label>
                        <input
                          value={lojaEditData.bairro || ""}
                          onChange={(e) =>
                            setLojaEditData((p) => ({ ...p, bairro: e.target.value }))
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#E05C1A] text-sm outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-500">Município</label>
                        <input
                          value={lojaEditData.municipio || ""}
                          onChange={(e) =>
                            setLojaEditData((p) => ({ ...p, municipio: e.target.value }))
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#E05C1A] text-sm outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 col-span-2">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-gray-500">UF</label>
                          <input
                            value={lojaEditData.uf || ""}
                            maxLength={2}
                            onChange={(e) =>
                              setLojaEditData((p) => ({
                                ...p,
                                uf: e.target.value.toUpperCase(),
                              }))
                            }
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#E05C1A] text-sm outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-gray-500">CEP</label>
                          <input
                            value={lojaEditData.cep || ""}
                            onChange={(e) =>
                              setLojaEditData((p) => ({ ...p, cep: e.target.value }))
                            }
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#E05C1A] text-sm outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {lojaError && (
                  <p className="text-xs text-red-500">{lojaError}</p>
                )}

                <div className="flex gap-2 mt-1">
                  {lojas.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setAddingLoja(false);
                        setCnpjValue("");
                        setCnpjData(null);
                        setLojaEditData({});
                        setLojaError(null);
                      }}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveLoja}
                    disabled={!cnpjData}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E05C1A] hover:bg-[#c54d15] text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Salvar esta loja
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingLoja(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-[#E05C1A] hover:text-[#E05C1A] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar outra loja
              </button>
            )}

            {lojaError && !addingLoja && (
              <p className="text-xs text-red-500">{lojaError}</p>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(0)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E05C1A] hover:bg-[#c54d15] text-white font-semibold text-sm transition-colors"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Revisão ────────────────────────────────────────────── */}
        {currentStep === 2 && step1Data && (
          <div className="flex flex-col gap-5">
            {/* Resumo pessoal */}
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Seus dados
                </h3>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Nome</span>
                  <span className="font-medium text-[#1A1A2E]">{step1Data.nome}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">E-mail</span>
                  <span className="font-medium text-[#1A1A2E]">{step1Data.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Telefone</span>
                  <span className="font-medium text-[#1A1A2E]">{step1Data.telefone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tipo de conta</span>
                  <span className="font-medium text-[#1A1A2E] capitalize">
                    {step1Data.tipoConta}
                  </span>
                </div>
              </div>
            </div>

            {/* Resumo das lojas */}
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Lojas ({lojas.length})
                </h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {lojas.map((loja, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Store className="w-4 h-4 text-[#E05C1A]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A2E]">
                        {loja.nome_fantasia}
                      </p>
                      <p className="text-xs text-gray-500">{loja.razao_social}</p>
                      <p className="text-xs text-gray-400">{loja.cnpj}</p>
                      <p className="text-xs text-gray-400">
                        {loja.logradouro}, {loja.numero}, {loja.bairro} — {loja.municipio}/
                        {loja.uf}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Termos */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (e.target.checked) setTermsError(false);
                }}
                className="mt-0.5 w-4 h-4 accent-[#E05C1A] rounded flex-shrink-0"
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                Li e aceito os{" "}
                <a
                  href="#"
                  className="text-[#E05C1A] hover:underline font-medium"
                  onClick={(e) => e.preventDefault()}
                >
                  Termos de Uso
                </a>{" "}
                e a{" "}
                <a
                  href="#"
                  className="text-[#E05C1A] hover:underline font-medium"
                  onClick={(e) => e.preventDefault()}
                >
                  Política de Privacidade
                </a>{" "}
                do Conekta
              </span>
            </label>
            {termsError && (
              <p className="text-xs text-red-500 -mt-3">
                Você precisa aceitar os termos para criar sua conta
              </p>
            )}
            {submitError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {submitError}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-1">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E05C1A] hover:bg-[#c54d15] text-white font-semibold text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Criando conta...
                  </>
                ) : (
                  "Criar minha conta"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
