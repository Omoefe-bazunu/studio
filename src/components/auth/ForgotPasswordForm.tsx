
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordReset } from '@/lib/firebase/auth';
import { Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageSent, setMessageSent] = React.useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setMessageSent(false);
    const { error } = await sendPasswordReset(data.email);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Password Reset Failed",
        description: error.message || "Could not send password reset email. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, you'll receive instructions to reset your password.",
      });
      setMessageSent(true);
      form.reset();
    }
  };

  if (messageSent) {
    return (
      <div className="text-center space-y-4">
        <p className="text-foreground">
          Password reset instructions have been sent to your email address (if it's associated with an account). Please check your inbox and spam folder.
        </p>
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/login">Back to Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email address</FormLabel>
              <FormControl>
                <Input id="email" type="email" autoComplete="email" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
        </Button>
        <div className="text-sm text-center">
          <Link href="/login" className="font-medium text-accent hover:text-accent/80">
            Back to Sign In
          </Link>
        </div>
      </form>
    </Form>
  );
}
