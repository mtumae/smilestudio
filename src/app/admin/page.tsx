"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FiSettings, FiBell, FiUser, FiLogOut, FiCalendar, FiDollarSign, FiUsers, FiActivity, FiPieChart, FiEdit, FiEye, FiCheckCircle, FiDownload, FiMenu, FiGrid, FiClock, FiTrendingUp, FiAlertCircle, FiSearch, FiFilter, FiPlus, FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
import Image from 'next/image';

// Mock Data
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
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { icon: FiGrid, label: 'Dashboard', path: '/', badge: null },
    { icon: FiCalendar, label: 'Appointments', path: '/appointments', badge: '3' },
    { icon: FiUsers, label: 'Patients', path: '/patients', badge: null },
    { icon: FiDollarSign, label: 'Billing', path: '/billing', badge: '2' },
    { icon: FiPieChart, label: 'Analytics', path: '/analytics', badge: null },
    { icon: FiMessageSquare, label: 'Messages', path: '/messages', badge: '5' },
    { icon: FiSettings, label: 'Settings', path: '/settings', badge: null },
  ];

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      className="fixed left-0 top-0 h-full w-64 bg-background-secondary border-r border-border-default z-50"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Image src="/dental-logo.svg" alt="Dental Dashboard" width={40} height={40} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent">
              DentalCare Pro
            </h1>
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
        
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left hover:bg-background-tertiary group relative"
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.label}</span>
              {item.badge && (
                <Badge variant="default" className="absolute right-2">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        <Separator className="my-6" />

        <div className="pt-4">
          <Card className="bg-background-tertiary border-none">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/doctor-avatar.jpg" alt="Dr. Sarah Wilson" />
                  <AvatarFallback>SW</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Dr. Sarah Wilson</p>
                  <p className="text-xs text-text-secondary">Lead Dentist</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

// Header Component
const Header = ({ toggleSidebar, notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

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
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
              <Input 
                placeholder="Search patients, appointments..." 
                className="pl-10 w-[300px] bg-background-tertiary border-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <FiBell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-default text-xs flex items-center justify-center">
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
                    <AvatarImage src="/doctor-avatar.jpg" alt="Dr. Sarah Wilson" />
                    <AvatarFallback>SW</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Dr. Sarah Wilson</p>
                    <p className="text-xs text-text-tertiary">sarah.wilson@dentalcare.com</p>
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
const StatsCard = ({ title, value, trend, icon: Icon, color }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="rounded-xl"
    >
      <Card className="bg-background-card border-none hover:bg-background-tertiary transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">{title}</p>
              <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
              {trend && (
                <div className="flex items-center mt-2">
                  <FiTrendingUp className={`mr-1 ${trend.includes('+') ? 'text-success-default' : 'text-error-default'}`} />
                  <span className={`text-sm ${trend.includes('+') ? 'text-success-default' : 'text-error-default'}`}>
                    {trend}
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-full bg-opacity-20 ${color}`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
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

  const statsData = [
    {
      title: "Today's Appointments",
      value: "12",
      trend: "+20% vs. last week",
      icon: FiCalendar,
      color: "text-primary-default"
    },
    {
      title: "Total Patients",
      value: "1,234",
      trend: "+5% vs. last month",
      icon: FiUsers,
      color: "text-success-default"
    },
    {
      title: "Monthly Revenue",
      value: "$52,000",
      trend: "+15% vs. last month",
      icon: FiDollarSign,
      color: "text-warning-default"
    },
    {
      title: "Satisfaction Rate",
      value: "98%",
      trend: "+2% vs. last month",
      icon: FiActivity,
      color: "text-error-default"
    }
  ];

  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
      
      <div className={`transition-all duration-200 ${isOpen ? 'ml-64' : 'ml-0'}`}>
        <Header 
          toggleSidebar={() => setIsOpen(!isOpen)} 
          notifications={mockNotifications}
        />

        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <StatsCard key={index} {...stat} />
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
        </main>
      </div>
    </div>
  );
};

export default DentalDashboard;