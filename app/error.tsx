"use client";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <section
      style={{
        minHeight: "60vh",
        display: "grid",
        placeContent: "center",
        padding: "48px 24px",
        color: "var(--foreground)",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          margin: "0 0 12px",
          color: "var(--brand-wood)",
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "clamp(2.5rem, 8vw, 4rem)",
          fontWeight: 500,
        }}
      >
        Something Went Wrong
      </h1>
      <p style={{ margin: "0 0 24px", lineHeight: 1.6 }}>
        contact the owner or try again later
      </p>
      <button
        onClick={retry}
        style={{
          justifySelf: "center",
          padding: "12px 20px",
          border: 0,
          background: "var(--brand-wood)",
          color: "var(--brand-ivory)",
          cursor: "pointer",
          font: "inherit",
        }}
      >
        Try again
      </button>
    </section>
  );
}