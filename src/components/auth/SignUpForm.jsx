"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { signUpWithEmail } from "@/lib/firebase/auth";

// Validation Schema
const signUpSchema = z
  .object({
    email: z.string().email({ message: "Enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { error } = await signUpWithEmail(data.email, data.password);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "Try again later.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created!",
        description: "Check your email for a verification link.",
      });
      router.push("/login");
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
              <FormLabel className="text-slate-700 font-semibold">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    className="h-12 rounded-xl border-slate-200 pr-16 focus:ring-[#6B46C1]"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-[#6B46C1]"
                  >
                    {showPass ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-semibold">
                Confirm Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    className="h-12 rounded-xl border-slate-200 pr-16 focus:ring-[#6B46C1]"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-[#6B46C1]"
                  >
                    {showConfirm ? "HIDE" : "SHOW"}
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
            className="w-full h-12 bg-[#6B46C1] hover:bg-[#5a3aaa] text-white rounded-full font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          <p className="text-sm text-center text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#6B46C1] font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
