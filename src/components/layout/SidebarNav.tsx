
'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Leaf,
  ScanSearch,
  ClipboardCheck,
  User,
  Sparkles,
  Route,
  LogOut,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/plants', label: 'Explore Plants', icon: Leaf },
  { href: '/tours', label: 'Virtual Tours', icon: Route },
  { href: '/recommendations', label: 'AI Recommendations', icon: Sparkles },
  { href: '/recognize', label: 'Plant Recognition', icon: ScanSearch },
  { href: '/quizzes', label: 'Quizzes', icon: ClipboardCheck },
  { href: '/profile', label: 'My Progress', icon: User },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
      try {
          await authService.signOut();
          toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
          router.push('/login');
          router.refresh(); // Clears any cached user data
      } catch (error) {
           toast({ title: 'Sign Out Failed', description: 'Could not sign you out. Please try again.', variant: 'destructive' });
      }
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            href={item.href}
            isActive={pathname === item.href || (item.href !=='/' && pathname.startsWith(item.href))}
            tooltip={item.label}
            aria-disabled={item.disabled}
            className={item.disabled ? "cursor-not-allowed opacity-50" : ""}
          >
            <item.icon />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <SidebarSeparator className="my-2" />
       <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleSignOut}
            tooltip="Sign Out"
          >
            <LogOut />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
  );
}
