"use client";

import { useState } from "react";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, CheckCircle2 } from "lucide-react";

export default function BookCallPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "bookings"), {
        ...form,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      await fetch("/api/send-booking-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        service: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-sans text-3xl font-bold tracking-tight mb-3">
            Booking received
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you! We've received your request and will get back to you
            shortly to confirm the time. Check your inbox or spam folder for a
            confirmation message that we received your request.
          </p>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11"
          >
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#0F0A1F] text-white border-t border-white/5 flex items-center text-primary-foreground py-12 md:py-16">
        <div className="container flex items-center flex-col mx-auto gap-6 px-6 mt-8 max-w-6xl">
          <nav className="flex items-center text-center gap-2 text-sm text-primary-foreground/70 mt-4">
            <Link
              href="/"
              className="hover:text-primary-foreground text-center transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary-foreground">Book a call</span>
          </nav>

          <h1 className="font-sans text-4xl md:text-5xl font-bold tracking-tight">
            Book a{" "}
            <span className="font-accent italic font-normal text-[#FF8C38]">
              call
            </span>
          </h1>
          <p className="text-primary-foreground/80 text-center text-lg max-w-xl">
            Let's talk about your projects, or challenges, and how we can help
            you fix it. Fill the form and we'll get back to you.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  className="rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label>What do you need help with? *</Label>
                <Select
                  value={form.service}
                  onValueChange={(value) =>
                    setForm({ ...form, service: value })
                  }
                  required
                >
                  <SelectTrigger className="rounded-md">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website-saas">Website & SaaS</SelectItem>
                    <SelectItem value="automation">AI automation</SelectItem>
                    <SelectItem value="paid-ad">Paid ads</SelectItem>
                    <SelectItem value="other">Something else</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred date</Label>
                <Input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange}
                  className="rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred time</Label>
                <Input
                  id="preferredTime"
                  name="preferredTime"
                  type="time"
                  value={form.preferredTime}
                  onChange={handleChange}
                  className="rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Anything else you'd like us to know?
              </Label>
              <Textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Share a bit about your situation..."
                className="rounded-md"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 font-medium"
            >
              {loading ? "Submitting…" : "Submit booking request"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
