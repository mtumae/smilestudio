"use client"

import React, { useState } from 'react';
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { FiMenu, FiGrid, FiCalendar, FiUsers, FiMessageSquare, FiSettings } from "react-icons/fi";

type NavItem = {
  icon: React.ElementType;
  label: string;
  path: ViewType;
};

type ViewType = 'dashboard' | 'appointments' | 'patients' | 'messages' | 'settings';

const navItems: NavItem[] = [
  { icon: FiGrid, label: 'Dashboard', path: 'dashboard' },
  { icon: FiCalendar, label: 'Appointments', path: 'appointments' },
  { icon: FiUsers, label: 'Patients', path: 'patients' },
  { icon: FiMessageSquare, label: 'Messages', path: 'messages' },
  { icon: FiSettings, label: 'Settings', path: 'settings' }
];

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transition-transform",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="h-full border-r bg-white px-3 py-4">
          {/* Logo Area */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-2xl font-bold">Logo</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <FiMenu className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={currentView === item.path ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentView(item.path)}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-margin duration-300",
        isSidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 border-b bg-white">
          <div className="flex h-16 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <FiMenu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4">
          
          {renderView(currentView)}
        </main>
      </div>
    </div>
  );
}

// Temporary function to render views - replace with your routing
function renderView(view: ViewType) {
  switch (view) {
    case 'dashboard':
      return <div>Dashboard View</div>;
    case 'appointments':
      return <div>Appointments View</div>;
    case 'patients':
      return <div>Patients View</div>;
    case 'messages':
      return <div>Messages View</div>;
    case 'settings':
      return <div>Settings View</div>;
  }
}