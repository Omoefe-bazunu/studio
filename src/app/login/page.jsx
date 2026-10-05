"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { signInWithEmail, signUpWithEmail } from "@/lib/firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { user, error: authError } = await signInWithEmail(
          formData.email,
          formData.password,
        );
        if (authError) throw authError;
        if (user) router.push("/dashboard");
      } else {
        const { user, error: authError } = await signUpWithEmail(
          formData.email,
          formData.password,
          formData.name,
        );
        if (authError) throw authError;
        if (user) router.push("/dashboard");
      }
    } catch (err) {
      let errorMsg = "An error occurred. Please try again.";
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        errorMsg = "Invalid email or password credentials.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMsg = "An account with this email already exists.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "Password should be at least 6 characters.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-24 relative overflow-hidden">
      {/* Background Ambient Glow & Dot Matrix */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-primary/10 blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_20%,transparent_75%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Brand Header */}
      <Link
        href="/"
        className="mb-8 relative z-10 flex items-center gap-1.5 group transition-transform hover:scale-[1.01]"
      >
        <span className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
          HIGH-ER
        </span>
        <span className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-[#FF8C38]">
          ENTERPRISES
        </span>
      </Link>

      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-card/90 backdrop-blur-md border border-border/80 p-8 md:p-10 rounded-2xl shadow-xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-sans text-2xl font-bold text-foreground tracking-tight">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
            {isLogin
              ? "Enter your credentials to access your dashboard."
              : "Sign up to start accelerating your digital growth."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-destructive font-medium leading-normal">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field (Sign Up Only) */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              isLogin ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
            }`}
          >
            <div className="space-y-1.5 mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="jane@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-medium text-sm py-3 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.99] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 group mt-2 shadow-md shadow-primary/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {isLogin ? "Sign In" : "Sign Up"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center pt-5 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setFormData({ name: "", email: "", password: "" });
              }}
              className="font-bold text-foreground hover:text-primary transition-colors focus:outline-none ml-1"
            >
              {isLogin ? "Create one" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
