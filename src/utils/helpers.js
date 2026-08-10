import { COLORS } from "../config/settings";

export function generateTxRef() {
  return `higher-jobmastery-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

export function trackPixelPurchase({ amount, currency, tx_ref }) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      value: amount,
      currency: currency || "NGN",
      content_name: "Apply to Jobs Strategically",
      content_type: "product",
      content_ids: [tx_ref],
    });
    window.fbq("track", "Lead", {
      content_name: "Apply to Jobs Strategically",
    });
  }
}

export function getMidnightSecondsLeft() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight - now) / 1000);
}

export function formatCountdown(secs) {
  const h = Math.floor(secs / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((secs % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return { h, m, s };
}

export function Stars({ rating = 5 }) {
  return (
    <span style={{ color: COLORS.accent }} className="tracking-wide">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}
