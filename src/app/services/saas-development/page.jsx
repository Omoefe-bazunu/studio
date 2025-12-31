import SaasDevelopmentService from "@/components/services/SaasDevelopmentService";
import { getSaasProjects } from "@/lib/firebase/firestoreService";

/**
 * SEO Metadata for SaaS Development
 */
export const metadata = {
  title: "SaaS Development | High-ER Enterprises",
  description:
    "Scalable, cloud-native Software as a Service (SaaS) solutions engineered for global performance and recurring revenue models.",
};

export default async function SaasDevelopmentPage() {
  // Server-side fetch to prevent loading flickers
  const initialProjects = await getSaasProjects();

  return (
    <main className="min-h-screen">
      <SaasDevelopmentService initialProjectsData={initialProjects} />
    </main>
  );
}
