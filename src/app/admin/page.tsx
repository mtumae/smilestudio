"use client"

import React, { useState} from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Input } from "~/components/ui/input";

import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FiSettings, FiBell, FiUser, FiLogOut, FiCalendar, FiDollarSign, FiUsers, FiActivity, FiPieChart, FiEdit, FiEye, FiCheckCircle, FiDownload, FiMenu, FiGrid, FiClock, FiTrendingUp, FiAlertCircle, FiSearch, FiFilter, FiPlus, FiMail, FiPhone, FiMessageSquare, FiTrash, FiTrash2 } from "react-icons/fi";
import Image from 'next/image';
import { api } from '~/trpc/react';
import { ActivityIcon, Calendar1, CalendarIcon, DollarSignIcon, Users2, UsersIcon } from 'lucide-react';
import { toast } from '~/hooks/use-toast';
import AddAdminDialog from './AddAdmin';
import { set } from 'date-fns';
import AdminMessagesPage from './Messages';


const mockAppointments = [
  {
    id: 1,
    patientName: "Emma Thompson",
    procedure: "Dental Cleaning",
    date: "2025-01-15",
    time: "09:00 AM",
    status: "Confirmed",
    duration: 60,
    notes: "Regular checkup",
    insurance: "BlueCross",
    cost: 150
  },
  {
    id: 2,
    patientName: "James Wilson",
    procedure: "Root Canal",
    date: "2025-01-15",
    time: "10:30 AM",
    status: "In Progress",
    duration: 90,
    notes: "Patient reported sensitivity",
    insurance: "Aetna",
    cost: 1200
  },
  // ... Add more appointments
];

const mockPatients = [
  {
    id: 1,
    name: "Emma Thompson",
    email: "emma.t@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-06-15",
    address: "123 Main St, Boston, MA 02108",
    insurance: "BlueCross",
    lastVisit: "2024-12-20",
    nextAppointment: "2025-01-15",
    medicalHistory: {
      conditions: ["Hypertension"],
      allergies: ["Penicillin"],
      medications: ["Lisinopril"]
    },
    paymentStatus: "Current",
    totalSpent: 2500
  },
  // ... Add more patients
];

const mockAnalytics = {
  appointmentsByMonth: [
    { month: 'Jan', appointments: 145 },
    { month: 'Feb', appointments: 162 },
    { month: 'Mar', appointments: 156 },
    { month: 'Apr', appointments: 175 },
    { month: 'May', appointments: 185 },
    { month: 'Jun', appointments: 190 },
    // ... Add more months
  ],
  revenueByMonth: [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 48000 },
    { month: 'Mar', revenue: 51000 },
    { month: 'Apr', revenue: 49000 },
    { month: 'May', revenue: 52000 },
    { month: 'Jun', revenue: 55000 },
    // ... Add more months
  ],
  procedureTypes: [
    { name: 'Cleaning', count: 250, revenue: 37500 },
    { name: 'Fillings', count: 180, revenue: 45000 },
    { name: 'Root Canal', count: 90, revenue: 108000 },
    { name: 'Crown', count: 75, revenue: 112500 },
    { name: 'Extraction', count: 60, revenue: 36000 },
  ]
};
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const mockNotifications = [
  {
    id: 1,
    type: 'appointment',
    message: 'New appointment request from James Wilson',
    time: '5 minutes ago',
    read: false
  },
  {
    id: 2,
    type: 'payment',
    message: 'Payment received for Invoice #1234',
    time: '1 hour ago',
    read: false
  },
  // ... Add more notifications
];

// Theme Configuration
const theme = {
  colors: {
    primary: {
      default: '#2563eb',
      hover: '#1d4ed8',
      light: '#3b82f6',
      dark: '#1e40af',
      gradient: 'linear-gradient(to right, #2563eb, #1d4ed8)'
    },
    secondary: {
      default: '#64748b',
      hover: '#475569',
    },
    success: {
      default: '#10b981',
      light: '#34d399',
      dark: '#059669'
    },
    warning: {
      default: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706'
    },
    error: {
      default: '#ef4444',
      light: '#f87171',
      dark: '#dc2626'
    },
    background: {
      primary: '#000000',
      secondary: '#111827',
      tertiary: '#1f2937',
      card: '#1e1e1e'
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
      tertiary: '#6b7280'
    },
    border: {
      default: '#374151',
      hover: '#4b5563'
    }
  },
  transitions: {
    default: 'all 0.2s ease-in-out',
    slow: 'all 0.3s ease-in-out',
    fast: 'all 0.1s ease-in-out'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  }
};
// Component Definitions

// Sidebar Navigation Component
const Sidebar = ({ isOpen, toggleSidebar, activeView, setActiveView }) => {
  const navItems = [
    { 
      icon: FiGrid, 
      label: 'Dashboard', 
      path: 'dashboard', 
      badge: null,
      section: 'main'
    },
    { 
      icon: FiCalendar, 
      label: 'Appointments', 
      path: 'appointments', 
      badge: '3',
      section: 'main'
    },
    { 
      icon: FiUsers, 
      label: 'Patients', 
      path: 'patients', 
      badge: null,
      section: 'main'
    },
    { 
      icon: FiDollarSign, 
      label: 'Billing', 
      path: 'billing', 
      badge: '2',
      section: 'main'
    },
    { 
      icon: FiPieChart, 
      label: 'Analytics', 
      path: 'analytics', 
      badge: null,
      section: 'main'
    },
    { 
      icon: FiMessageSquare, 
      label: 'Messages', 
      path: 'messages', 
      badge: '5',
      section: 'communication'
    },
    { 
      icon: FiMail, 
      label: 'Email', 
      path: 'email', 
      badge: null,
      section: 'communication'
    },
    { 
      icon: FiSettings, 
      label: 'Settings', 
      path: 'settings', 
      badge: null,
      section: 'system'
    },
    { 
      icon: FiUser, 
      label: 'Profile', 
      path: 'profile', 
      badge: null,
      section: 'system'
    }
  ];

  const userQuery = api.user.getMe.useQuery();

  // Group nav items by section
  const groupedNavItems = navItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50"
    >
      <div className="flex flex-col h-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="Dental Dashboard" 
                width={140} 
                height={50}
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <FiMenu className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-6">
            {Object.entries(groupedNavItems).map(([section, items]) => (
              <div key={section} className="space-y-1">
                <p className="px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </p>
                {items.map((item, index) => (
                  <Button
                    key={index}
                    variant={activeView === item.path ? "default" : "ghost"}
                    className={`w-full justify-start text-left hover:bg-gray-50 group relative
                      ${activeView === item.path ? 'bg-ssblue hover:bg-ssblue/90' : ''}
                    `}
                    onClick={() => setActiveView(item.path)}
                  >
                    <item.icon className={`mr-3 h-5 w-5 
                      ${activeView === item.path ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}
                    `} />
                    <span className={`
                      ${activeView === item.path ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}
                    `}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <Badge 
                        variant={activeView === item.path ? "outline" : "default"} 
                        className={`absolute right-2 ${
                          activeView === item.path 
                            ? 'bg-white text-ssblue' 
                            : 'bg-ssblue text-white'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <Separator className="mb-6" />
          
          <Card className="bg-gray-50 border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage 
                    src={userQuery.data?.image ?? "https://github.com/shadcn.png"} 
                    alt="User" 
                  />
                  <AvatarFallback>
                    {userQuery.data?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userQuery.data?.name ?? "User"}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {userQuery.data?.email}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <FiSettings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <FiUser className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FiSettings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

// Header Component
const Header = ({ toggleSidebar, notifications,user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const userQuery =  api.user.getMe.useQuery();
  console.log(userQuery.data);

  return (
    <header className="sticky top-0 z-40 bg-background-secondary border-b border-border-default">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <FiMenu className="h-5 w-5" />
            </Button>
         
          </div>

          <div className="flex items-center space-x-4">
            <Button >
              <FiPlus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <FiBell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red text-xs text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[400px]">
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'appointment' ? 'bg-primary-default/20' : 
                          notification.type === 'payment' ? 'bg-success-default/20' : 'bg-warning-default/20'
                        }`}>
                          {notification.type === 'appointment' ? <FiCalendar className="h-4 w-4" /> :
                           notification.type === 'payment' ? <FiDollarSign className="h-4 w-4" /> :
                           <FiAlertCircle className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{notification.message}</p>
                          <p className="text-xs text-text-tertiary">{notification.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarImage src={userQuery.data?.image ?? "https://github.com/shadcn.png"} alt="User" />
                    <AvatarFallback>{userQuery.data?.name??"User".charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userQuery.data?.name ?? "Admin"}</p>
                    <p className="text-xs text-text-tertiary">{userQuery.data?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FiUser className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FiSettings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-error-default">
                  <FiLogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
// Stats Card Component
// In DentalDashboard.tsx
const StatsCard = ({ title, value, trend, type, color }) => {
  const iconMap = {
    appointments: CalendarIcon,
    patients: UsersIcon,
    revenue: DollarSignIcon,
    satisfaction: ActivityIcon
  };
  const IconComponent = iconMap[type];

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="rounded-xl"
    >
      <Card className="bg-gradient-to-br from-background-card to-background-card/90 border border-border-subtle/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-h-[180px] w-full">
        <CardContent className="p-6">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-text-secondary/80 tracking-wide uppercase">
                  {title}
                </p>
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-primary/90">
                  {value}
                </h3>
              </div>
              <div className={`
                p-3 rounded-xl bg-opacity-15 backdrop-blur-sm
                ${color} ring-1 ring-${color}/20
                transform hover:scale-105 transition-transform duration-200
              `}>
                 {IconComponent && (
                <div className={`
                  p-3 rounded-xl bg-opacity-15 backdrop-blur-sm
                  ${color} ring-1 ring-${color}/20
                  transform hover:scale-105 transition-transform duration-200
                `}>
                  <IconComponent className={`h-6 w-6 ${color} opacity-90`} />
                </div>
              )}
              </div>
            </div>
            
            {trend && (
              <div className="flex items-center mt-4 space-x-2">
                <FiTrendingUp 
                  className={`${
                    trend.includes('+') 
                      ? 'text-success-default/90' 
                      : 'text-error-default/90'
                  } h-4 w-4`}
                />
                <span className={`
                  text-sm font-semibold
                  ${trend.includes('+') 
                    ? 'text-success-default/90' 
                    : 'text-error-default/90'}
                `}>
                  {trend}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Chart Components
const AppointmentChart = ({ data }) => {
  return (
    <Card className="bg-background-card border-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Appointments Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="appointmentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.colors.primary.default} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={theme.colors.primary.default} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border.default} />
              <XAxis 
                dataKey="month" 
                stroke={theme.colors.text.secondary}
                tick={{ fill: theme.colors.text.secondary }}
              />
              <YAxis 
                stroke={theme.colors.text.secondary}
                tick={{ fill: theme.colors.text.secondary }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.background.card,
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke={theme.colors.primary.default}
                fill="url(#appointmentGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const RevenueChart = ({ data }) => {
  return (
    <Card className="bg-background-card border-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border.default} />
              <XAxis 
                dataKey="month" 
                stroke={theme.colors.text.secondary}
                tick={{ fill: theme.colors.text.secondary }}
              />
              <YAxis 
                stroke={theme.colors.text.secondary}
                tick={{ fill: theme.colors.text.secondary }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.background.card,
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: '8px'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke={theme.colors.success.default}
                strokeWidth={2}
                dot={{ fill: theme.colors.success.default }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const ProcedureDistribution = ({ data }) => {
  const COLORS = [
    theme.colors.primary.default,
    theme.colors.success.default,
    theme.colors.warning.default,
    theme.colors.error.default,
    theme.colors.secondary.default
  ];

  return (
    <Card className="bg-background-card border-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Procedures Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.background.card,
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: '8px'
                }}
                formatter={(value, name, props) => [`${value} procedures`, props.payload.name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
// Recent Appointments Component
const RecentAppointments = ({ appointments }) => {
  return (
    <Card className="bg-background-card border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Appointments</CardTitle>
        <Button variant="outline" size="sm">
          <FiCalendar className="mr-2 h-4 w-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {appointments.map((appointment) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Card className="bg-background-tertiary border-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-text-secondary">{appointment.procedure}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          appointment.status === 'Confirmed' ? 'default' :
                          appointment.status === 'In Progress' ? 'warning' :
                          'secondary'
                        }
                      >
                        {appointment.status}
                      </Badge>
                      <p className="text-sm text-text-secondary mt-1">
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const DentalDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const userQuery = api.user.getMe.useQuery();
  const statsQuery = api.admin.getStats.useQuery();
  const statsData = statsQuery.data;

  // Dashboard View Component
  const DashboardView = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData?.map((stat) => (
          <StatsCard 
            key={stat.title}
            {...stat}
            type={stat.type}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentChart data={mockAnalytics.appointmentsByMonth} />
        <RevenueChart data={mockAnalytics.revenueByMonth} />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAppointments appointments={mockAppointments} />
        </div>
        <div>
          <ProcedureDistribution data={mockAnalytics.procedureTypes} />
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-background-card border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">Quick Actions</h3>
              <p className="text-sm text-text-secondary">Common tasks and operations</p>
            </div>
            <div className="flex space-x-2">
              <Button>
                <FiPlus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
              <Button variant="outline">
                <FiUser className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Appointments View Component
  const AppointmentsView = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-text-secondary">Manage your appointments and schedule</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <FiPlus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
          <Button variant="outline">
            <FiCalendar className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <h3 className="font-medium">Today's Schedule</h3>
              <div className="text-3xl font-bold">12</div>
              <p className="text-sm text-text-secondary">Appointments</p>
            </div>
          </CardContent>
        </Card>
        {/* Add more summary cards */}
      </div>

      <Card>
        <CardContent className="p-6">
          <RecentAppointments appointments={mockAppointments} />
        </CardContent>
      </Card>
    </div>
  );

  // Patients View Component
  const PatientsView = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-text-secondary">Manage your patient records</p>
        </div>
        <Button>
          <FiPlus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {mockPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border-b last:border-0">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-text-secondary">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <FiEdit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <FiEye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Analytics View Component
  const AnalyticsView = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-text-secondary">Business insights and performance metrics</p>
        </div>
        <Button variant="outline">
          <FiDownload className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={mockAnalytics.revenueByMonth} />
        <AppointmentChart data={mockAnalytics.appointmentsByMonth} />
        <ProcedureDistribution data={mockAnalytics.procedureTypes} />
        {/* Add more analytics components */}
      </div>
    </div>
  );

  // Messages View Component
  const MessagesView = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-text-secondary">Patient communications and notifications</p>
        </div>
        <Button>
          <FiMessageSquare className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
       <AdminMessagesPage/>
        </CardContent>
      </Card>
    </div>
  );

  // Settings View Component
  const SettingsView = () => {
   
    const adminList = api.settings.fetchAdmins.useQuery();
    
   
    const utils = api.useContext();
    const { data: settings = [], isLoading } = api.settings.getSettings.useQuery();
   
    const toggleSettingMutation = api.settings.toggleSetting.useMutation({
      onMutate: async ({ id, value }) => {
        await utils.settings.getSettings.cancel();
        
        const previousSettings = utils.settings.getSettings.getData();
   
        utils.settings.getSettings.setData(undefined, old => {
          if (!old) return previousSettings;
          return old.map(setting => 
            setting.id === id ? { ...setting, isSet: value } : setting
          );
        });
        toast({
          title: "Settings Updated",
     
        })
   
        return { previousSettings };
      },
   
      onError: (err, variables, context) => {
        if (context?.previousSettings) {
          utils.settings.getSettings.setData(undefined, context.previousSettings);
        }
      },
   
      onSettled: () => {
        utils.settings.getSettings.invalidate();
      },
    });
   
    const handleToggle = (id: number, currentValue: boolean) => {
      toggleSettingMutation.mutate({
        id,
        value: !currentValue
      });
    };
   
    const settingsConfig = [
      {
        id: 1,
        title: "Appointment Confirmation",
        description: "Send confirmation requests before finalizing appointments"
      },
      {
        id: 2, 
        title: "Automatic Email Notifications",
        description: "Send automated emails for appointments and reminders"
      }
    ];
    const removeAdminMutation = api.settings.removeAdmin.useMutation({
      onSuccess: () => {
       
       
        toast({
          title: "Success",
          description: "Admin access has been removed successfully",
          variant: "default",
        });
     
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
   
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure your practice preferences and manage admin access
          </p>
        </div>
   
        <div className="grid gap-8">
          {/* Practice Settings */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-ssblue/5 to-ssblue/10 rounded-t-xl">
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <FiSettings className="h-6 w-6 text-ssblue" />
                Practice Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {isLoading ? (
                <div>Loading settings...</div>
              ) : (
                <>
                  {settingsConfig.map(setting => (
                    <div 
                      key={setting.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200"
                    >
                      <div className="space-y-1">
                        <Label className="text-base font-medium">{setting.title}</Label>
                        <p className="text-sm text-muted-foreground">
                          {setting.description}
                        </p>
                      </div>
                      <Switch 
                        disabled={toggleSettingMutation.isLoading}
                        checked={settings.find(s => s.id === setting.id)?.isSet ?? false}
                        onCheckedChange={() => {
                          const currentSetting = settings.find(s => s.id === setting.id);
                          handleToggle(setting.id, currentSetting?.isSet ?? false);
                        }}
                      />
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
   
          {/* Admin Management */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="bg-gradient-to-r from-ssblue/5 to-ssblue/10 rounded-t-xl flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FiUsers className="h-6 w-6 text-ssblue" />
                <CardTitle className="text-2xl font-semibold">Admin Management</CardTitle>
              </div>
               <AddAdminDialog/>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {adminList.data?.map((admin) => (
                  <div 
                    key={admin.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="border-2 border-ssblue/20">
                        <AvatarFallback className="bg-ssblue/10 text-ssblue">
                          {admin.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{admin.name}</p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-ssblue/10 text-ssblue hover:bg-ssblue/20 transition-colors">
                        {admin.role}
                      </Badge>
                    
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:border-red-200"
                        onClick={() => removeAdminMutation.mutate({email: admin.email})}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
   };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'patients':
        return <PatientsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'messages':
        return <MessagesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <Sidebar 
        isOpen={isOpen} 
        toggleSidebar={() => setIsOpen(!isOpen)} 
        activeView={activeView}
        setActiveView={setActiveView}
      />
      
      <div className={`transition-all duration-200 ${isOpen ? 'ml-64' : 'ml-0'}`}>
        <Header 
          toggleSidebar={() => setIsOpen(!isOpen)} 
          notifications={mockNotifications}
          user={userQuery.data}
        />

        <main className="p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default DentalDashboard;