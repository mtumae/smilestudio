// ~/app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const sendResetLink = api.user.sendResetLink.useMutation({
    onSuccess: () => {
      setIsCodeSent(true);
      toast({
        title: "Reset Link Sent",
        description: "Please check your email to reset your password",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      sendResetLink.mutate({ email });
    } else {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
    }
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
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isCodeSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-white border-gray-200 focus:border-ssblue focus:ring-ssblue"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-ssblue hover:bg-ssblue/90 text-white"
                  disabled={sendResetLink.isPending}
                >
                  {sendResetLink.isPending ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Reset link sent! Please check your email.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-gray-600">
              Remember your password?{" "}
              <Link 
                href="/api/auth/signin"
                className="font-medium text-ssblue hover:text-ssblue/80 transition-colors duration-300"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}