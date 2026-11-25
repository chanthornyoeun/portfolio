import { Briefcase, Building2, ChartNoAxesCombined, FileText, Receipt, Ship, ShoppingCart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Approved icon keys for other_projects.icon. Explicit imports keep the bundle small; unknown keys get Briefcase.
export const PROJECT_ICONS: Record<string, LucideIcon> = { Ship, ChartNoAxesCombined, ShoppingCart, Building2, FileText, Receipt };
export const projectIcon = (key?: string): LucideIcon => (key && Object.hasOwn(PROJECT_ICONS, key) ? PROJECT_ICONS[key] : Briefcase);
