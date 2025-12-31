import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Zap, Target, Award } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="py-8 lg:py-16 bg-background">
      {" "}
      {/* Removed id="about" */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              About Us
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              At{" "}
              <span className="font-bold text-primary">
                High-ER Enterprises
              </span>
              , we bridge the gap between high-end innovation and accessibility.
              We believe that top-tier digital solutions shouldn't be out of
              reach for growing brands.
            </p>
            <p className="text-slate-500 leading-relaxed">
              Our mission is simple: to deliver precision-engineered
              <span className="text-[#FF8C38] font-semibold">
                {" "}
                Web, Mobile, and SaaS products{" "}
              </span>
              paired with high-conversion marketing design. We don't just build
              software; we build the digital foundation for your success.
            </p>
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Our Commitment
              </h3>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-accent/10 rounded-full">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Quality & Excellence
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Delivering top-tier services that meet the highest standards
                    of quality and performance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-accent/10 rounded-full">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Innovation & Affordability
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Combining innovative solutions with cost-effective
                    strategies to maximize your ROI.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-accent/10 rounded-full">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Client-Centric Approach
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Collaborating closely with you to understand your vision and
                    achieve your objectives.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link href="/services">Explore Our Services</Link>
              </Button>
            </div>
          </div>

          <div className="relative h-80 md:h-[500px] rounded-lg overflow-hidden shadow-xl group">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/high-481fd.firebasestorage.app/o/abouut.jpg?alt=media&token=fb972c4a-b8a1-4a43-bb72-148d6d3bd77a"
              alt="HIGH-ER ENTERPRISES Team Collaboration"
              data-ai-hint="team collaboration office"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
