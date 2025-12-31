"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { servicesNavData } from "@/data/servicesNavData";
import { addContactMessage } from "@/lib/firebase/firestoreService";
import { Loader2, ArrowRight } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  serviceOfInterest: z.string().optional(),
  subject: z.string().min(5, "Subject required"),
  message: z.string().min(10, "Message too short").max(1000),
});

export default function ContactForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      serviceOfInterest: "_none_",
      subject: "",
      message: "",
    },
  });

  // Sync with URL params (e.g., from the "Hire Us" buttons on services)
  useEffect(() => {
    const service = searchParams.get("service");
    const promo = searchParams.get("promo");
    const selected = servicesNavData.find((s) => s.id === service);

    if (selected || promo) {
      form.reset({
        ...form.getValues(),
        serviceOfInterest: selected ? selected.id : "_none_",
        subject: selected ? `Project Inquiry: ${selected.title}` : "",
        message: promo
          ? `I am interested in the [${promo}] promotion.\n\n`
          : "",
      });
    }
  }, [searchParams, form]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await addContactMessage(data);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you shortly.",
      });
      form.reset();
    } catch (e) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["name", "email"].map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">
                    {name === "name" ? "Full Name" : "Email Address"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        name === "name" ? "Jane Doe" : "jane@example.com"
                      }
                      {...field}
                      className="rounded-xl border-slate-200 focus:ring-[#6B46C1]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="serviceOfInterest"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-semibold">
                Service Needed
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="What are you looking for?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="_none_">General Inquiry</SelectItem>
                  {servicesNavData.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-semibold">
                Subject
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Project Scope / Question"
                  {...field}
                  className="rounded-xl border-slate-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-semibold">
                Project Details
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your goals..."
                  {...field}
                  rows={4}
                  className="rounded-2xl border-slate-200 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6B46C1] hover:bg-[#5a3aaa] text-white rounded-full h-14 font-bold shadow-lg shadow-purple-500/20"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              Send Message <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
