export const COLORS = {
  // Light mode
  primary: "#065F46",
  secondary: "#ECFDF5",
  card: "#FFFFFF",
  accent: "#F97316",
  accentHover: "#EA580C",
  textMain: "#0F172A",
  textMuted: "#475569",
  border: "#E2E8F0",
  cream: "#F8FAF7",

  // Dark mode equivalents
  darkPrimary: "#022C22",
  darkSecondary: "#064E3B",
  darkCard: "#0F172A",
  darkText: "#F8FAFC",
  darkMuted: "#94A3B8",
  darkBorder: "#1E293B",
  darkCream: "#0B1120",
};

export const FONTS = {
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  heading:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export const PRICING = {
  current: 4999,
  original: 12000,
};

export const COURSE_DETAILS = {
  title: "Apply to Jobs Strategically",
  subtitle:
    "The practical system for getting interviews — entirely from your phone.",
  adminEmail: "raniem57@gmail.com",
  flwPublicKey: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "",
  courseLink: process.env.NEXT_PUBLIC_JOBS_COURSE_LINK || "#",
  whatsappLink: process.env.NEXT_PUBLIC_JOBS_WHATSAPP_LINK || "#",
};
