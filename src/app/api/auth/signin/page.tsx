"use client";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa6";

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: window.location.origin,
    });
    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else if (result?.url) {
      router.push(result.url);
    }
  };
 
  return (
    <div className={cn("max-w-md mx-auto mt-10", className)} {...props}>
      <Card className="bg-white shadow-2xl rounded-2xl border-0">
        <CardContent className="p-10">
          <div className="text-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={180}
              height={180}
              className="mx-auto mb-8 hover:scale-105 transition-transform duration-300"
            />
            <h1 className="text-4xl font-bold text-ssblue mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-gray-600 text-lg">Were glad to see you again</p>
          </div>
 
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full mt-10 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-6 shadow-md border-2 transition-all duration-300 hover:shadow-lg"
          >
            <FaGoogle className="mr-3 text-ssblue text-xl" />
            <span className="text-lg">Continue with Google</span>
          </Button>
 
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 text-base">Or continue with email</span>
            </div>
          </div>
 
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-center text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-ssblue text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 transition-all duration-300 focus:ring-2 focus:ring-ssblue"
                required
              />
            </div>
 
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-ssblue text-sm font-medium">
                  Password
                </Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-ssblue hover:text-ssblue/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4 transition-all duration-300 focus:ring-2 focus:ring-ssblue"
                required
              />
            </div>
 
            <Button 
              type="submit" 
              className="w-full bg-ssblue hover:bg-ssblue/90 text-lg py-6 transition-all duration-300"
            >
              Sign In
            </Button>
          </form>
 
          <p className="text-center text-gray-600 mt-8 text-sm">
            Dont have an account?{" "}
            <Link 
              href="/api/auth/signup" 
              className="text-ssblue font-medium hover:text-ssblue/80 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
 }