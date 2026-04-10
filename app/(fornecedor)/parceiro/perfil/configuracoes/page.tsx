"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  User,
  Landmark,
  Bell,
  FileText,
  AlertTriangle,
  Save,
  Check,
  Lock,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useMyFornecedor } from "@/lib/data/onboarding";
import { useAuthContext } from "@/components/providers/AuthProvider";

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ConfiguracoesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Voltar */}
      <Link
        href="/parceiro/perfil"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Meu perfil
      </Link>

      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900 font-display">
          Configurações da conta
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Gerencie dados da empresa, notificações e preferências.
        </p>
      </header>

      <DadosEmpresaSection />
      <ResponsavelSection />
      <DadosBancariosSection />
      <NotificacoesSection />
      <DocumentosSection />
      <ZonaDangerSection />
    </div>
  );
}

// ─── Dados da empresa ─────────────────────────────────────────────────────────

function DadosEmpresaSection() {
  const { data: my } = useMyFornecedor();
  const f = my?.fornecedor;
  const qc = useQueryClient();

  const [form, setForm] = useState({
    razao_social: "",
    nome_fantasia: "",
    cnpj: "",
    telefone: "",
    whatsapp: "",
    email_contato: "",
    website: "",
    cidade: "",
    estado: "",
  });
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (f) {
      setForm({
        razao_social: f.razao_social ?? "",
        nome_fantasia: f.nome_fantasia ?? "",
        cnpj: f.cnpj ?? "",
        telefone: f.telefone ?? "",
        whatsapp: f.whatsapp ?? "",
        email_contato: f.email_contato ?? "",
        website: f.website ?? "",
        cidade: f.cidade ?? "",
        estado: f.estado ?? "",
      });
    }
  }, [f?.id]);

  const salvar = useMutation({
    mutationFn: async () => {
      if (!f) throw new Error("Fornecedor não identificado.");
      const { error } = await supabase
        .from("fornecedores")
        .update({
          razao_social: form.razao_social,
          nome_fantasia: form.nome_fantasia || null,
          cnpj: form.cnpj || null,
          telefone: form.telefone || null,
          whatsapp: form.whatsapp || null,
          email_contato: form.email_contato || null,
          website: form.website || null,
          cidade: form.cidade || null,
          estado: form.estado ? form.estado.toUpperCase().slice(0, 2) : null,
        })
        .eq("id", f.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-fornecedor"] });
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2500);
    },
  });

  function update<K extends keyof typeof form>(key: K, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <Section icon={<Building2 className="w-4 h-4" />} title="Dados da empresa">
      <form
        onSubmit={(e) => { e.preventDefault(); salvar.mutate(); }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Razão social" required>
            <input value={form.razao_social} onChange={(e) => update("razao_social", e.target.value)} required className={inputCls} />
          </Field>
          <Field label="Nome fantasia">
            <input value={form.nome_fantasia} onChange={(e) => update("nome_fantasia", e.target.value)} className={inputCls} />
          </Field>
          <Field label="CNPJ">
            <input value={form.cnpj} onChange={(e) => update("cnpj", e.target.value)} placeholder="00.000.000/0000-00" className={inputCls} />
          </Field>
          <Field label="Telefone">
            <input value={form.telefone} onChange={(e) => update("telefone", e.target.value)} className={inputCls} />
          </Field>
          <Field label="WhatsApp">
            <input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className={inputCls} />
          </Field>
          <Field label="E-mail de contato">
            <input type="email" value={form.email_contato} onChange={(e) => update("email_contato", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Site">
            <input type="url" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://" className={inputCls} />
          </Field>
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <Field label="Cidade">
              <input value={form.cidade} onChange={(e) => update("cidade", e.target.value)} className={inputCls} />
            </Field>
            <Field label="UF">
              <input value={form.estado} onChange={(e) => update("estado", e.target.value.toUpperCase().slice(0, 2))} maxLength={2} className={inputCls} />
            </Field>
          </div>
        </div>

        {salvar.error && (
          <p className="text-sm text-red-600">{(salvar.error as Error).message}</p>
        )}

        <div className="flex justify-end">
          <SaveButton loading={salvar.isPending} saved={salvo} />
        </div>
      </form>
    </Section>
  );
}

// ─── Responsável ─────────────────────────────────────────────────────────────

function ResponsavelSection() {
  const { profile } = useAuthContext();
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaMsg, setSenhaMsg] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSenha(e: React.FormEvent) {
    e.preventDefault();
    if (novaSenha.length < 6) {
      setSenhaMsg("Mínimo de 6 caracteres.");
      return;
    }
    setSalvando(true);
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    setSalvando(false);
    setSenhaMsg(error ? error.message : "Senha atualizada com sucesso.");
    if (!error) setNovaSenha("");
  }

  return (
    <Section icon={<User className="w-4 h-4" />} title="Responsável">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nome">
            <input
              value={profile?.display_name ?? ""}
              readOnly
              className={inputCls + " bg-gray-50 cursor-not-allowed"}
            />
          </Field>
          <Field label="E-mail">
            <input
              value={profile?.email ?? ""}
              readOnly
              className={inputCls + " bg-gray-50 cursor-not-allowed"}
            />
          </Field>
        </div>

        <form onSubmit={handleSenha} className="space-y-3">
          <Field label="Nova senha">
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className={inputCls}
            />
          </Field>
          {senhaMsg && (
            <p className={`text-sm ${senhaMsg.includes("sucesso") ? "text-green-600" : "text-red-600"}`}>
              {senhaMsg}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!novaSenha || salvando}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <Lock className="w-4 h-4" />
              {salvando ? "Atualizando..." : "Atualizar senha"}
            </button>
          </div>
        </form>
      </div>
    </Section>
  );
}

// ─── Dados bancários ─────────────────────────────────────────────────────────

function DadosBancariosSection() {
  return (
    <Section icon={<Landmark className="w-4 h-4" />} title="Dados bancários">
      <div className="space-y-4">
        <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Cadastro de conta bancária será ativado com a integração Conekta
            Pay. Os recebimentos serão transferidos automaticamente para a conta
            cadastrada.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-50 pointer-events-none select-none">
          {[
            { label: "Banco", placeholder: "Ex: Itaú, Bradesco, Nubank..." },
            { label: "Agência", placeholder: "0000" },
            { label: "Conta", placeholder: "00000-0" },
            { label: "CPF/CNPJ do titular", placeholder: "—" },
          ].map((f) => (
            <Field key={f.label} label={f.label}>
              <input disabled placeholder={f.placeholder} className={inputCls + " bg-gray-50"} />
            </Field>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Notificações ─────────────────────────────────────────────────────────────

const NOTIFICACOES = [
  { key: "novo_lead", label: "Novo lead", desc: "Quando um posto demonstra interesse" },
  { key: "mensagem", label: "Mensagem não lida", desc: "Quando receber uma nova mensagem" },
  { key: "proposta_aceita", label: "Proposta aceita", desc: "Quando um posto aceitar sua proposta" },
  { key: "avaliacao", label: "Avaliação recebida", desc: "Quando um posto avaliar seu serviço" },
];

function NotificacoesSection() {
  const [prefs, setPrefs] = useState<Record<string, { email: boolean; push: boolean }>>(
    Object.fromEntries(NOTIFICACOES.map((n) => [n.key, { email: true, push: false }]))
  );

  function toggle(key: string, canal: "email" | "push") {
    setPrefs((p) => ({
      ...p,
      [key]: { ...p[key], [canal]: !p[key][canal] },
    }));
  }

  return (
    <Section icon={<Bell className="w-4 h-4" />} title="Notificações">
      <div className="space-y-4">
        {NOTIFICACOES.map((n) => (
          <div key={n.key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{n.label}</p>
              <p className="text-xs text-gray-500">{n.desc}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Toggle
                label="E-mail"
                checked={prefs[n.key].email}
                onChange={() => toggle(n.key, "email")}
              />
              <Toggle
                label="Push"
                checked={prefs[n.key].push}
                onChange={() => toggle(n.key, "push")}
              />
            </div>
          </div>
        ))}
        <p className="text-xs text-gray-400">
          Preferências salvas localmente. Sincronização com servidor em breve.
        </p>
      </div>
    </Section>
  );
}

// ─── Documentos ──────────────────────────────────────────────────────────────

function DocumentosSection() {
  return (
    <Section icon={<FileText className="w-4 h-4" />} title="Documentos">
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Reenvie certidões vencidas ou atualize seus documentos de habilitação.
        </p>
        <Link
          href="/parceiro/onboarding"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Gerenciar documentos
        </Link>
      </div>
    </Section>
  );
}

// ─── Zona de perigo ───────────────────────────────────────────────────────────

function ZonaDangerSection() {
  function handleEncerrar() {
    if (
      window.confirm(
        "Tem certeza que deseja encerrar sua conta? Esta ação não pode ser desfeita."
      )
    ) {
      alert(
        "Encerramento de conta será processado em breve. Você receberá um e-mail de confirmação."
      );
    }
  }

  return (
    <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <h2 className="text-sm font-bold text-red-700 uppercase tracking-wider">
          Zona de risco
        </h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Ao encerrar a conta, seus anúncios serão removidos do marketplace e os
        dados ficarão indisponíveis. Esta ação é irreversível.
      </p>
      <button
        onClick={handleEncerrar}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
      >
        <AlertTriangle className="w-4 h-4" />
        Encerrar minha conta
      </button>
    </section>
  );
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
        <span className="text-purple">{icon}</span>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex flex-col items-center gap-1 cursor-pointer">
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-8 h-5 bg-gray-200 peer-checked:bg-purple rounded-full transition-colors" />
        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-3" />
      </div>
      <span className="text-[10px] text-gray-500 font-medium">{label}</span>
    </label>
  );
}

function SaveButton({ loading, saved }: { loading: boolean; saved: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
        saved
          ? "bg-green-600 text-white"
          : "bg-purple hover:bg-purple-medium text-white shadow-lg shadow-purple/20"
      } disabled:opacity-60`}
    >
      {saved ? (
        <>
          <Check className="w-4 h-4" />
          Salvo
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          {loading ? "Salvando..." : "Salvar alterações"}
        </>
      )}
    </button>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none bg-white focus:border-purple focus:ring-2 focus:ring-purple/10 transition-all";
