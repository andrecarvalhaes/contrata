"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  MapPin,
  Clock,
  BadgeCheck,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  ImageOff,
  Star,
  ChevronRight,
  Settings,
} from "lucide-react";
import { useMeuPerfilPublico } from "@/lib/data/perfil";
import { StarRating } from "@/components/fornecedor/StarRating";
import { formatarPrecoAnuncio } from "@/lib/data/anuncios";
import { supabase } from "@/lib/supabase/client";

export default function PerfilPublicoPage() {
  const { data: perfil, isLoading } = useMeuPerfilPublico();

  if (isLoading || !perfil) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const avatarUrl = perfil.imagem_url
    ? perfil.imagem_url.startsWith("http")
      ? perfil.imagem_url
      : supabase.storage.from("anuncio-fotos").getPublicUrl(perfil.imagem_url).data.publicUrl
    : null;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header com badge de preview */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-purple">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Perfil público
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 font-display">
            Como o posto te vê
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Preview em tempo real do seu perfil no marketplace. Edite suas
            informações nas configurações.
          </p>
        </div>
        <Link
          href="/parceiro/perfil/configuracoes"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Editar perfil
        </Link>
      </header>

      {/* Card do perfil (preview) */}
      <section className="rounded-3xl bg-white shadow-lg border border-purple/10 overflow-hidden">
        {/* Capa */}
        <div className="h-32 sm:h-40 bg-gradient-to-br from-purple via-purple-medium to-purple-light" />

        <div className="px-5 sm:px-8 pb-6 sm:pb-8">
          {/* Avatar + identificação */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12 sm:-mt-16">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white p-1.5 shadow-xl">
              {avatarUrl ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src={avatarUrl}
                    alt={perfil.nome}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple/10 to-purple-light/10 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-bold text-purple font-display">
                    {perfil.nome[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 sm:pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
                  {perfil.nome}
                </h2>
                {perfil.verificado && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple bg-purple/10 px-2 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verificado
                  </span>
                )}
              </div>
              {perfil.nome_fantasia && perfil.razao_social !== perfil.nome && (
                <p className="text-xs text-gray-500">{perfil.razao_social}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                {perfil.rating_medio > 0 ? (
                  <Link
                    href="/parceiro/perfil/avaliacoes"
                    className="flex items-center gap-1.5 hover:text-purple"
                  >
                    <StarRating value={perfil.rating_medio} showValue />
                    <span className="text-gray-500">
                      ({perfil.total_avaliacoes})
                    </span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400">
                    <Star className="w-4 h-4" />
                    Sem avaliações
                  </span>
                )}
                {(perfil.cidade || perfil.estado) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {[perfil.cidade, perfil.estado].filter(Boolean).join(" - ")}
                  </span>
                )}
                {perfil.tempo_resposta_horas && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Responde em até {perfil.tempo_resposta_horas}h
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Descrição */}
          {perfil.descricao && (
            <p className="mt-6 text-sm text-gray-700 leading-relaxed">
              {perfil.descricao}
            </p>
          )}

          {/* Categorias */}
          {perfil.categorias.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Categorias atendidas
              </h3>
              <div className="flex flex-wrap gap-2">
                {perfil.categorias.map((c) => (
                  <span
                    key={c.id}
                    className="px-3 py-1.5 rounded-full bg-purple/10 text-purple text-xs font-semibold"
                  >
                    {c.nome}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certificações */}
          {perfil.certificacoes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Certificações
              </h3>
              <div className="flex flex-wrap gap-2">
                {perfil.certificacoes.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold"
                  >
                    <BadgeCheck className="w-3 h-3" />
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contatos */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {perfil.telefone && (
              <ContatoLink icon={Phone} href={`tel:${perfil.telefone}`}>
                {perfil.telefone}
              </ContatoLink>
            )}
            {perfil.whatsapp && (
              <ContatoLink
                icon={MessageCircle}
                href={`https://wa.me/${perfil.whatsapp.replace(/\D/g, "")}`}
              >
                WhatsApp: {perfil.whatsapp}
              </ContatoLink>
            )}
            {perfil.email_contato && (
              <ContatoLink icon={Mail} href={`mailto:${perfil.email_contato}`}>
                {perfil.email_contato}
              </ContatoLink>
            )}
            {perfil.website && (
              <ContatoLink
                icon={Globe}
                href={perfil.website}
                external
              >
                {perfil.website.replace(/^https?:\/\//, "")}
              </ContatoLink>
            )}
          </div>
        </div>
      </section>

      {/* Galeria consolidada */}
      {perfil.fotos.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 font-display mb-3">
            Galeria de serviços
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {perfil.fotos.slice(0, 8).map((foto, i) => {
              const url = foto.startsWith("http")
                ? foto
                : supabase.storage.from("anuncio-fotos").getPublicUrl(foto).data.publicUrl;
              return (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
                >
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Anúncios ativos */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 font-display">
            Anúncios publicados
          </h2>
          <Link
            href="/parceiro/anuncios"
            className="text-xs font-semibold text-purple hover:underline inline-flex items-center gap-1"
          >
            Gerenciar
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {perfil.anuncios_ativos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-purple/20 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">
              Nenhum anúncio ativo no momento. Os postos não verão você no
              marketplace enquanto você não tiver anúncios ativos.
            </p>
            <Link
              href="/parceiro/anuncios/novo"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-purple hover:bg-purple-medium text-white text-sm font-semibold transition-colors"
            >
              Criar primeiro anúncio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {perfil.anuncios_ativos.map((a) => (
              <AnuncioMiniCard key={a.id} anuncio={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ContatoLink({
  icon: Icon,
  href,
  external,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-purple/5 text-sm text-gray-700 hover:text-purple transition-colors"
    >
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className="truncate">{children}</span>
    </a>
  );
}

function AnuncioMiniCard({
  anuncio,
}: {
  anuncio: {
    id: string;
    titulo: string;
    resumo: string | null;
    preco_modalidade: string;
    preco_centavos: number | null;
    fotos: string[];
    categoria_nome: string | null;
  };
}) {
  const capa = anuncio.fotos[0] ?? null;
  const capaUrl = capa
    ? capa.startsWith("http")
      ? capa
      : supabase.storage.from("anuncio-fotos").getPublicUrl(capa).data.publicUrl
    : null;

  const preco = formatarPrecoAnuncio({
    preco_modalidade: anuncio.preco_modalidade as "fixo" | "a_partir_de" | "sob_consulta",
    preco_centavos: anuncio.preco_centavos,
    unidade_preco: null,
  });

  return (
    <article className="flex gap-3 p-3 rounded-2xl border border-gray-100 bg-white hover:border-purple/30 hover:shadow-md transition-all">
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-purple/5 to-purple-light/10 flex-shrink-0">
        {capaUrl ? (
          <Image
            src={capaUrl}
            alt={anuncio.titulo}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-purple/30">
            <ImageOff className="w-6 h-6" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {anuncio.categoria_nome && (
          <p className="text-[10px] font-semibold text-purple uppercase tracking-wide">
            {anuncio.categoria_nome}
          </p>
        )}
        <h4 className="mt-0.5 text-sm font-bold text-gray-900 line-clamp-1">
          {anuncio.titulo}
        </h4>
        {anuncio.resumo && (
          <p className="text-xs text-gray-500 line-clamp-1">{anuncio.resumo}</p>
        )}
        <p className="mt-1 text-xs font-semibold text-purple">{preco}</p>
      </div>
    </article>
  );
}
