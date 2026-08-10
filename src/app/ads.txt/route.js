import { getAdsTxtContent } from "@/lib/firebase/firestoreService";

export async function GET() {
  try {
    const content = await getAdsTxtContent();

    return new Response(content || "# No ads.txt content configured", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    return new Response("Error loading ads.txt", { status: 500 });
  }
}
