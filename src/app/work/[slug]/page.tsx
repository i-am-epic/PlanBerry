import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { caseStudies } from "@/data/caseStudies";

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((cs) => cs.slug === slug);
  if (!study) return { title: "Case Study — Planberry" };
  return {
    title: `${study.title} — Planberry`,
    description: study.summary,
    openGraph: {
      title: study.title,
      description: study.summary,
      images: [{ url: study.image }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies.find((cs) => cs.slug === slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((cs) => cs.slug === slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <>
      <Navbar />
      <main style={{ background: "#141e1c", minHeight: "100vh" }}>
        <article>
          {/* Hero */}
          <header
            className="relative w-full overflow-hidden"
            style={{
              paddingTop: "clamp(7rem, 14vh, 11rem)",
              paddingLeft: "var(--pad-x)",
              paddingRight: "var(--pad-x)",
              paddingBottom: "clamp(3rem, 6vh, 5rem)",
            }}
          >
            <Link
              href="/#work"
              className="inline-block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#666",
                marginBottom: "2rem",
              }}
            >
              ← Back to selected work
            </Link>
            <div
              className="flex items-center gap-4"
              style={{ marginBottom: "1.5rem" }}
            >
              <span
                style={{
                  padding: "0.35rem 0.9rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.25)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {study.category}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#666",
                }}
              >
                {study.client} — {study.location} — {study.year}
              </span>
            </div>
            <h1
              className="text-white"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(2.2rem, 5vw, 5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                maxWidth: "22ch",
                fontVariationSettings: "'SOFT' 50, 'WONK' 1",
              }}
            >
              {study.title}
            </h1>
          </header>

          {/* Feature image */}
          <div
            className="relative w-full"
            style={{
              paddingLeft: "var(--pad-x)",
              paddingRight: "var(--pad-x)",
              marginBottom: "clamp(3rem, 6vh, 5rem)",
            }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "16 / 9",
                borderRadius: "4px",
                viewTransitionName: `cs-${study.slug}`,
              }}
            >
              <Image
                src={study.image}
                alt={study.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Body */}
          <section
            className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-24"
            style={{
              paddingLeft: "var(--pad-x)",
              paddingRight: "var(--pad-x)",
              paddingBottom: "clamp(4rem, 8vh, 6rem)",
            }}
          >
            <aside>
              <div
                className="grid grid-cols-1 gap-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                {study.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="py-5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="text-white"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 400,
                        fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)",
                        lineHeight: 1,
                        fontVariationSettings: "'SOFT' 50, 'WONK' 0",
                      }}
                    >
                      {m.value}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#666",
                        marginTop: "0.5rem",
                      }}
                    >
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "clamp(1.05rem, 1.25vw, 1.25rem)",
                  lineHeight: 1.85,
                  color: "rgba(255,255,255,0.78)",
                  maxWidth: "60ch",
                }}
              >
                {study.summary}
              </p>
              <blockquote
                className="italic"
                style={{
                  marginTop: "clamp(2.5rem, 5vh, 4rem)",
                  paddingLeft: "1.5rem",
                  borderLeft: "1px solid rgba(255,255,255,0.2)",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.25rem, 1.8vw, 1.75rem)",
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.9)",
                  fontVariationSettings: "'SOFT' 100, 'WONK' 1",
                  maxWidth: "42ch",
                }}
              >
                &ldquo;{study.quote.text}&rdquo;
                <footer
                  className="not-italic"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#777",
                    marginTop: "1.25rem",
                  }}
                >
                  — {study.quote.author}, {study.quote.role}
                </footer>
              </blockquote>
            </div>
          </section>

          {/* Next study */}
          <section
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingLeft: "var(--pad-x)",
              paddingRight: "var(--pad-x)",
              paddingTop: "clamp(3rem, 6vh, 5rem)",
              paddingBottom: "clamp(4rem, 8vh, 6rem)",
            }}
          >
            <span
              className="block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#555",
                marginBottom: "1.5rem",
              }}
            >
              Next Story
            </span>
            <Link
              href={`/work/${next.slug}`}
              className="group block"
              style={{ textDecoration: "none" }}
            >
              <h2
                className="text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.8rem, 3vw, 3rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  maxWidth: "22ch",
                  fontVariationSettings: "'SOFT' 50, 'WONK' 1",
                }}
              >
                {next.title} →
              </h2>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "0.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#666",
                }}
              >
                {next.client} — {next.year}
              </span>
            </Link>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
