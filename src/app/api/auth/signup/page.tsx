"use client";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { api } from "~/trpc/react";
import { PhoneInput } from "~/app/_components/phonenumber";
import { FaGoogle } from "react-icons/fa6";
import Link from "next/link";

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [step, setStep] = useState("initial"); // "initial" | "phone"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
 
  const signUpMutation = api.user.signUp.useMutation({
    onSuccess: async (data) => {
      const result = await signIn("credentials", {
        email, password, phone: phoneNumber,
        callbackUrl: window.location.origin,
        redirect: false,
      })
      if (result?.error) setError(result.error)
      else if (result?.url) router.push(result.url)
    },
    onError: (error) => setError(error.message),
  })
 
  const handleGoogleSignIn = () => {
    setStep("phone");
  }
 
  const handlePhoneSubmit = async  (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError("Phone number is required");
      return;
    }
    await  signIn("google", { callbackUrl: "/" });
  }
 
  return (
    <div className={cn("max-w-md mx-auto mt-10", className)} {...props}>
      <Card className="bg-white shadow-2xl rounded-2xl">
        <CardContent className="p-10">
          {step === "initial" ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-ssblue">Welcome</h1>
                <p className="text-gray-600 mt-2">Sign in to continue</p>
              </div>
 
              <Button
                onClick={handleGoogleSignIn}
                className="w-full bg-white border-2 text-gray-800 hover:bg-gray-50 mb-6"
              >
                <FaGoogle className="mr-2 text-ssblue" />
                Continue with Google
              </Button>
 
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>
 
              <form onSubmit={(e) => {
                e.preventDefault();
                signUpMutation.mutate({ email, password, phone: phoneNumber });
              }}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <PhoneInput
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      international
                      defaultCountry="KE"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-ssblue">Sign In</Button>
                </div>
              </form>
              <div className="relative my-6">
             <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t" />
             </div>
             <div className="relative flex justify-center">
               <span className="bg-white px-2 text-gray-500">Or</span>
             </div>
           </div>

           <div className="text-center">
             <p className="text-gray-600">Already have an account?</p>
             <Link href="/api/auth/signin" className="text-ssblue hover:text-ssblue/80 font-medium">
               Sign in to your account
             </Link>
           </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-ssblue">One Last Step</h2>
                <p className="text-gray-600 mt-2">Please provide your phone number</p>
              </div>
 
              <form onSubmit={handlePhoneSubmit}>
                <div className="space-y-4">
                  <PhoneInput
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    international
                    defaultCountry="KE"
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full bg-ssblue">Continue</Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
 }