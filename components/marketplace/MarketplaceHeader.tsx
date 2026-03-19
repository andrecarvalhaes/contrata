'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function MarketplaceHeader() {
  return (
    <div className="bg-gray-50 pt-3 sm:pt-4 pb-2 sm:pb-3">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb compacto */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-500">
          <Link href="/" className="hover:text-purple transition-colors">
            Início
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">Marketplace</span>
        </div>
      </div>
    </div>
  )
}
