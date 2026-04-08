"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnuncioForm } from "@/components/fornecedor/AnuncioForm";

function EditarAnuncioContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? undefined;

  if (!id) {
    return (
      <div className="mx-auto w-full max-w-2xl text-center py-12">
        <p className="text-sm text-gray-600">Anúncio não encontrado.</p>
      </div>
    );
  }

  return <AnuncioForm anuncioId={id} />;
}

export default function EditarAnuncioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EditarAnuncioContent />
    </Suspense>
  );
}
