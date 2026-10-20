"use client";

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#f6f1ea",
          color: "#1f1a17",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: "0 0 12px",
              color: "#4d2d24",
              fontFamily: "Georgia, serif",
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
              background: "#4d2d24",
              color: "#f7f1e6",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}