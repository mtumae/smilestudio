
"use client";

import { useState } from "react";
import { use } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ResetPassword({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const resetPassword = api.user.resetPassword.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your password has been reset successfully",
      });
      router.push("/api/auth/signin");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    resetPassword.mutate({
      uuid: token,
      newPassword,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] px-4"
      >
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-ssblue">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your new password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="bg-white border-gray-200 focus:border-ssblue focus:ring-ssblue"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="bg-white border-gray-200 focus:border-ssblue focus:ring-ssblue"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-ssblue hover:bg-ssblue/90 text-white"
                disabled={resetPassword.isPending}
              >
                {resetPassword.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}