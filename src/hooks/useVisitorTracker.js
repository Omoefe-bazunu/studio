import { useEffect } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const useVisitorTracker = (pageName) => {
  useEffect(() => {
    // 1. Create a unique key for this page
    const sessionKey = `visited_${pageName.replace(/\s+/g, "_").toLowerCase()}`;

    // 2. Check if we have already tracked this visit in the current session
    if (sessionStorage.getItem(sessionKey)) {
      return; // Exit if already tracked
    }

    const trackVisitor = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const geoData = await res.json();

        await addDoc(collection(db, "visitorLog"), {
          page: pageName,
          region: geoData.region || "Unknown",
          country: geoData.country_name || "Unknown",
          city: geoData.city || "Unknown",
          timestamp: serverTimestamp(),
          userAgent: navigator.userAgent,
          isUnique: true, // Mark as a unique session visit
        });

        // 3. Set the flag so we don't track this page again until the tab is closed
        sessionStorage.setItem(sessionKey, "true");
      } catch (error) {
        console.error("Tracking failed:", error);
      }
    };

    trackVisitor();
  }, [pageName]);
};
