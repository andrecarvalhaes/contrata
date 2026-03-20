import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Footer } from '@/components/Footer'
import { WavyBackgroundWrapper } from '@/components/WavyBackgroundWrapper'

export default function Home() {
  return (
    <WavyBackgroundWrapper>
      <Navbar />
      <Hero />
      <Footer />
    </WavyBackgroundWrapper>
  )
}
