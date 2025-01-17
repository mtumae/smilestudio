"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { toast } from "~/hooks/use-toast";
import {
  Users,
  Settings2,
  PlusCircle,
  Trash2,
  Mail,
  Phone,
  User,
  Shield,
} from "lucide-react";
import { PhoneInput } from "~/app/_components/phonenumber";

type Setting = {
  id: number;
  key: string;
  description: string;
  isSet: boolean | null;
};

type AdminData = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const [newAdminData, setNewAdminData] = useState<AdminData>({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [existingUserEmail, setExistingUserEmail] = useState("");
  const [optimisticSettings, setOptimisticSettings] = useState<Setting[]>([]);

  const admins = api.settings.fetchAdmins.useQuery();
  const settings = api.settings.getSettings.useQuery<Setting[]>();

  useEffect(() => {
    if (settings.data) {
      setOptimisticSettings(settings.data);
    }
  }, [settings.data]);

  const addAdmin = api.settings.addAdmin.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Admin added successfully",
      });
      void admins.refetch();
      setNewAdminData({ email: "", password: "", name: "", phone: "" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message ?? "Failed to add admin",
      });
    },
  });

  const updateAdmin = api.settings.updateAdmin.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User was successfully made an admin",
      });
      void admins.refetch();
      setExistingUserEmail("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message ?? "Failed to update user to admin",
      });
    },
  });

  const removeAdmin = api.settings.removeAdmin.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Admin removed successfully",
      });
      void admins.refetch();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message ?? "Failed to remove admin",
      });
    },
  });

  const toggleSetting = api.settings.toggleSetting.useMutation({
    onMutate: async (newSetting) => {
      const previousSettings = optimisticSettings;

      setOptimisticSettings(current =>
        current.map(setting =>
          setting.id === newSetting.id
            ? { ...setting, isSet: !setting.isSet }
            : setting
        )
      );

      return { previousSettings };
    },
    onError: (err, newSetting, context) => {
      setOptimisticSettings(context?.previousSettings ?? []);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update setting. Please try again.",
      });
    },
    onSettled: () => {
      void settings.refetch();
    },
  });

  const renderAdminForm = () => (
    <Card className="border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-ssblue" />
          Add Administrator
        </h2>

        <Tabs defaultValue="new" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="new">
              New User
            </TabsTrigger>
            <TabsTrigger value="existing">
              Existing User
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="grid gap-6 max-w-2xl"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    value={newAdminData.name}
                    onChange={(e) => setNewAdminData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10"
                    placeholder="Enter admin's full name"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="email"
                    value={newAdminData.email}
                    onChange={(e) => setNewAdminData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    placeholder="admin@example.com"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter secure password"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <PhoneInput
                    value={newAdminData.phone}
                    onChange={(value) => setNewAdminData(prev => ({ ...prev, phone: value }))}
                    international
                    defaultCountry="KE"
                    className="pl-10"
                  />
                </div>
              </motion.div>

              <Button
                onClick={() => addAdmin.mutate(newAdminData)}
                className="bg-ssblue hover:bg-blue-600 text-white"
                disabled={addAdmin.isPending}
              >
                {addAdmin.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  "Add New Administrator"
                )}
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="existing">
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="grid gap-6 max-w-2xl"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <Label>User Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="email"
                    value={existingUserEmail}
                    onChange={(e) => setExistingUserEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter existing user's email"
                  />
                </div>
              </motion.div>

              <Button
                onClick={() => updateAdmin.mutate({ email: existingUserEmail })}
                className="bg-ssblue hover:bg-blue-600 text-white"
                disabled={updateAdmin.isPending}
              >
                {updateAdmin.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Make Admin"
                )}
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  const renderAdminList = () => (
    <Card className="border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-ssblue" />
          Current Administrators
        </h2>
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {admins.data?.map((admin) => (
            <motion.div
              key={admin.id}
              variants={itemVariants}
              className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm"
              layout
            >
              <div className="space-y-1">
                <p className="font-medium">{admin.name}</p>
                <p className="text-sm text-gray-500">{admin.email}</p>
                {admin.phonenumber && (
                  <p className="text-sm text-gray-500">{admin.phonenumber}</p>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeAdmin.mutate({ email: admin.email })}
                disabled={removeAdmin.isPending}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );

  const renderSettings = () => (
    <Card className="border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {optimisticSettings.map((setting) => (
            <motion.div
              key={setting.id}
              variants={itemVariants}
              className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm"
              layout
            >
              <div className="space-y-1">
                <p className="font-medium">{setting.key}</p>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={setting.isSet ?? false}
                  onCheckedChange={() => toggleSetting.mutate({ id: setting.id })}
                  disabled={toggleSetting.isPending}
                  className="data-[state=checked]:bg-ssblue"
                />
                {toggleSetting.isPending && toggleSetting.variables?.id === setting.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-4 h-4"
                  >
                    <div className="w-4 h-4 border-2 border-ssblue/30 border-t-ssblue rounded-full animate-spin" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ssblue to-blue-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            System Settings
          </motion.h1>
          <p className="text-gray-600 mt-2">Manage your system configuration and administrators</p>
        </div>

        <Tabs defaultValue="admins" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Administrators
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admins">
            <div className="space-y-6">
              {renderAdminForm()}
              {renderAdminList()}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            {optimisticSettings.length > 0 ? (
              renderSettings()
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-2 border-ssblue/30 border-t-ssblue rounded-full animate-spin" />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}