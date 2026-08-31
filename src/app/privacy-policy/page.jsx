import React from "react";
import { ShieldCheck, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | High-ER Enterprises",
  description:
    "Learn how High-ER Enterprises collects, uses, and protects your data.",
};

export default function PrivacyPolicy() {
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
          <span className="font-sans mt-4 text-xs font-bold tracking-widest uppercase text-primary">
            Legal & Compliance
          </span>

          <h1 className="font-sans text-4xl mt-4 md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Privacy{" "}
            <span className="font-accent italic font-normal text-[#FF8C38]">
              Policy
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
              1. Introduction
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Welcome to High-ER Enterprises. We value your privacy and are
              committed to protecting your personal data. This policy outlines
              how we handle information when you visit our website or use our
              services.
            </p>
          </section>

          <hr className="border-border/60" />

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-foreground">
              2. Information We Collect
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We collect information that you provide directly to us through
              contact forms, account registration, or project inquiries. This
              may include your name, email address, phone number, and project
              details.
            </p>
          </section>

          <hr className="border-border/60" />

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-foreground">
              3. How We Use Your Information
            </h2>
            <ul className="space-y-2.5 text-sm md:text-base text-muted-foreground list-disc pl-5">
              <li>To provide, operate, and maintain our digital services.</li>
              <li>
                To notify you about updates, project milestones, or service
                changes.
              </li>
              <li>To deliver direct client and technical support.</li>
              <li>
                To analyze usage metrics and optimize website performance.
              </li>
            </ul>
          </section>

          <hr className="border-border/60" />

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-foreground">
              4. Cookies and Advertising Technologies
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to enhance your
              experience. Our site may use services such as Google AdSense to
              serve relevant advertisements. Google utilizes cookies to serve
              ads based on prior visits to our site or other websites. You may
              opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Google Ads Settings
              </a>
              .
            </p>
          </section>

          <hr className="border-border/60" />

          <section className="space-y-3">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-foreground">
              5. Contact Us
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              If you have any questions or concerns regarding this Privacy
              Policy, please email our team at{" "}
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
