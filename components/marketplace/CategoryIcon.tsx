import {
  Search,
  ClipboardCheck,
  Container,
  Fuel,
  Zap,
  FlaskConical,
  HardHat,
  ShieldCheck,
  Leaf,
  Ruler,
  Droplets,
  Wrench,
  Truck,
  Sun,
  Laptop,
  GraduationCap,
  LucideIcon,
} from 'lucide-react'

interface CategoryIconProps {
  iconName: string
  className?: string
}

const iconMap: Record<string, LucideIcon> = {
  Search,
  ClipboardCheck,
  Container,
  Fuel,
  Zap,
  FlaskConical,
  HardHat,
  ShieldCheck,
  Leaf,
  Ruler,
  Droplets,
  Wrench,
  Truck,
  Sun,
  Laptop,
  GraduationCap,
}

export function CategoryIcon({ iconName, className = 'w-4 h-4' }: CategoryIconProps) {
  const Icon = iconMap[iconName] || Wrench
  return <Icon className={className} />
}
