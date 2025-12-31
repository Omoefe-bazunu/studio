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
import { Eye, EyeOff, Loader2, UserCircle } from "lucide-react";

// Validation Schema
const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "Please enter your full name." }),
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

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { error } = await signUpWithEmail(
      data.email,
      data.password,
      data.name
    );
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
        description: `Welcome ${data.name}! Please check your email to verify.`,
      });
      router.push("/login");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-bold uppercase text-[10px] tracking-widest">
                Full Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Omoefe Bazunu"
                  className="h-12 rounded-lg border-slate-200 focus:ring-[#6B46C1]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-bold uppercase text-[10px] tracking-widest">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="h-12 rounded-lg border-slate-200 focus:ring-[#6B46C1]"
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
              <FormLabel className="text-slate-700 font-bold uppercase text-[10px] tracking-widest">
                Create Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    className="h-12 rounded-lg border-slate-200 pr-12 focus:ring-[#6B46C1]"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#6B46C1]"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-bold uppercase text-[10px] tracking-widest">
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="h-12 rounded-lg border-slate-200 focus:ring-[#6B46C1]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full h-14 bg-[#6B46C1] hover:bg-[#5a3aaa] text-white rounded-full font-bold shadow-xl shadow-purple-500/10"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-sm text-center text-slate-500 mt-6 font-medium">
            Member already?{" "}
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
