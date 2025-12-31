import * as React from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Up - HIGH-ER HEnterprises",
  description: "Create your HIGH-ER Hub account.",
};

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Sign up to HIGH-ER Enterprises."
    >
      <React.Suspense
        fallback={
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Loading form...</p>
          </div>
        }
      >
        <SignUpForm />
      </React.Suspense>
    </AuthLayout>
  );
}
