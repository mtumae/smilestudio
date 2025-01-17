"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { BsGoogle } from "react-icons/bs";
import Image from "next/image";
import { api } from "~/trpc/react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PhoneInput } from "~/app/_components/phonenumber";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const signUpMutation = api.user.signUp.useMutation({
    onSuccess: async () => {
      const result = await signIn("credentials", {
        email,
        password,
        phone: phoneNumber,
        callbackUrl: window.location.origin,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
      } else if (result?.url) {
        router.push(result.url);
      }
    },
    
    onError: (error) => setError(error.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !phoneNumber) {
      setError("All fields are required");
      return;
    }
    signUpMutation.mutate({ email, password, phone: phoneNumber });
  };

  const handleGoogleSignIn = () => {
    void signIn("google", { callbackUrl: "/" });
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
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="h-12 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-ssblue">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Sign up to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              variant="outline" 
              onClick={handleGoogleSignIn}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200 transition-colors duration-300"
            >
              <BsGoogle className="mr-2 h-5 w-5" /> Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">Or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-medium text-red-500 text-center bg-red-50 p-3 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
              <div>
                <Label className="text-gray-700">Email</Label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="bg-white border-gray-200 focus:border-ssblue focus:ring-ssblue" 
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700">Password</Label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password" 
                  className="bg-white border-gray-200 focus:border-ssblue focus:ring-ssblue" 
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700">Phone Number</Label>
                <PhoneInput
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  international
                  defaultCountry="KE"
                  className="bg-white border-gray-200 focus:border-ssblue focus:ring-ssblue"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-ssblue hover:bg-ssblue/90 text-white transition-colors duration-300"
              >
                {signUpMutation.isPending ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-gray-600">
              Already have an account?{" "}
              <Link 
                href="/api/auth/signin" 
                className="font-medium text-ssblue hover:text-ssblue/80 transition-colors duration-300"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}