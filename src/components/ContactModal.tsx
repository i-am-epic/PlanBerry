"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { useForm, ValidationError } from "@formspree/react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

const FORM_ID = "xaqlrerb";

const eventTypes = [
  "Corporate Event",
  "Wedding",
  "Brand Launch",
  "Private Gathering",
  "Conference / Summit",
  "Festival / Cultural",
];

const guestRanges = ["< 50", "50 – 200", "200 – 500", "500 – 1,500", "1,500+"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Chip selections — stored in state, submitted as hidden inputs
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedGuests, setSelectedGuests] = useState<string>("");

  // Formspree hook: state.succeeded / state.submitting / state.errors
  const [state, handleSubmit, reset] = useForm(FORM_ID);

  // Open / close GSAP animation + state reset on re-open
  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (open) {
      // Reset form state so re-opening after a submission shows a blank form
      reset();
      setSelectedType("");
      setSelectedGuests("");
      document.body.style.overflow = "hidden";
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(
        panel,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, ease: "expo.out", delay: 0.06 }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] hidden items-stretch justify-end"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={handleBackdrop}
    >
      <div
        ref={panelRef}
        className="relative flex flex-col w-full md:w-[520px] lg:w-[560px] h-full"
        style={{ background: "#0d0d0d", borderLeft: "1px solid rgba(255,255,255,0.07)" }}
      >
        {state.succeeded ? (
          /* ── Confirmation ── */
          <div className="flex flex-col items-start justify-center h-full px-10 md:px-14">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center mb-8">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="1.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                  fontVariationSettings: "'SOFT' 60, 'WONK' 1",
                  lineHeight: 1.1,
                  color: "#f5f5f0",
                  marginBottom: "1.2rem",
                }}
              >
                Brief received.{" "}
                <span
                  className="italic"
                  style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
                >
                  We&apos;ll be in touch.
                </span>
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.7,
                }}
              >
                Our team reviews every brief personally. Expect to hear from us within 24
                hours — every inquiry is treated with full confidentiality.
              </p>
            </div>
            <button onClick={onClose} className="btn-secondary" style={{ paddingLeft: 0 }}>
              Close
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div
              className="shrink-0 flex items-start justify-between"
              style={{
                padding:
                  "clamp(2rem, 5vh, 3rem) clamp(1.75rem, 4vw, 3rem) 0",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#555",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  Submit Your Brief
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                    fontVariationSettings: "'SOFT' 50, 'WONK' 1",
                    lineHeight: 1.1,
                    color: "#f5f5f0",
                  }}
                >
                  What are we{" "}
                  <span
                    className="italic"
                    style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
                  >
                    creating
                  </span>{" "}
                  together?
                </h2>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 mt-1"
                style={{ background: "rgba(255,255,255,0.05)", color: "#666" }}
                aria-label="Close"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Form ── */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto overscroll-contain"
              style={{
                padding:
                  "clamp(1.5rem, 3vh, 2.25rem) clamp(1.75rem, 4vw, 3rem)",
                paddingBottom: "clamp(2.5rem, 5vh, 4rem)",
              }}
            >
              {/*
               * Hidden inputs carry chip-selection values into the submission.
               * Formspree will label them "Event Type" and "Guest Count".
               */}
              <input type="hidden" name="event_type" value={selectedType} />
              <input type="hidden" name="guest_count" value={selectedGuests} />

              {/* Event type chips */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={labelStyle}>Type of event</label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {eventTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedType(t === selectedType ? "" : t)}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.78rem",
                        fontWeight: selectedType === t ? 500 : 300,
                        color: selectedType === t ? "#080808" : "rgba(255,255,255,0.55)",
                        background:
                          selectedType === t ? "#f5f5f0" : "rgba(255,255,255,0.04)",
                        border:
                          selectedType === t
                            ? "1px solid #f5f5f0"
                            : "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "999px",
                        padding: "0.4rem 1rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + Company */}
              <div className="grid grid-cols-2 gap-4" style={{ marginBottom: "0" }}>
                <div>
                  <label style={labelStyle}>Your name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Arjun Mehta"
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderBottomColor =
                        "rgba(255,255,255,0.35)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderBottomColor =
                        "rgba(255,255,255,0.12)";
                    }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Company / Brand</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Meridian Group"
                    style={inputStyle}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderBottomColor =
                        "rgba(255,255,255,0.35)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderBottomColor =
                        "rgba(255,255,255,0.12)";
                    }}
                  />
                </div>
              </div>

              <div className="h-[1px] bg-[rgba(255,255,255,0.05)]" style={{ margin: "1.5rem 0" }} />

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-4" style={{ marginBottom: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="hello@you.com"
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderBottomColor =
                        "rgba(255,255,255,0.35)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderBottomColor =
                        "rgba(255,255,255,0.12)";
                    }}
                  />
                  {/* Inline email validation error */}
                  <ValidationError
                    field="email"
                    prefix="Email"
                    errors={state.errors}
                    style={{
                      display: "block",
                      marginTop: "0.35rem",
                      fontSize: "0.7rem",
                      color: "rgba(255,120,120,0.85)",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    style={inputStyle}
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderBottomColor =
                        "rgba(255,255,255,0.35)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderBottomColor =
                        "rgba(255,255,255,0.12)";
                    }}
                  />
                </div>
              </div>

              {/* Date */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Event date (approximate)</label>
                <input
                  type="text"
                  name="event_date"
                  placeholder="December 2025 / TBD"
                  style={inputStyle}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderBottomColor =
                      "rgba(255,255,255,0.35)";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderBottomColor =
                      "rgba(255,255,255,0.12)";
                  }}
                />
              </div>

              {/* Guest count chips */}
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={labelStyle}>Expected guests</label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {guestRanges.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedGuests(r === selectedGuests ? "" : r)}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.78rem",
                        fontWeight: selectedGuests === r ? 500 : 300,
                        color: selectedGuests === r ? "#080808" : "rgba(255,255,255,0.5)",
                        background:
                          selectedGuests === r ? "#f5f5f0" : "rgba(255,255,255,0.04)",
                        border:
                          selectedGuests === r
                            ? "1px solid #f5f5f0"
                            : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "999px",
                        padding: "0.35rem 0.9rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vision */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={labelStyle}>Describe your vision</label>
                <textarea
                  name="vision"
                  placeholder="In one sentence — what feeling do you want your guests to walk away with?"
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: "none",
                    lineHeight: 1.7,
                    paddingTop: "0.75rem",
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLTextAreaElement).style.borderBottomColor =
                      "rgba(255,255,255,0.35)";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLTextAreaElement).style.borderBottomColor =
                      "rgba(255,255,255,0.12)";
                  }}
                />
              </div>

              {/* Generic server / network error */}
              {Array.isArray(state.errors) && state.errors.length > 0 && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "rgba(255,120,120,0.85)",
                    marginBottom: "1rem",
                    lineHeight: 1.5,
                  }}
                >
                  Something went wrong — please check your details and try again.
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary"
                disabled={state.submitting}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: state.submitting ? 0.6 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {state.submitting ? "Sending…" : "Submit Your Brief"}
                {!state.submitting && (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                )}
              </button>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  color: "#444",
                  textAlign: "center",
                  marginTop: "1.25rem",
                  lineHeight: 1.6,
                }}
              >
                We respond within 24 hours. Every inquiry is treated with full
                confidentiality.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.68rem",
  fontWeight: 400,
  letterSpacing: "0.12em",
  color: "#555",
  display: "block",
  marginBottom: "0.5rem",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 0,
  padding: "0.55rem 0",
  color: "#f5f5f0",
  fontFamily: "var(--font-body)",
  fontSize: "0.88rem",
  fontWeight: 300,
  outline: "none",
  transition: "border-color 0.25s",
  marginTop: "0.2rem",
};
