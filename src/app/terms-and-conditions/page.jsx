import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Terms and Conditions | High-ER Enterprises",
  description:
    "Read the terms, conditions, and legal guidelines governing the use of High-ER Enterprises' digital services and products.",
};

export default function TermsAndConditions() {
  return (
    <>
      <Header />
      <div className="bg-slate-50 min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 shadow-xl border border-slate-100">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 mb-8 uppercase tracking-widest text-xs font-bold">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#6B46C1]">
                1. Agreement to Terms
              </h2>
              <p className="text-slate-600 leading-relaxed">
                By accessing or using High-ER Enterprises' website and services,
                you agree to be bound by these Terms and Conditions. If you
                disagree with any part of these terms, you may not access our
                services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#6B46C1]">
                2. Services & Project Agreements
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We provide digital solutions including web development, mobile
                app development, and SaaS products. Specific project scope,
                timelines, and deliverables will be governed by individual
                service agreements signed between High-ER Enterprises and the
                client.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#6B46C1]">
                3. Intellectual Property
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Unless otherwise stated in a signed contract, all original code,
                designs, and marketing materials produced by High-ER Enterprises
                remain our intellectual property until full payment has been
                received and the transfer of ownership is finalized.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#6B46C1]">
                4. Payment Terms
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Clients agree to adhere to the payment schedule outlined in
                their respective project invoices. We reserve the right to
                suspend services or access to digital products if payments are
                overdue.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#6B46C1]">
                5. Limitation of Liability
              </h2>
              <p className="text-slate-600 leading-relaxed">
                High-ER Enterprises shall not be held liable for any indirect,
                consequential, or special liability arising out of or in any way
                related to your use of our digital products or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#6B46C1]">
                6. Governing Law
              </h2>
              <p className="text-slate-600 leading-relaxed">
                These terms are governed by and interpreted in accordance with
                the laws of the Federal Republic of Nigeria, and you submit to
                the non-exclusive jurisdiction of the state and federal courts
                located in Nigeria for the resolution of any disputes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#6B46C1]">
                7. Contact Us
              </h2>
              <p className="text-slate-600 leading-relaxed">
                If you have questions regarding these Terms, please reach out to
                us at <strong>info@higher.com.ng</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
