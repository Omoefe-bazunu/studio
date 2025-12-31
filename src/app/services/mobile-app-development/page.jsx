import MobileAppDevelopmentService from "@/components/services/MobileAppDevelopmentService";
import { getMobileProjects } from "@/lib/firebase/firestoreService";

/**
 * SEO Metadata for Mobile App Development [cite: 119]
 */
export const metadata = {
  title: "Mobile App Development | High-ER Enterprises",
  description:
    "Native and cross-platform iOS and Android applications engineered for scalability, performance, and user engagement.",
};

export default async function MobileAppDevelopmentPage() {
  // Fetch initial mobile projects on the server [cite: 120]
  const initialProjects = await getMobileProjects();

  return (
    <main className="min-h-screen">
      <MobileAppDevelopmentService initialProjectsData={initialProjects} />
    </main>
  );
}
