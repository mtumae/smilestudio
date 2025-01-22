import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Tooltip
} from "recharts";
import { 
  CalendarCheck, 
  Users, 
  StarIcon,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
      <p className="text-sm">{`Total: ${payload[0]?.value}`}</p>
    </div>
  );
};

export function DentalAnalyticsDashboard() {
  const { data: analyticsData } = api.analytics.getDashboardStats.useQuery();

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="text-center mb-8">
        <motion.h1 
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ssblue to-blue-600 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Practice Analytics
        </motion.h1>
        <p className="text-gray-600 mt-2">Track your dental practice performance</p>
      </div>

      {/* Stats Grid */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        <Card className="border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Appointments</CardTitle>
            <CalendarCheck className="h-4 w-4 text-ssblue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.stats.monthlyAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData?.stats.appointmentGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <Users className="h-4 w-4 text-ssblue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.stats.newPatients}</div>
            <p className="text-xs text-muted-foreground">New patients this month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Treatments</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-ssblue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.stats.completedAppointments}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
            <StarIcon className="h-4 w-4 text-ssblue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.stats.satisfactionRating}/5</div>
            <p className="text-xs text-muted-foreground">Average rating</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts & Recent Appointments */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analyticsData?.monthlyData}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                />
                <Bar
                  dataKey="total"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-ssblue"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <p className="text-sm text-muted-foreground">
              You completed {analyticsData?.stats.completedAppointments} treatments this month.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {analyticsData?.recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarImage src="/avatars/01.png" alt={apt.name} />
                      <AvatarFallback>{apt.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">{apt.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{apt.email}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-700">
                      {apt.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}