"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Clock,
  Building2,
  Construction,
} from "lucide-react";
import { useMinhasConversas, type Conversa } from "@/lib/data/mensagens";

export default function MensagensPage() {
  const { data: conversas = [], isLoading } = useMinhasConversas();
  const [busca, setBusca] = useState("");

  const filtradas = conversas.filter((c) =>
    c.posto_nome.toLowerCase().includes(busca.toLowerCase())
  );

  const totalNaoLidas = conversas.reduce((s, c) => s + c.nao_lidas, 0);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-purple">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Mensagens
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 font-display">
            Caixa de entrada
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Chat em tempo real com os postos interessados nos seus serviços.
          </p>
        </div>
        {totalNaoLidas > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple/10 text-purple text-xs font-bold">
            {totalNaoLidas} não{totalNaoLidas > 1 ? " lidas" : " lida"}
          </span>
        )}
      </header>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome do posto..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-purple focus:ring-2 focus:ring-purple/10 transition-all bg-white"
        />
      </div>

      {/* Aviso de construção */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-purple/20 bg-purple/5">
        <Construction className="w-5 h-5 text-purple flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-purple">
            Módulo em construção
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            O chat em tempo real será ativado em breve. A infraestrutura de
            mensagens está sendo configurada — as conversas aparecerão aqui assim
            que estiver disponível.
          </p>
        </div>
      </div>

      {/* Lista de conversas */}
      {isLoading ? (
        <ConversasSkeleton />
      ) : filtradas.length === 0 ? (
        <EmptyInbox />
      ) : (
        <ul className="rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50 overflow-hidden">
          {filtradas.map((c) => (
            <ConversaRow key={c.id} conversa={c} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ConversaRow({ conversa: c }: { conversa: Conversa }) {
  return (
    <li>
      <Link
        href={`/parceiro/mensagens/conversa?id=${c.id}`}
        className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors"
      >
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-purple/10 flex items-center justify-center flex-shrink-0">
          {c.foto_url ? (
            <img
              src={c.foto_url}
              alt={c.posto_nome}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <Building2 className="w-5 h-5 text-purple" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p
              className={`text-sm font-semibold truncate ${
                c.nao_lidas > 0 ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {c.posto_nome}
            </p>
            {c.ultima_mensagem_em && (
              <span className="text-[10px] text-gray-400 flex-shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(c.ultima_mensagem_em).toLocaleString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-gray-500 truncate">
            {c.ultima_mensagem ?? "Sem mensagens ainda"}
          </p>
        </div>

        {c.nao_lidas > 0 && (
          <span className="w-5 h-5 rounded-full bg-purple text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
            {c.nao_lidas}
          </span>
        )}
      </Link>
    </li>
  );
}

function ConversasSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50 overflow-hidden">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
          <div className="w-11 h-11 rounded-full bg-gray-100 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-gray-100 rounded" />
            <div className="h-3 w-2/3 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyInbox() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-purple/20 bg-white p-10 text-center">
      <div className="w-14 h-14 rounded-2xl bg-purple/10 flex items-center justify-center mx-auto mb-4">
        <MessageSquare className="w-7 h-7 text-purple" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 font-display">
        Nenhuma conversa ainda
      </h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
        As conversas aparecem aqui quando um posto entrar em contato via lead ou
        quando você iniciar um chat a partir do detalhe de um lead.
      </p>
      <Link
        href="/parceiro/leads"
        className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-purple hover:bg-purple-medium text-white font-semibold text-sm transition-colors"
      >
        Ver meus leads
      </Link>
    </div>
  );
}
