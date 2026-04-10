"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Building2,
  Check,
  CheckCheck,
  Construction,
  FileText,
} from "lucide-react";
import { useMensagens, useMinhasConversas, type Mensagem } from "@/lib/data/mensagens";
import { useAuthContext } from "@/components/providers/AuthProvider";

export default function ConversaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ConversaContent />
    </Suspense>
  );
}

function ConversaContent() {
  const params = useSearchParams();
  const conversaId = params.get("id");

  const { data: conversas = [] } = useMinhasConversas();
  const { data: mensagens = [], isLoading } = useMensagens(conversaId);
  const { profile } = useAuthContext();

  const conversa = conversas.find((c) => c.id === conversaId);
  const [texto, setTexto] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    // Envio real será ativado com Supabase Realtime
    setTexto("");
  }

  if (!conversaId) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <p className="text-sm text-gray-500">Conversa não informada.</p>
        <Link href="/parceiro/mensagens" className="mt-3 inline-block text-sm text-purple hover:underline">
          Voltar ao inbox
        </Link>
      </div>
    );
  }

  const postoNome = conversa?.posto_nome ?? "Posto";

  return (
    <div className="mx-auto w-full max-w-2xl flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
      {/* Header do chat */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <Link
          href="/parceiro/mensagens"
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-purple" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{postoNome}</p>
          {conversa?.lead_id && (
            <Link
              href={`/parceiro/leads/detalhe?id=${conversa.lead_id}`}
              className="text-xs text-purple hover:underline flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              Ver lead
            </Link>
          )}
        </div>
      </div>

      {/* Aviso em construção */}
      <div className="my-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple/5 border border-purple/15">
        <Construction className="w-4 h-4 text-purple flex-shrink-0" />
        <p className="text-xs text-purple font-medium">
          Chat em tempo real será ativado em breve (Supabase Realtime).
        </p>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0">
        {isLoading ? (
          <MensagensSkeleton />
        ) : mensagens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <Send className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              Nenhuma mensagem ainda. Comece a conversa!
            </p>
          </div>
        ) : (
          mensagens.map((m) => (
            <BubbleMensagem
              key={m.id}
              mensagem={m}
              isMinha={m.autor === "fornecedor"}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Campo de envio */}
      <form
        onSubmit={handleEnviar}
        className="flex items-end gap-2 pt-4 border-t border-gray-100"
      >
        <button
          type="button"
          title="Anexar arquivo"
          className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 flex-shrink-0 transition-colors"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleEnviar(e as any);
            }
          }}
          rows={1}
          placeholder="Digite uma mensagem..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-purple focus:ring-2 focus:ring-purple/10 transition-all resize-none"
          style={{ minHeight: "46px", maxHeight: "120px" }}
        />
        <button
          type="submit"
          disabled={!texto.trim()}
          className="p-2.5 rounded-xl bg-purple hover:bg-purple-medium text-white flex-shrink-0 transition-colors disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

function BubbleMensagem({
  mensagem: m,
  isMinha,
}: {
  mensagem: Mensagem;
  isMinha: boolean;
}) {
  return (
    <div className={`flex ${isMinha ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isMinha
            ? "bg-purple text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.conteudo}</p>
        <div
          className={`flex items-center justify-end gap-1 mt-1 ${
            isMinha ? "text-white/60" : "text-gray-400"
          }`}
        >
          <time className="text-[10px]">
            {new Date(m.created_at).toLocaleString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
          {isMinha &&
            (m.lida ? (
              <CheckCheck className="w-3 h-3" />
            ) : (
              <Check className="w-3 h-3" />
            ))}
        </div>
      </div>
    </div>
  );
}

function MensagensSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[false, true, false, true].map((isMinha, i) => (
        <div key={i} className={`flex ${isMinha ? "justify-end" : "justify-start"}`}>
          <div
            className={`h-12 rounded-2xl ${isMinha ? "bg-purple/20 w-48" : "bg-gray-100 w-56"}`}
          />
        </div>
      ))}
    </div>
  );
}
