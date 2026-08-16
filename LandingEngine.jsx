import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  ExternalLink,
  Headphones,
  Instagram,
  Linkedin,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Youtube,
  Zap,
} from "lucide-react";

/* ==========================================================================
   CONFIGURATION
   ========================================================================== */

const STORAGE_KEY = "landing-engine-variant";

/*
 * Replace this URL with your actual conversion destination.
 * It is intentionally defined here so there are no undefined variables.
 */
const TARGET_URL = "https://example.com";

const VARIANTS = [1, 2, 3];

/* ==========================================================================
   VARIANT ROUTING
   ========================================================================== */

function getVariantFromUrl() {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const value = Number(params.get("variant"));

  if (VARIANTS.includes(value)) {
    return value;
  }

  return null;
}

function getInitialVariant() {
  if (typeof window === "undefined") {
    return 1;
  }

  /*
   * Priority #1:
   * ?variant=1
   * ?variant=2
   * ?variant=3
   */
  const urlVariant = getVariantFromUrl();

  if (urlVariant !== null) {
    localStorage.setItem(STORAGE_KEY, String(urlVariant));
    return urlVariant;
  }

  /*
   * Priority #2:
   * Returning user's persisted variant.
   */
  const storedVariant = Number(localStorage.getItem(STORAGE_KEY));

  if (VARIANTS.includes(storedVariant)) {
    return storedVariant;
  }

  /*
   * Priority #3:
   * New user receives a random template.
   */
  const randomVariant =
    VARIANTS[Math.floor(Math.random() * VARIANTS.length)];

  localStorage.setItem(STORAGE_KEY, String(randomVariant));

  return randomVariant;
}

/* ==========================================================================
   COUNTDOWN TIMER
   ========================================================================== */

function useCountdown(initialSeconds = 300) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          return initialSeconds;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [initialSeconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

/* ==========================================================================
   ACTIVE USER COUNTER
   ========================================================================== */

function useActiveUsers() {
  const [users, setUsers] = useState(() => {
    return Math.floor(Math.random() * 18) + 47;
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setUsers((current) => {
        const increase = Math.random() > 0.5;
        const next = increase ? current + 1 : current - 1;

        return Math.min(99, Math.max(42, next));
      });
    }, 3500);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return users;
}

/* ==========================================================================
   CENTRALIZED CTA HANDLER
   ========================================================================== */

function useCTA() {
  const [loading, setLoading] = useState(false);

  const handleCTA = useCallback(() => {
    if (loading) {
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      window.open(TARGET_URL, "_blank", "noopener,noreferrer");

      setLoading(false);
    }, 400);
  }, [loading]);

  return {
    loading,
    handleCTA,
  };
}

/* ==========================================================================
   SHARED URGENCY BAR
   ========================================================================== */

function UrgencyBar() {
  const countdown = useCountdown(300);
  const activeUsers = useActiveUsers();

  return (
    <div className="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-black px-3 py-2 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 text-xs sm:gap-6 sm:text-sm">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock3 className="h-3.5 w-3.5 text-yellow-400" />

          <span className="hidden sm:inline">
            Offer ends in
          </span>

          <span className="font-mono font-bold text-yellow-300">
            {countdown}
          </span>
        </div>

        <div className="h-4 w-px bg-white/20" />

        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>

          <span>
            <strong>{activeUsers}</strong>{" "}
            people viewing now
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SHARED FOOTER
   ========================================================================== */

function Footer({ dark = false }) {
  return (
    <footer
      className={`border-t px-6 py-10 ${
        dark
          ? "border-white/10 bg-black text-white"
          : "border-slate-200 bg-white text-slate-600"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div
            className={`font-semibold ${
              dark ? "text-white" : "text-slate-950"
            }`}
          >
            Northstar
          </div>

          <p className="mt-1 text-sm">
            © {new Date().getFullYear()} Northstar. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a
            href="#privacy"
            className="transition hover:underline"
          >
            Privacy Policy
          </a>

          <a
            href="#terms"
            className="transition hover:underline"
          >
            Terms of Service
          </a>

          <a
            href="#support"
            className="transition hover:underline"
          >
            Support
          </a>
        </nav>
      </div>
    </footer>
  );
}

/* ==========================================================================
   SHARED CTA BUTTON
   ========================================================================== */

function CTAButton({
  onClick,
  loading,
  children,
  dark = false,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg transition focus:outline-none focus:ring-4 disabled:cursor-wait disabled:opacity-80 ${
        dark
          ? "bg-white text-black shadow-white/10 hover:bg-slate-100 focus:ring-white/20"
          : "bg-slate-950 text-white shadow-slate-950/20 hover:bg-slate-800 focus:ring-slate-950/20"
      } ${className}`}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

          Connecting...
        </>
      ) : (
        <>
          {children}

          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  );
}

/* ==========================================================================
   STYLE 1
   MODERN DARK MEDIA / STREAMING HERO
   ========================================================================== */

function StyleOne({ onCTA, loading }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#050507] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-32 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />

        <div className="absolute -right-40 top-[40%] h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <main className="relative pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-14 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            {/* Copy */}
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.65,
              }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />

                The new way to experience premium content
              </div>

              <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                Your next

                <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                  obsession starts here.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                Discover premium experiences, exclusive releases,
                and hand-picked content designed to keep you inspired.
              </p>

              {/* Feature tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "4K Quality",
                  "Exclusive",
                  "Instant Access",
                  "Premium",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-9 flex flex-col items-start gap-3">
                <CTAButton
                  onClick={onCTA}
                  loading={loading}
                  dark
                  className="min-w-52"
                >
                  Start watching
                </CTAButton>

                <span className="text-xs text-slate-500">
                  No complicated setup. Instant access.
                </span>
              </div>
            </motion.div>

            {/* Floating media preview */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.15,
              }}
              className="relative mx-auto w-full max-w-xl"
            >
              <div className="absolute -inset-5 rounded-[2rem] bg-violet-500/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-violet-950/30 backdrop-blur-xl">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-violet-950 via-slate-900 to-blue-950">
                  {/* Visual background */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.16),transparent_28%),radial-gradient(circle_at_70%_70%,rgba(99,102,241,.3),transparent_35%)]" />

                  <div className="absolute left-[15%] top-[15%] h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl" />

                  <div className="absolute bottom-[10%] right-[15%] h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      type="button"
                      onClick={onCTA}
                      whileHover={{
                        scale: 1.08,
                      }}
                      whileTap={{
                        scale: 0.96,
                      }}
                      aria-label="Play preview"
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-slate-950 shadow-2xl shadow-black/40"
                    >
                      <Play className="ml-1 h-8 w-8 fill-current" />
                    </motion.button>
                  </div>

                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* Media information */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">
                        Featured
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        Beyond the ordinary
                      </h2>
                    </div>

                    <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs backdrop-blur">
                      04:28
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating information card */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-5 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Zap className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Experience
                    </p>

                    <p className="text-sm font-bold">
                      Instant playback
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                animate={{
                  y: [0, 7, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-4 top-8 hidden rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                  <span className="text-xs font-semibold text-slate-300">
                    Streaming live
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-white/10 bg-white/[0.025]">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-3">
            {[
              {
                title: "Unlimited discovery",
                text: "Explore an ever-growing collection.",
              },
              {
                title: "Premium quality",
                text: "Crisp visuals and immersive sound.",
              },
              {
                title: "Made for you",
                text: "Recommendations that get smarter.",
              },
            ].map((feature) => (
              <div key={feature.title}>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <Check className="h-4 w-4" />
                </div>

                <h3 className="font-bold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer dark />
    </div>
  );
}

/* ==========================================================================
   STYLE 2
   VIP LINK HUB / BIO LINK GRID
   ========================================================================== */

function StyleTwo({ onCTA, loading }) {
  const links = [
    {
      icon: Youtube,
      title: "Watch the latest",
      subtitle: "New videos every week",
    },
    {
      icon: Instagram,
      title: "Follow the journey",
      subtitle: "Behind the scenes",
    },
    {
      icon: Linkedin,
      title: "Connect with us",
      subtitle: "Updates & announcements",
    },
    {
      icon: Headphones,
      title: "Listen now",
      subtitle: "Original audio experiences",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0d18] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-20 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-[130px]" />

        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-[120px]" />

        <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-purple-500/10 blur-[110px]" />
      </div>

      <main className="relative px-5 pb-20 pt-24">
        <div className="mx-auto max-w-xl">
          <motion.section
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8"
          >
            {/* Profile */}
            <div className="text-center">
              <div className="relative mx-auto h-24 w-24">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-fuchsia-400 to-indigo-500 blur-sm" />

                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#191625] bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-3xl font-black">
                  N
                </div>

                <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#191625] bg-emerald-400">
                  <Check className="h-3.5 w-3.5 text-slate-950" />
                </span>
              </div>

              <h1 className="mt-5 text-2xl font-black">
                Northstar Creative
              </h1>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Digital experiences, creative stories, and premium
                content for people who want something different.
              </p>

              {/* Social proof */}
              <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  24.8K followers
                </span>

                <span className="h-1 w-1 rounded-full bg-slate-600" />

                <span className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  4.9 rating
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="mt-8 space-y-3">
              {links.map((link, index) => {
                const Icon = link.icon;

                return (
                  <motion.button
                    key={link.title}
                    type="button"
                    onClick={onCTA}
                    disabled={loading}
                    initial={{
                      opacity: 0,
                      x: -15,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.12 + index * 0.06,
                      duration: 0.35,
                    }}
                    whileHover={{
                      scale: 1.015,
                    }}
                    whileTap={{
                      scale: 0.985,
                    }}
                    className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left transition hover:bg-white/[0.1] disabled:opacity-70"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">
                        {link.title}
                      </span>

                      <span className="mt-0.5 block text-xs text-slate-500">
                        {link.subtitle}
                      </span>
                    </span>

                    <ExternalLink className="h-4 w-4 text-slate-500" />
                  </motion.button>
                );
              })}
            </div>

            {/* Conversion CTA */}
            <div className="mt-6 rounded-2xl border border-fuchsia-400/10 bg-fuchsia-400/5 p-4 text-center">
              <p className="text-xs font-medium text-slate-400">
                Join thousands of people getting our weekly drop.
              </p>

              <CTAButton
                onClick={onCTA}
                loading={loading}
                dark
                className="mt-3 w-full"
              >
                Get instant access
              </CTAButton>
            </div>
          </motion.section>

          <p className="mt-6 text-center text-xs text-slate-600">
            Trusted by creators, teams, and curious minds worldwide.
          </p>
        </div>
      </main>

      <Footer dark />
    </div>
  );
}

/* ==========================================================================
   STYLE 3
   MINIMALIST HIGH-CONTRAST CONVERSION CARD
   ========================================================================== */

function StyleThree({ onCTA, loading }) {
  const benefits = [
    "Instant access to the complete experience",
    "Premium resources and exclusive content",
    "No complicated setup or onboarding",
    "Built for fast, distraction-free results",
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <main className="px-5 pb-20 pt-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_460px]">
            {/* Desktop copy */}
            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.55,
              }}
              className="hidden lg:block"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                LIVE NOW
              </div>

              <h1 className="max-w-xl text-6xl font-black leading-[0.98] tracking-tight">
                Simple access.

                <span className="block text-emerald-600">
                  Serious value.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
                Everything you need in one focused experience,
                without the clutter and friction that usually gets
                in the way.
              </p>
            </motion.div>

            {/* Conversion card */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
              }}
              className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-300/40 sm:p-9"
            >
              {/* Status */}
              <div className="mb-7 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                  Live access
                </span>

                <ShieldCheck className="h-5 w-5 text-slate-300" />
              </div>

              {/* Mobile heading */}
              <div className="lg:hidden">
                <h1 className="text-4xl font-black leading-tight tracking-tight">
                  Simple access.

                  <span className="block text-emerald-600">
                    Serious value.
                  </span>
                </h1>

                <p className="mt-4 text-base leading-7 text-slate-600">
                  Everything you need in one focused experience.
                </p>
              </div>

              <div className="my-7 h-px bg-slate-100" />

              {/* Benefits */}
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex gap-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>

                    <span className="text-sm font-medium leading-5 text-slate-700">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Availability */}
              <div className="mt-8 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Availability
                  </span>

                  <span className="text-sm font-bold text-emerald-600">
                    Active
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: "92%",
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className="h-full rounded-full bg-emerald-500"
                  />
                </div>
              </div>

              {/* CTA */}
              <CTAButton
                onClick={onCTA}
                loading={loading}
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600/20"
              >
                Get started now
              </CTAButton>

              <p className="mt-3 text-center text-xs text-slate-400">
                Secure connection · Instant access
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ==========================================================================
   ADMIN / TESTER SWITCHER
   ========================================================================== */

function VariantSwitcher({ variant, onChange }) {
  return (
    <div className="fixed bottom-4 left-1/2 z-[110] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-slate-950/95 p-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <span className="hidden px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:block">
          Template
        </span>

        {VARIANTS.map((item) => {
          const active = variant === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              aria-label={`Switch to template ${item}`}
              aria-pressed={active}
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-bold transition ${
                active
                  ? "bg-white text-slate-950"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN LANDING ENGINE
   ========================================================================== */

export default function LandingEngine() {
  const [variant, setVariant] = useState(getInitialVariant);

  const {
    loading,
    handleCTA,
  } = useCTA();

  /*
   * Keep URL routing synchronized with browser navigation.
   */
  useEffect(() => {
    const syncVariantFromUrl = () => {
      const urlVariant = getVariantFromUrl();

      if (urlVariant !== null) {
        setVariant(urlVariant);
        localStorage.setItem(
          STORAGE_KEY,
          String(urlVariant)
        );
      }
    };

    window.addEventListener(
      "popstate",
      syncVariantFromUrl
    );

    return () => {
      window.removeEventListener(
        "popstate",
        syncVariantFromUrl
      );
    };
  }, []);

  /*
   * Manual variant switching.
   */
  const changeVariant = useCallback((nextVariant) => {
    if (!VARIANTS.includes(nextVariant)) {
      return;
    }

    setVariant(nextVariant);

    localStorage.setItem(
      STORAGE_KEY,
      String(nextVariant)
    );

    /*
     * Update ?variant=N without reloading.
     */
    const url = new URL(window.location.href);

    url.searchParams.set(
      "variant",
      String(nextVariant)
    );

    window.history.replaceState(
      {},
      "",
      url.toString()
    );
  }, []);

  /*
   * Dynamically route to one of the three designs.
   */
  const template = useMemo(() => {
    switch (variant) {
      case 1:
        return (
          <StyleOne
            onCTA={handleCTA}
            loading={loading}
          />
        );

      case 2:
        return (
          <StyleTwo
            onCTA={handleCTA}
            loading={loading}
          />
        );

      case 3:
        return (
          <StyleThree
            onCTA={handleCTA}
            loading={loading}
          />
        );

      default:
        return (
          <StyleOne
            onCTA={handleCTA}
            loading={loading}
          />
        );
    }
  }, [
    variant,
    handleCTA,
    loading,
  ]);

  return (
    <>
      {/* Shared urgency / social-proof bar */}
      <UrgencyBar />

      {/* Animated template routing */}
      <AnimatePresence mode="wait">
        <motion.div
          key={variant}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          {template}
        </motion.div>
      </AnimatePresence>

      {/* Admin / QA template switcher */}
      <VariantSwitcher
        variant={variant}
        onChange={changeVariant}
      />
    </>
  );
}
