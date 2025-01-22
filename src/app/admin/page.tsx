"use client"
import React, { useState } from 'react';
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMenu, FiGrid, FiCalendar, FiUsers, 
  FiMessageSquare, FiSettings, FiBell, FiSearch 
} from "react-icons/fi";
import Image from "next/image";
import SettingsPage from './Settings';
import { AppointmentsPage } from './AppointmentsPage';
import {PatientsPage} from './PatientPage';


import Blog from './news';
import {  DentalAnalyticsDashboard } from './Dashboard';

type NavItem = {
  icon: React.ElementType;
  label: string;
  path: ViewType;
};

type ViewType = 'dashboard' | 'appointments' | 'patients' | 'messages' | 'settings'|'post'|'blog';

const navItems: NavItem[] = [
  { icon: FiGrid, label: 'Dashboard', path: 'dashboard' },
  { icon: FiCalendar, label: 'Appointments', path: 'appointments' },
  { icon: FiUsers, label: 'Patients', path: 'patients' },
  { icon: FiMessageSquare, label: 'Messages', path: 'messages' },
  { icon: FiSettings, label: 'Settings', path: 'settings' },
  { icon:FiMessageSquare, label:'Blog', path:'blog'}
];

const renderView = (view: ViewType) => {
  switch (view) {
    case 'dashboard':
      return <div><DentalAnalyticsDashboard/></div>;
    case 'appointments':
      return <div> <AppointmentsPage/> </div>;
    case 'patients':
      return <div><PatientsPage/></div>;
    case 'messages':
      return <div>Messages View</div>;
    case 'settings':
      return <div> <SettingsPage/></div>;
    case 'blog':
      return <div><Blog></Blog></div>
 
    default:
      return <div>View not found</div>;
  }
};

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 z-40 h-screen w-64"
          >
            <div className="h-full bg-white dark:bg-gray-800 shadow-lg px-4 py-6">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-2xl font-bold text-ssblue">

                  <Image 
                    src="/logo.png" 
                    alt="Smile Studio Logo"
                    width={140}
                    height={80}
                  />
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden"
                >
                  <FiMenu className="h-5 w-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <motion.div
                    key={item.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={currentView === item.path ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start rounded-lg py-3",
                        currentView === item.path 
                          ? "bg-ssblue text-white" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                      onClick={() => setCurrentView(item.path)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className={cn(
        "transition-all duration-300",
        isSidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 shadow-sm">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiMenu className="h-5 w-5" />
              </Button>
              <div className="relative hidden md:block">
                <input
                  type="search"
                  placeholder="Search..."
                  className="rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-ssblue"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <FiBell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-ssblue text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              <div className="h-8 w-8 rounded-full bg-ssblue text-white flex items-center justify-center">
                US
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {renderView(currentView)}
        </main>
      </div>
    </div>
  );
}