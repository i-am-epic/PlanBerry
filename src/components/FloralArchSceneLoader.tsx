"use client";

import dynamic from "next/dynamic";

const FloralArchScene = dynamic(() => import("./FloralArchScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: "100dvh", minHeight: 600, background: "#080808" }}
      aria-hidden
    />
  ),
});

export default function FloralArchSceneLoader() {
  return <FloralArchScene />;
}
