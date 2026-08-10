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
} from "lucide-react";
import { signUpWithEmail } from "@/lib/firebase/auth"; // Adjust path to your auth functions

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear error when the user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user, error: authError } = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.name,
      );

      if (authError) throw authError;

      if (user) {
        // Redirect to dashboard upon successful account creation
        router.push("/dashboard");
      }
    } catch (err) {
      // Handle Firebase specific error codes gracefully
      let errorMsg = "An error occurred during sign up. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        errorMsg = "An account with this email address already exists.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "Your password must be at least 6 characters long.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Please enter a valid email address.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Subtle Background Glow - Using the Orange brand color for the signup page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-[#FF8C38]/10 blur-[120px] pointer-events-none" />

      {/* Brand Logo Header */}
      <Link
        href="/"
        className="mb-8 relative z-10 flex items-center gap-1.5 group"
      >
        <span className="font-heading text-2xl md:text-3xl font-extrabold tracking-tighter text-foreground transition-transform group-hover:scale-[1.02]">
          HIGH-ER
        </span>
        <span className="font-heading text-2xl md:text-3xl font-extrabold tracking-tighter text-primary">
          ENTERPRISES
        </span>
      </Link>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-[2rem] shadow-xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            Create an Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up to start accelerating your digital growth.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Create a Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 group mt-2 shadow-[0_0_15px_rgba(107,70,193,0.2)]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Navigation to Sign In */}
        <div className="mt-8 text-center pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-bold text-foreground hover:text-primary transition-colors focus:outline-none"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
