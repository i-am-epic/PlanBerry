/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CENTRAL MEDIA REGISTRY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Every image and video URL on the site lives here. To replace media:
 *   1. Upload to Cloudinary (or your host) → get a URL or public ID
 *   2. Edit the relevant entry below
 *   3. That's it — no component changes required
 *
 * Once Cloudinary is set up (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local),
 * switch entries like:
 *     heroVideo: "https://stream.mux.com/..."
 *  →  heroVideo: cldVideo("planberry/hero", { f: "m3u8" })
 *
 * For images:
 *     caseStudyImage: "https://images.unsplash.com/..."
 *  →  caseStudyImage: cld("planberry/corporate/annual-day", { w: 600, ar: "4:5" })
 * ═══════════════════════════════════════════════════════════════════════════
 */

// import { cld, cldVideo } from "@/lib/cld";
// Uncomment once you've set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local.

// ─── Hero ────────────────────────────────────────────────────────────────────
export const heroVideoHLS =
  "https://stream.mux.com/BLC6VVUBEBHvYTC7x02S5iULppqcdMmsUmGHVXq02y8W8.m3u8?max_resolution=1080p&min_resolution=720p";

// ─── TextReveal (background image that widens on scroll) ────────────────────
export const textRevealBg =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=70";

// ─── Parallax Showcase — videos + poster images ─────────────────────────────
export const showcaseVideos: string[] = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
];

export const showcaseImages: string[] = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=65",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=65",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=65",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=65",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=65",
];

// ─── PhotoStream — three horizontal rows of event photos ────────────────────
export const photoStreamRow1: string[] = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=60",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=60",
  "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=400&q=60",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=60",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&q=60",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=60",
];

export const photoStreamRow2: string[] = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=60",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=60",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=60",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=60",
  "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=400&q=60",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&q=60",
];

export const photoStreamRow3: string[] = [
  "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&q=60",
  "https://images.unsplash.com/photo-1515165562835-c3b8c8e4288d?w=400&q=60",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=60",
  "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=60",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=60",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=60",
];

// ─── Services — hero image per service card ─────────────────────────────────
export const serviceImages = {
  corporate: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=70",
  social: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=70",
} as const;

// ─── Preloader — images to warm up the HTTP cache during load splash ────────
export const preloaderImages: string[] = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=480&q=45",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=480&q=45",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=480&q=45",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=480&q=45",
  "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=480&q=45",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=480&q=45",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=480&q=45",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=480&q=45",
  "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=480&q=45",
];

// ─── Static assets in /public ────────────────────────────────────────────────
export const logoSrc = "/logo.png";

// ─── Social links ────────────────────────────────────────────────────────────
export const socialLinks = {
  instagram: "https://www.instagram.com/planberry_events",
  linkedin: "https://www.linkedin.com/in/planberry-events-a18786404",
  facebook: "https://www.facebook.com/share/1HRQxrmcUg/",
} as const;
