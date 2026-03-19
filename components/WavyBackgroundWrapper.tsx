'use client'

import { WavyBackground } from '@/components/ui/wavy-background'

export function WavyBackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WavyBackground
      containerClassName="wavy-background fixed inset-0 z-0"
      className="absolute inset-0"
      colors={[
        'rgba(98, 57, 150, 0.3)',      // purple with alpha
        'rgba(145, 62, 151, 0.25)',    // purple-medium with alpha
        'rgba(190, 133, 187, 0.2)',    // purple-light with alpha
        'rgba(245, 158, 11, 0.25)',    // amber-500 with alpha
        'rgba(139, 92, 246, 0.22)',    // violet with alpha
      ]}
      waveWidth={70}
      backgroundFill="rgba(255, 255, 255, 0)"
      blur={20}
      speed="slow"
      waveOpacity={1}
    >
      <div className="relative z-10">
        {children}
      </div>
    </WavyBackground>
  )
}
