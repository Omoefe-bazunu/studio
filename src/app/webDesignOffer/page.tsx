"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  FaBriefcase,
  FaBlog,
  FaCalendarAlt,
  FaUserTie,
  FaLaptopCode,
  FaShoppingCart,
} from "react-icons/fa";
import { db, auth } from "@/lib/firebase/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import Script from "next/script";

const WebDesignLandingPage = () => {
  const calculateSecondsToMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  };

  const [timeLeft, setTimeLeft] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [showOffers, setShowOffers] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    const admin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    setIsAdmin(admin);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(calculateSecondsToMidnight());
    }

    if (timeLeft <= 0) {
      setTimeLeft(calculateSecondsToMidnight());
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  interface FormatTime {
    (seconds: number): string;
  }

  const formatTime: FormatTime = (seconds) => {
    const h: string = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m: string = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s: string = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getUtmParams = () => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || "direct",
      utm_campaign: params.get("utm_campaign") || "webdesign50",
    };
  };

  interface Offer {
    id: string;
    name: string;
    email: string;
    createdAt: Date | { toDate?: () => Date; toString?: () => string };
  }

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const fetchOffers = async () => {
    try {
      const q = query(
        collection(db, "webdesignoffer"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data: Offer[] = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          name: docData.name ?? "",
          email: docData.email ?? "",
          createdAt: docData.createdAt ?? new Date(),
        };
      });
      setOffers(data);
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  };

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  interface FirestoreError {
    message?: string;
  }

  const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Please enter both your name and email.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await addDoc(collection(db, "webdesignoffer"), {
        name,
        email,
        createdAt: new Date(),
      });

      if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        fetchOffers();
      }

      const { utm_source, utm_campaign } = getUtmParams();
      const message = encodeURIComponent(
        `Hello, my name is ${name}.\n` +
          `I am interested in the 50% Discount Web Design Offer.\n` +
          `Email: ${email}\n` +
          `Source: ${utm_source}\n` +
          `Campaign: ${utm_campaign}`
      );
      const whatsappNumber = "2349043970401";
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as FirestoreError;
      console.error("Error saving to Firestore:", error);
      setError("Failed to save. Please try again.");
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const formRef = useRef(null);
  const portfolioRef = useRef(null);

  const heroControls = useAnimation();
  const featuresControls = useAnimation();
  const formControls = useAnimation();
  const portfolioControls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      interface AnimationControls {
        start: (variant: string) => void;
      }

      interface RefObjectWithCurrent<T> {
        current: T | null;
      }

      const checkInView = (
        ref: RefObjectWithCurrent<HTMLElement>,
        controls: AnimationControls
      ): void => {
        if (!ref.current) return;
        const { top, bottom } = ref.current.getBoundingClientRect();
        const isVisible = top < window.innerHeight * 0.8 && bottom > 0;
        if (isVisible) controls.start("visible");
      };

      checkInView(heroRef, heroControls);
      checkInView(featuresRef, featuresControls);
      checkInView(formRef, formControls);
      checkInView(portfolioRef, portfolioControls);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroControls, featuresControls, formControls, portfolioControls]);

  const websiteTypes = [
    {
      icon: <FaBriefcase className="text-4xl mb-4 text-yellow-300" />,
      title: "Portfolio Websites",
      description: "Showcase your work professionally to attract clients",
    },
    {
      icon: <FaBlog className="text-4xl mb-4 text-yellow-300" />,
      title: "Blogging Sites",
      description:
        "Share your thoughts, build an audience, monetize your traffic",
    },
    {
      icon: <FaCalendarAlt className="text-4xl mb-4 text-yellow-300" />,
      title: "Appointment Booking",
      description: "Let clients schedule your services online 24/7",
    },
    {
      icon: <FaUserTie className="text-4xl mb-4 text-yellow-300" />,
      title: "Consultancy Websites",
      description:
        "Establish authority in your field and facilitate consultations globally",
    },
    {
      icon: <FaLaptopCode className="text-4xl mb-4 text-yellow-300" />,
      title: "Personal Brand Sites",
      description: "Build your online presence and reputation",
    },
    {
      icon: <FaShoppingCart className="text-4xl mb-4 text-yellow-300" />,
      title: "E-commerce Stores",
      description: "Sell products online with secure payments",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 text-white font-sans">
      {/* Meta Pixel Code */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1085063963346784');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1085063963346784&ev=PageView&noscript=1"
        />
      </noscript>
      {/* End Meta Pixel Code */}

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroControls}
        variants={sectionVariants}
        className="pt-24 pb-16 px-4 flex items-center justify-center min-h-[80vh]"
      >
        <div className="max-w-4xl text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-500">
              50% OFF Web Design
            </span>
          </motion.h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            Launch your dream website for only{" "}
            <span className="font-bold text-yellow-300">₦300,000</span> (
            <span className="line-through">₦600,000</span>). Limited 24-hour
            offer!
          </p>

          <div className="mt-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-yellow-200">
              Websites that Qualify
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websiteTypes.map((item, index) => (
                <motion.div
                  key={index}
                  className={`p-6 bg-white bg-opacity-10 rounded-xl shadow-lg hover:bg-opacity-20 transition-all duration-300 flex flex-col items-center text-center ${
                    index === 0 ? "scale-105" : "scale-95"
                  }`}
                  initial={{ scale: index === 0 ? 1.05 : 0.95 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {item.icon}
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-gray-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        initial="hidden"
        animate={featuresControls}
        variants={sectionVariants}
        className="py-16 px-4 bg-gray-800 bg-opacity-50"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            What You'll get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Custom website tailored to your needs",
              "Reliable live hosting",
              "Custom .com domain name",
              "Professional email service",
              "SEO optimization for Google",
              "Free regular site maintenance",
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white bg-opacity-10 rounded-xl shadow-lg hover:bg-opacity-20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <p className="text-lg md:text-xl text-yellow-200">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Timer Section */}
      <motion.section
        initial="hidden"
        animate={formControls}
        variants={sectionVariants}
        className="py-16 px-4"
      >
        <div className="text-center">
          <motion.span
            className="inline-block text-3xl md:text-5xl font-extrabold bg-yellow-300 text-gray-900 px-8 py-4 rounded-xl shadow-xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Offer expires in: {formatTime(timeLeft)}
          </motion.span>
        </div>
      </motion.section>

      {/* Form Section */}
      <motion.section
        ref={formRef}
        initial="hidden"
        animate={formControls}
        variants={sectionVariants}
        className="py-16 px-4"
      >
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Apply Now
          </h2>
          {submitted ? (
            <motion.div
              className="text-center bg-green-600 bg-opacity-90 p-8 rounded-xl text-white text-lg md:text-xl font-semibold shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Thank you! WhatsApp opened. Continue there.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              <motion.input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-6 py-4 rounded-lg text-gray-900 text-lg md:text-xl bg-white bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300"
                required
                autoComplete="name"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-6 py-4 rounded-lg text-gray-900 text-lg md:text-xl bg-white bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300"
                required
                autoComplete="email"
                whileFocus={{ scale: 1.02 }}
              />
              {error && (
                <p className="text-red-300 text-lg md:text-xl font-medium text-center">
                  {error}
                </p>
              )}
              <motion.button
                type="submit"
                className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 text-lg md:text-xl font-bold py-4 rounded-lg shadow-xl transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(255, 255, 0, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Claim your discount
              </motion.button>
            </form>
          )}
        </div>
      </motion.section>

      {/* Portfolio Section */}
      <motion.section
        ref={portfolioRef}
        initial="hidden"
        animate={portfolioControls}
        variants={sectionVariants}
        className="py-16 px-4 bg-gray-800 bg-opacity-50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Work</h2>
          <p className="text-xl md:text-2xl text-yellow-200 mb-4">
            See our{" "}
            <a
              href="https://www.higher.com.ng/services/web-development"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-2 rounded-lg text-gray-800 hover:bg-yellow-500 transition-colors"
            >
              portfolio
            </a>{" "}
            for top-quality projects.
          </p>
          <p className="text-lg md:text-xl text-yellow-200">
            Affordable doesn't mean low quality — explore our work!
          </p>
        </div>
      </motion.section>

      {/* Admin Offer List */}
      {isAdmin && (
        <div className="max-w-4xl mx-auto py-10 px-4 ">
          <button
            onClick={() => {
              setShowOffers((prev) => !prev);
              if (!offers.length) fetchOffers();
            }}
            className="bg-gray-700 px-4 py-2 text-center mx-auto rounded-lg mb-4 hover:bg-gray-600"
          >
            {showOffers ? "Hide Offers" : "Show Offers"}
          </button>
          {showOffers && (
            <div className="space-y-4">
              {offers.map((o) => (
                <details
                  key={o.id}
                  className="bg-gray-800 p-4 rounded-lg shadow"
                >
                  <summary className="cursor-pointer text-yellow-300 font-bold">
                    {o.name} - {o.email}
                  </summary>
                  <p className="text-gray-300 mt-2">
                    Submitted:{" "}
                    {"toDate" in o.createdAt &&
                    typeof o.createdAt.toDate === "function"
                      ? o.createdAt.toDate().toLocaleString()
                      : typeof o.createdAt === "object" &&
                        typeof o.createdAt.toString === "function"
                      ? o.createdAt.toString()
                      : typeof o.createdAt === "string"
                      ? o.createdAt
                      : ""}
                  </p>
                </details>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 text-center text-yellow-200 text-xl md:text-2xl">
        *Offer valid for 24 hours from your first visit. Don't miss out!
      </footer>
    </div>
  );
};

export default WebDesignLandingPage;
