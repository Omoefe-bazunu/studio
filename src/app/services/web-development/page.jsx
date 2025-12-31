import WebDevelopmentService from "@/components/services/webDevelopmentService";
import { getWebProjects } from "@/lib/firebase/firestoreService";

export const metadata = {
  title: "Website Development | High-ER Enterprises",
  description:
    "Custom, high-performance websites and web applications engineered for scalability and conversion.",
};

export default async function WebDevelopmentPage() {
  const initialProjects = await getWebProjects();

  return (
    <main className="min-h-screen">
      <WebDevelopmentService initialProjectsData={initialProjects} />
    </main>
  );
}
