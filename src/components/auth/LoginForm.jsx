"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail } from "@/lib/firebase/auth";

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { error, user } = await signInWithEmail(data.email, data.password);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials.",
        variant: "destructive",
      });
    } else if (user) {
      if (!user.emailVerified) {
        toast({
          title: "Verify Email",
          description: "Please check your inbox to verify your account.",
        });
        return;
      }
      toast({ title: "Welcome Back!" });
      router.push(searchParams.get("redirect") || "/dashboard");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-semibold">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="h-12 rounded-xl border-slate-200 focus:ring-[#6B46C1]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-slate-700 font-semibold">
                  Password
                </FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#6B46C1] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="h-12 rounded-xl border-slate-200 pr-16 focus:ring-[#6B46C1]"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-[#6B46C1]"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="pt-2 space-y-4">
          <Button
            type="submit"
            className="w-full h-12 bg-[#6B46C1] hover:bg-[#5a3aaa] text-white rounded-full font-bold shadow-lg shadow-purple-500/20"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </Button>

          <p className="text-sm text-center text-slate-500">
            New to High-ER?{" "}
            <Link
              href="/signup"
              className="text-[#6B46C1] font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
