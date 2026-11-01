import {
  ArrowLeftRight,
  Briefcase,
  Car,
  Clapperboard,
  Coins,
  GraduationCap,
  HeartPulse,
  House,
  Laptop,
  MoreHorizontal,
  Plane,
  Receipt,
  Repeat,
  ShoppingBag,
  TrendingUp,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Food: UtensilsCrossed,
  Transport: Car,
  Shopping: ShoppingBag,
  Entertainment: Clapperboard,
  Education: GraduationCap,
  Health: HeartPulse,
  Bills: Receipt,
  Rent: House,
  Travel: Plane,
  Subscriptions: Repeat,
  Other: MoreHorizontal,
  Salary: Briefcase,
  Freelance: Laptop,
  Investments: TrendingUp,
  'Other Income': Coins,
};

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = CATEGORY_ICONS[category] ?? ArrowLeftRight;
  return <Icon className={cn('shrink-0', className)} aria-hidden="true" />;
}
