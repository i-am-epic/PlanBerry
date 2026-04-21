/**
 * Cloudinary URL builders.
 *
 * Usage (once you've uploaded to Cloudinary):
 *   cld("planberry/corporate-event-1", { w: 900, ar: "4:5" })
 *   cldVideo("planberry/highlights/annual-day-2024", { q: "auto" })
 *
 * Until NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set, these helpers return a clear
 * placeholder string so missing config is obvious in dev — no silent 404s.
 *
 * To enable:
 *   1. Sign up at cloudinary.com (free tier = 25 credits / month)
 *   2. Add to .env.local:  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
 *   3. Upload assets — their path becomes the publicId.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const HAS_CLOUD = CLOUD_NAME.length > 0;

type ImageTransforms = {
  /** Width in px */
  w?: number;
  /** Height in px */
  h?: number;
  /** Quality — number (1–100) or "auto" (default) */
  q?: number | "auto";
  /** Output format — default "auto" (AVIF → WebP → JPG per browser) */
  f?: "auto" | "jpg" | "webp" | "avif" | "png";
  /** Crop mode */
  c?: "fill" | "fit" | "scale" | "thumb" | "crop" | "lfill";
  /** Aspect ratio — e.g. "4:5", "16:9" */
  ar?: string;
  /** Gravity for crop — "auto" recommended for photos with faces */
  g?: "auto" | "face" | "faces" | "center" | "north" | "south";
  /** Device pixel ratio — "auto" recommended */
  dpr?: number | "auto";
  /** Effect (sepia, grayscale, blur, etc.) — passthrough */
  e?: string;
};

type VideoTransforms = {
  w?: number;
  h?: number;
  q?: number | "auto";
  /** Output format — "auto" lets Cloudinary pick HLS/MP4 per client */
  f?: "auto" | "mp4" | "webm" | "m3u8";
  c?: "fill" | "fit" | "scale";
  ar?: string;
};

function buildTransform(t: Record<string, string | number | undefined>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(t)) {
    if (value === undefined || value === "") continue;
    parts.push(`${key}_${value}`);
  }
  return parts.length ? parts.join(",") : "";
}

/** Build a Cloudinary image URL. Returns a placeholder if cloud name isn't set. */
export function cld(publicId: string, t: ImageTransforms = {}): string {
  if (!HAS_CLOUD) return `/placeholder.svg#${publicId}`;
  const transform = buildTransform({
    f: t.f ?? "auto",
    q: t.q ?? "auto",
    w: t.w,
    h: t.h,
    c: t.c,
    ar: t.ar,
    g: t.g,
    dpr: t.dpr ?? "auto",
    e: t.e,
  });
  const tPart = transform ? `/${transform}` : "";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload${tPart}/${publicId}`;
}

/** Build a Cloudinary video URL. For HLS adaptive streaming, pass f: "m3u8". */
export function cldVideo(publicId: string, t: VideoTransforms = {}): string {
  if (!HAS_CLOUD) return `/placeholder.svg#${publicId}`;
  const transform = buildTransform({
    f: t.f ?? "auto",
    q: t.q ?? "auto",
    w: t.w,
    h: t.h,
    c: t.c,
    ar: t.ar,
  });
  const tPart = transform ? `/${transform}` : "";
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload${tPart}/${publicId}`;
}

/** True when NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is configured. */
export const isCloudinaryConfigured = HAS_CLOUD;
