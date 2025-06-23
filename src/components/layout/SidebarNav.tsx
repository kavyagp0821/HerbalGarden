
'use client';

import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Leaf,
  ScanSearch,
  ClipboardCheck,
  User,
  Sparkles,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/plants', label: 'Explore Plants', icon: Leaf },
  { href: '/recommendations', label: 'AI Recommendations', icon: Sparkles },
  { href: '/recognize', label: 'Plant Recognition', icon: ScanSearch },
  { href: '/quizzes', label: 'Quizzes', icon: ClipboardCheck },
  { href: '/profile', label: 'My Progress', icon: User },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            href={item.href}
            isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
            tooltip={item.label}
            aria-disabled={item.disabled}
            className={item.disabled ? "cursor-not-allowed opacity-50" : ""}
          >
            <item.icon />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
