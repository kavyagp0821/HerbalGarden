// src/components/layout/AppLayout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger, SidebarInset, SidebarRail, SidebarMenuButton } from '@/components/ui/sidebar';
import SidebarNav from './SidebarNav';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Chatbot from '../chatbot/Chatbot';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [currentYear, setCurrentYear] = useState<string | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="shadow-lg">
          <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-headline text-sidebar-primary hover:text-sidebar-primary-foreground transition-colors">
              <Leaf className="w-7 h-7" />
              <span className="group-data-[collapsible=icon]:hidden">Virtual Vana</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter className="p-4 flex flex-col gap-2">
            <div className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
              &copy; {currentYear !== null ? currentYear : <Skeleton className="inline-block h-3 w-10" />} Virtual Vana
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarRail/>
        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              {/* Optional: Add breadcrumbs or page title here */}
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </SidebarInset>
        <Chatbot />
      </div>
    </SidebarProvider>
  );
}
