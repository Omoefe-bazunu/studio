import React from "react";
import { Scale, Mail } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | High-ER Enterprises",
  description:
    "Read the terms, conditions, and legal guidelines governing the use of High-ER Enterprises' digital services and products.",
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20 md:pt-36 md:pb-28 relative overflow-hidden">
      {/* Background Ambient Glows & Pattern */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/[0.05] rounded-full blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black_20%,transparent_75%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-primary">
            Terms of Service
          </span>

          <h1 className="font-sans text-4xl md:text-5xl mt-4 font-bold tracking-tight text-foreground mb-4">
            Terms &{" "}
            <span className="font-accent italic font-normal text-[#FF8C38]">
              Conditions
            </span>
          </h1>

          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Last Updated: August 31, 2026
          </p>
        </div>

        {/* Legal Document Container */}
        <div className="bg-card border border-border/80 rounded-2xl p-8 md:p-12 shadow-sm space-y-10">
          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-foreground">
              1. Agreement to Terms
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              By accessing or using High-ER Enterprises' website and digital
              services, you agree to be bound by these Terms and Conditions. If
              you disagree with any part of these terms, you may not access or
              utilize our services.
            </p>
          </section>

          <hr className="border-border/60" />

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-foreground">
              2. Services & Project Agreements
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We provide digital solutions including web application
              development, mobile app development, paid acquisition management,
              and AI workflow automation. Specific project scopes, timelines,
              and deliverables are governed by individual service agreements
              executed between High-ER Enterprises and the client.
            </p>
          </section>

          <hr className="border-border/60" />

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-foreground">
              3. Intellectual Property
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Unless explicitly stated in a signed service agreement, all custom
              source code, designs, and digital marketing assets produced by
              High-ER Enterprises remain our intellectual property until full
              contractual payment has been received and final IP transfer is
              documented.
            </p>
          </section>

          <hr className="border-border/60" />

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-foreground">
              4. Payment Terms
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Clients agree to adhere strictly to the payment schedules outlined
              in their respective project statements of work or invoices.
              High-ER Enterprises reserves the right to suspend active
              development, hosting, or campaign management if payments are
              overdue.
            </p>
          </section>

          <hr className="border-border/60" />

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-foreground">
              5. Limitation of Liability
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, High-ER Enterprises shall
              not be held liable for any indirect, incidental, consequential, or
              special damages arising out of or in any way related to your use
              of our digital products, infrastructure, or marketing campaigns.
            </p>
          </section>

          <hr className="border-border/60" />

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-foreground">
              6. Governing Law
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              These terms are governed by and interpreted in accordance with the
              laws of the Federal Republic of Nigeria. You irrevocably submit to
              the jurisdiction of the competent courts located in Nigeria for
              the resolution of any legal disputes.
            </p>
          </section>

          <hr className="border-border/60" />

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-foreground">
              7. Contact Us
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              For any questions regarding these Terms & Conditions, please reach
              out to our legal and operations team at{" "}
              <a
                href="mailto:info@higherenterprises.co.uk"
                className="inline-flex items-center text-primary font-medium hover:underline"
              >
                info@higherenterprises.co.uk
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
