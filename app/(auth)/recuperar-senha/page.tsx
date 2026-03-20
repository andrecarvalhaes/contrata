"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const recoverSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail obrigatório")
    .email("E-mail inválido"),
});

type RecoverFormData = z.infer<typeof recoverSchema>;

export default function RecuperarSenhaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverFormData>({
    resolver: zodResolver(recoverSchema),
  });

  const onSubmit = async (data: RecoverFormData) => {
    setIsLoading(true);
    // Simula envio
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Recover email:", data.email);
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {!submitted ? (
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-[#E05C1A]" />
              </div>
              <h1 className="text-2xl font-bold text-[#1A1A2E] mb-1">
                Recuperar senha
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                Digite seu e-mail cadastrado e enviaremos as instruções para redefinir sua senha.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1A1A2E]">
                  E-mail
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1A1A2E] placeholder-gray-400 outline-none transition-all duration-150 ${
                    errors.email
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-[#E05C1A] bg-white"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 rounded-xl bg-[#E05C1A] hover:bg-[#c54d15] text-white font-semibold text-sm transition-colors duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
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
                    Enviando...
                  </>
                ) : (
                  "Enviar instruções"
                )}
              </button>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-3">
              E-mail enviado!
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Se esse e-mail existir, você receberá as instruções em breve.
              Verifique também sua caixa de spam.
            </p>
            <div className="bg-orange-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-[#E05C1A] font-medium">
                💡 O link de redefinição expira em 1 hora
              </p>
            </div>
          </div>
        )}

        {/* Back to login */}
        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#E05C1A] font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
