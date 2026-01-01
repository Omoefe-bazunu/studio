import { useEffect } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const useVisitorTracker = (pageName) => {
  useEffect(() => {
    // FIX: Guard clause to prevent "null" replace error
    if (!pageName || typeof pageName !== "string") {
      return;
    }

    // 1. Create a unique key for this page safely
    const safePageName = pageName.replace(/\s+/g, "_").toLowerCase();
    const sessionKey = `visited_${safePageName}`;

    // 2. Check if we have already tracked this visit in the current session
    if (sessionStorage.getItem(sessionKey)) {
      return; // Exit if already tracked in this tab session
    }

    const trackVisitor = async () => {
      try {
        // Fetch geolocation data
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("IP API failed");

        const geoData = await res.json();

        // Log the visit to Firestore
        await addDoc(collection(db, "visitorLog"), {
          page: pageName,
          region: geoData.region || "Unknown",
          country: geoData.country_name || "Unknown",
          city: geoData.city || "Unknown",
          timestamp: serverTimestamp(),
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
          isUnique: true,
        });

        // 3. Mark as visited so we don't track again in this session
        sessionStorage.setItem(sessionKey, "true");
      } catch (error) {
        // Silent fail to not disrupt user experience
        console.error("Visitor tracking error:", error);
      }
    };

    trackVisitor();
  }, [pageName]); // Only re-run if pageName changes
};
