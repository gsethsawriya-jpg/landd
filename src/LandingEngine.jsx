import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  ExternalLink,
  Headphones,
  Instagram,
  Link as LinkIcon,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Youtube,
  Zap,
} from "lucide-react";

/* =========================================================
   CONFIG
   ========================================================= */

/*
 * VIDEO:
 * Put your video inside:
 *
 * public/video.mp4
 *
 * Then keep this:
 */
const VIDEO_URL = "/video.mp4";

/*
 * PASTE YOUR ADSTERRA SMARTLINK HERE.
 *
 * Example:
 * const ADSTERRA_URL = "https://your-adsterra-smartlink...";
 */
const ADSTERRA_URL = "PASTE_YOUR_ADSTERRA_SMARTLINK_HERE";

/*
 * Basic profile configuration.
 */
const PROFILE = {
  name: "Northstar",
  username: "@northstar",
  description:
    "Premium content, exclusive experiences and everything worth discovering.",
  avatarLetter: "N",
};

/*
 * Linktree-style links.
 * Replace these URLs with your own destinations.
 */
const SOCIAL_LINKS = [
  {
    title: "Watch Full Experience",
    subtitle: "Open the latest content",
    icon: Play,
    url: ADSTERRA_URL,
    primary: true,
  },
  {
    title: "Instagram",
    subtitle: "Follow us for updates",
    icon: Instagram,
    url: "https://instagram.com/",
  },
  {
    title: "YouTube",
    subtitle: "Watch more videos",
    icon: Youtube,
    url: "https://youtube.com/",
  },
  {
    title: "Our Community",
    subtitle: "Join the conversation",
    icon: Users,
    url: "https://example.com/",
  },
];

/* =========================================================
   VARIANT STORAGE
   ========================================================= */

const STORAGE_KEY = "northstar-landing-variant";

const VARIANTS = [1, 2, 3];

function getURLVariant() {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const value = Number(params.get("variant"));

  return VARIANTS.includes(value) ? value : null;
}

function getInitialVariant() {
  if (typeof window === "undefined") return 1;

  /*
   * 1. URL parameter wins.
   */
  const urlVariant = getURLVariant();

  if (urlVariant) {
    localStorage.setItem(
      STORAGE_KEY,
      String(urlVariant)
    );

    return urlVariant;
  }

  /*
   * 2. Returning visitor.
   */
  const stored = Number(
    localStorage.getItem(STORAGE_KEY)
  );

  if (VARIANTS.includes(stored)) {
    return stored;
  }

  /*
   * 3. New visitor gets random variant.
   */
  const random =
    VARIANTS[
      Math.floor(Math.random() * VARIANTS.length)
    ];

  localStorage.setItem(
    STORAGE_KEY,
    String(random)
  );

  return random;
}

/* =========================================================
   COUNTDOWN
   ========================================================= */

function useCountdown() {
  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) return 300;
        return value - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
}

/* =========================================================
   LIVE USERS
   ========================================================= */

function useLiveUsers() {
  const [users, setUsers] = useState(
    () => Math.floor(Math.random() * 25) + 72
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setUsers((current) => {
        const change =
          Math.random() > 0.5 ? 1 : -1;

        return Math.max(
          55,
          Math.min(150, current + change)
        );
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return users;
}

/* =========================================================
   CTA / ADSTERRA HANDLER
   ========================================================= */

function useAdsterraCTA() {
  const [loading, setLoading] = useState(false);

  const openAdsterra = useCallback(
    (url = ADSTERRA_URL) => {
      if (loading) return;

      /*
       * Prevent opening an accidental empty placeholder.
       */
      if (
        !url ||
        url ===
          "PASTE_YOUR_ADSTERRA_SMARTLINK_HERE"
      ) {
        alert(
          "Please add your Adsterra SmartLink in ADSTERRA_URL first."
        );
        return;
      }

      setLoading(true);

      setTimeout(() => {
        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );

        setLoading(false);
      }, 400);
    },
    [loading]
  );

  return {
    loading,
    openAdsterra,
  };
}

/* =========================================================
   URGENCY BAR
   ========================================================= */

function UrgencyBar() {
  const countdown = useCountdown();
  const users = useLiveUsers();

  return (
    <div className="fixed left-0 right-0 top-0 z-[999] border-b border-white/10 bg-black/95 px-3 py-2 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 text-[11px] sm:gap-6 sm:text-sm">
        <div className="flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5 text-red-500" />

          <span className="hidden sm:inline">
            Access window
          </span>

          <strong className="font-mono text-red-400">
            {countdown}
          </strong>
        </div>

        <span className="h-4 w-px bg-white/20" />

        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
            <span className="relative h-2 w-2 rounded-full bg-green-400" />
          </span>

          <span>
            <strong>{users}</strong> people watching
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   VIDEO PLAYER
   ========================================================= */

function CinematicVideo({
  onCTA,
  loading,
}) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [error, setError] = useState(false);

  const videoRef = React.useRef(null);

  const togglePlay = async () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl shadow-black/50">
      {!error ? (
        <video
          ref={videoRef}
          src={VIDEO_URL}
          className="aspect-video w-full object-cover"
          playsInline
          muted={muted}
          preload="metadata"
          onError={() => setError(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      ) : (
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-red-950 via-black to-slate-950 p-6 text-center">
          <div>
            <p className="text-sm font-semibold text-white">
              Add your video
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Put your MP4 file at:
            </p>

            <code className="mt-1 block text-xs text-red-400">
              public/video.mp4
            </code>
          </div>
        </div>
      )}

      {!error && (
        <>
          {/* Center play */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={
              playing ? "Pause video" : "Play video"
            }
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-2xl transition hover:scale-105"
          >
            {playing ? (
              <span className="flex gap-1">
                <span className="h-5 w-1.5 rounded bg-black" />
                <span className="h-5 w-1.5 rounded bg-black" />
              </span>
            ) : (
              <Play className="ml-1 h-7 w-7 fill-current" />
            )}
          </button>

          {/* Video controls */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent p-4 pt-12">
            <button
              type="button"
              onClick={togglePlay}
              className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              {playing ? "Pause" : "Play"}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/20"
              >
                {muted ? "Unmute" : "Mute"}
              </button>

              <button
                type="button"
                onClick={() => onCTA()}
                disabled={loading}
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
              >
                {loading
                  ? "Connecting..."
                  : "Watch Now"}
              </button>
            </div>
          </div>

          {/* Netflix-style label */}
          <div className="absolute left-4 top-4 rounded-md bg-red-600 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            N SERIES
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================
   CTA BUTTON
   ========================================================= */

function MainCTA({
  onClick,
  loading,
  children = "Watch Now",
}) {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      disabled={loading}
      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-red-950/30 transition hover:bg-red-500 hover:shadow-red-900/40 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Connecting...
        </>
      ) : (
        <>
          {children}

          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}

/* =========================================================
   PROFILE
   ========================================================= */

function ProfileHeader({ dark = true }) {
  return (
    <div className="text-center">
      <div className="relative mx-auto h-24 w-24">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-red-500 via-fuchsia-500 to-purple-600 blur-sm" />

        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-black bg-gradient-to-br from-red-600 to-purple-800 text-3xl font-black text-white">
          {PROFILE.avatarLetter}
        </div>

        <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-4 border-black bg-green-500">
          <Check className="h-3.5 w-3.5 text-black" />
        </span>
      </div>

      <h1
        className={`mt-5 text-2xl font-black ${
          dark ? "text-white" : "text-slate-950"
        }`}
      >
        {PROFILE.name}
      </h1>

      <p
        className={`mt-1 text-sm ${
          dark ? "text-red-400" : "text-red-600"
        }`}
      >
        {PROFILE.username}
      </p>

      <p
        className={`mx-auto mt-3 max-w-md text-sm leading-6 ${
          dark ? "text-slate-400" : "text-slate-600"
        }`}
      >
        {PROFILE.description}
      </p>

      <div
        className={`mt-5 flex items-center justify-center gap-4 text-xs ${
          dark ? "text-slate-500" : "text-slate-500"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          24.8K followers
        </span>

        <span className="h-1 w-1 rounded-full bg-slate-500" />

        <span className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          4.9
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   STYLE 1
   NETFLIX CINEMATIC
   ========================================================= */

function StyleOne({
  onCTA,
  loading,
}) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-10 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-red-700/10 blur-[160px]" />

        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-700/10 blur-[140px]" />
      </div>

      <main className="relative px-4 pb-24 pt-24 sm:px-6">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <ProfileHeader />

          {/* Video */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-8"
          >
            <CinematicVideo
              onCTA={onCTA}
              loading={loading}
            />
          </motion.div>

          {/* Main CTA */}
          <div className="mt-5">
            <MainCTA
              onClick={onCTA}
              loading={loading}
            >
              Watch Full Experience
            </MainCTA>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              "HD",
              "Premium",
              "Exclusive",
              "Instant Access",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Linktree links */}
          <div className="mt-8 space-y-3">
            {SOCIAL_LINKS.slice(1).map(
              (item, index) => {
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.title}
                    type="button"
                    onClick={() =>
                      onCTA(item.url)
                    }
                    disabled={loading}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.06,
                    }}
                    className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-red-500/30 hover:bg-white/[0.08] disabled:opacity-60"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-bold">
                        {item.title}
                      </div>

                      <div className="mt-0.5 text-xs text-slate-500">
                        {item.subtitle}
                      </div>
                    </div>

                    <ExternalLink className="h-4 w-4 text-slate-600" />
                  </motion.button>
                );
              }
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure connection
          </div>
        </div>
      </main>

      <Footer dark />
    </div>
  );
}

/* =========================================================
   STYLE 2
   GLASSMORPHISM LINKTREE
   ========================================================= */

function StyleTwo({
  onCTA,
  loading,
}) {
  return (
    <div className="min-h-screen bg-[#100b15] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[150px]" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-[140px]" />
      </div>

      <main className="relative px-4 pb-24 pt-24 sm:px-6">
        <div className="mx-auto max-w-xl">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-2xl sm:p-8">
            <ProfileHeader />

            <div className="mt-8">
              <CinematicVideo
                onCTA={onCTA}
                loading={loading}
              />
            </div>

            <div className="mt-4">
              <MainCTA
                onClick={onCTA}
                loading={loading}
              >
                Enter Now
              </MainCTA>
            </div>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                Explore
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-3">
              {SOCIAL_LINKS.map(
                (item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.button
                      key={`${item.title}-${index}`}
                      type="button"
                      onClick={() =>
                        onCTA(item.url)
                      }
                      disabled={loading}
                      whileHover={{
                        scale: 1.01,
                      }}
                      whileTap={{
                        scale: 0.99,
                      }}
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition disabled:opacity-60 ${
                        item.primary
                          ? "border-red-500/40 bg-red-600/90 hover:bg-red-500"
                          : "border-white/10 bg-white/[0.05] hover:bg-white/[0.1]"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          item.primary
                            ? "bg-white/15"
                            : "bg-white/10"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <div className="text-sm font-bold">
                          {item.title}
                        </div>

                        <div
                          className={`mt-0.5 text-xs ${
                            item.primary
                              ? "text-red-100"
                              : "text-slate-500"
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  );
                }
              )}
            </div>

            <div className="mt-7 text-center text-xs text-slate-600">
              <Sparkles className="mx-auto mb-2 h-4 w-4 text-red-500" />
              Curated for you
            </div>
          </div>
        </div>
      </main>

      <Footer dark />
    </div>
  );
}

/* =========================================================
   STYLE 3
   HIGH CONTRAST CONVERSION CARD
   ========================================================= */

function StyleThree({
  onCTA,
  loading,
}) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <main className="px-4 pb-24 pt-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_480px]">
            <div className="hidden lg:block">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
                LIVE NOW
              </span>

              <h1 className="mt-6 text-6xl font-black leading-[0.95] tracking-tight">
                Your next
                <span className="block text-red-600">
                  experience starts here.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
                Watch the preview, explore the links and
                continue when you're ready.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Premium video experience",
                  "Instant access",
                  "Mobile optimized",
                  "Secure connection",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-semibold text-slate-700"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Check className="h-3 w-3" />
                    </span>

                    {item}
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/50 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  Available
                </span>

                <ShieldCheck className="h-5 w-5 text-slate-300" />
              </div>

              <div className="mt-6 lg:hidden">
                <ProfileHeader dark={false} />
              </div>

              <div className="mt-6">
                <CinematicVideo
                  onCTA={onCTA}
                  loading={loading}
                />
              </div>

              <h2 className="mt-6 text-2xl font-black">
                Watch the full experience
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Continue below to access the complete
                experience.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Premium content",
                  "Instant access",
                  "Optimized for mobile",
                  "Secure connection",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Check className="h-3 w-3" />
                    </span>

                    <span className="text-sm font-medium text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <MainCTA
                onClick={onCTA}
                loading={loading}
              >
                Continue Watching
              </MainCTA>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Zap className="h-3.5 w-3.5" />
                Fast access
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */

function Footer({
  dark = false,
}) {
  return (
    <footer
      className={`border-t px-6 py-10 ${
        dark
          ? "border-white/10 bg-black text-slate-500"
          : "border-slate-200 bg-white text-slate-500"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="text-center sm:text-left">
            <div
              className={`font-bold ${
                dark
                  ? "text-white"
                  : "text-slate-950"
              }`}
            >
              Northstar
            </div>

            <p className="mt-1 text-xs">
              © {new Date().getFullYear()} Northstar.
              All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-xs">
            <a
              href="#privacy"
              className="hover:underline"
            >
              Privacy Policy
            </a>

            <a
              href="#terms"
              className="hover:underline"
            >
              Terms of Service
            </a>

            <a
              href="#support"
              className="hover:underline"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   ADMIN VARIANT SWITCHER
   ========================================================= */

function VariantSwitcher({
  variant,
  onChange,
}) {
  return (
    <div className="fixed bottom-4 left-1/2 z-[1000] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-black/95 p-1.5 shadow-2xl backdrop-blur-xl">
        <span className="hidden px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:block">
          Template
        </span>

        {VARIANTS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`h-8 min-w-8 rounded-lg px-2 text-xs font-bold transition ${
              variant === item
                ? "bg-red-600 text-white"
                : "text-slate-500 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN ENGINE
   ========================================================= */

export default function LandingEngine() {
  const [variant, setVariant] = useState(
    getInitialVariant
  );

  const {
    loading,
    openAdsterra,
  } = useAdsterraCTA();

  /*
   * Keep URL variant synchronized.
   */
  useEffect(() => {
    const syncURL = () => {
      const value = getURLVariant();

      if (value) {
        setVariant(value);

        localStorage.setItem(
          STORAGE_KEY,
          String(value)
        );
      }
    };

    window.addEventListener(
      "popstate",
      syncURL
    );

    return () => {
      window.removeEventListener(
        "popstate",
        syncURL
      );
    };
  }, []);

  /*
   * Manual template switching.
   */
  const changeVariant = useCallback(
    (next) => {
      if (!VARIANTS.includes(next)) return;

      setVariant(next);

      localStorage.setItem(
        STORAGE_KEY,
        String(next)
      );

      const url = new URL(
        window.location.href
      );

      url.searchParams.set(
        "variant",
        String(next)
      );

      window.history.replaceState(
        {},
        "",
        url.toString()
      );
    },
    []
  );

  /*
   * Render selected design.
   */
  const page = useMemo(() => {
    if (variant === 1) {
      return (
        <StyleOne
          onCTA={openAdsterra}
          loading={loading}
        />
      );
    }

    if (variant === 2) {
      return (
        <StyleTwo
          onCTA={openAdsterra}
          loading={loading}
        />
      );
    }

    return (
      <StyleThree
        onCTA={openAdsterra}
        loading={loading}
      />
    );
  }, [
    variant,
    openAdsterra,
    loading,
  ]);

  return (
    <>
      <UrgencyBar />

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
          {page}
        </motion.div>
      </AnimatePresence>

      <VariantSwitcher
        variant={variant}
        onChange={changeVariant}
      />
    </>
  );
}
