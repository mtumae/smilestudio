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

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const signUpMutation = api.user.signUp.useMutation({
    onSuccess: async (data) => {
      const result = await signIn("credentials", {
        email: email,
        password:password,
        phone:phoneNumber,
        callbackUrl: window.location.origin,
        redirect: false,
      })
      if (result?.error) {
        setError(result.error)
      } else if (result?.url) {
        router.push(result.url)
      }
    },
    onError: (error) => {
      setError(error.message)
    },
  })



  return (
    <div className={cn("align-content-center m-10", className)} {...props}>
      <Card className="overflow-hidden justify-center">
        <CardContent>
          <form className="p-6 md:p-8"   onSubmit={(e) => {
                                e.preventDefault(); 
                                 signUpMutation.mutate({ email, password, phone: phoneNumber }); 
                                }}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">Login to your Acme Inc account</p>
                {error && <p className="text-red-500">{error}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Phone Number</Label>
                <PhoneInput
                   value={phoneNumber}
                   onChange={setPhoneNumber}
                     international
                    defaultCountry="KE"
                   placeholder="Enter a phone number"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/api/auth/signin" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}