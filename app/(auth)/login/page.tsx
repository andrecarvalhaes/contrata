"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import GoogleButton from "@/components/auth/GoogleButton";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail obrigatório")
    .email("E-mail inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // Simulação de login
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Login data:", data);
    setIsLoading(false);
    // Aqui futuramente: redirect após login
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#1A1A2E] mb-1">
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-gray-500">
            Entre na sua conta Nex.to
          </p>
        </div>

        {/* Google Button */}
        <GoogleButton
          label="Entrar com Google"
          onClick={() => console.log("Google login")}
        />

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">ou continue com e-mail</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email */}
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

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#1A1A2E]">
                Senha
              </label>
              <Link
                href="/recuperar-senha"
                className="text-xs text-[#E05C1A] hover:underline font-medium"
              >
                Esqueci minha senha
              </Link>
            </div>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm text-[#1A1A2E] placeholder-gray-400 outline-none transition-all duration-150 ${
                  errors.password
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-[#E05C1A] bg-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
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
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 flex flex-col gap-2 text-center">
          <p className="text-sm text-gray-500">
            Não tem conta?{" "}
            <Link
              href="/cadastro"
              className="text-[#E05C1A] font-semibold hover:underline"
            >
              Criar conta
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            É fornecedor?{" "}
            <Link
              href="/cadastro/fornecedor"
              className="text-[#E05C1A] font-semibold hover:underline"
            >
              Cadastrar empresa
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
