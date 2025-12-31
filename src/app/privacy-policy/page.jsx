import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Privacy Policy | High-ER Enterprises",
  description:
    "Learn how High-ER Enterprises collects, uses, and protects your data.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="bg-slate-50 min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 shadow-xl border border-slate-100">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-slate-400 mb-8 uppercase tracking-widest text-xs font-bold">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#6B46C1]">
                1. Introduction
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Welcome to High-ER Enterprises. We value your privacy and are
                committed to protecting your personal data. This policy outlines
                how we handle information when you visit our website or use our
                services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#6B46C1]">
                2. Information We Collect
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We collect information that you provide directly to us through
                contact forms, account registration, or project inquiries. This
                may include your name, email address, phone number, and project
                details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#6B46C1]">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-5 text-slate-600 space-y-2">
                <li>To provide and maintain our services.</li>
                <li>To notify you about changes to our services.</li>
                <li>To provide customer support.</li>
                <li>To gather analysis so that we can improve our website.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#6B46C1]">
                4. Cookies and Google AdSense
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We use cookies to enhance your experience. Our site may use
                Google AdSense to serve ads. Google uses cookies to serve ads
                based on a user's prior visits to our website or other websites.
                You may opt out of personalized advertising by visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  className="text-[#6B46C1] underline"
                >
                  Ads Settings
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#6B46C1]">
                5. Contact Us
              </h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us at <strong>info@higher.com.ng</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
