import MarketingAdsService from "@/components/services/MarketingAdsService";
import { getMarketingAdProjects } from "@/lib/firebase/firestoreService";

export const metadata = {
  title: "Marketing & Ads Design | High-ER Enterprises",
  description:
    "High-conversion ad creative and strategic marketing designs engineered to capture attention and drive ROI.",
};

export default async function MarketingAdsPage() {
  const initialProjects = await getMarketingAdProjects();

  return (
    <main className="min-h-screen">
      <MarketingAdsService initialProjectsData={initialProjects} />
    </main>
  );
}
