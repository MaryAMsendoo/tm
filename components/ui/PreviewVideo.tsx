"use client";

import { useEffect, useRef } from "react";
import { enquiryThumbnail } from "../../lib/data";

export function PreviewVideo({
  src,
  className,
  poster = enquiryThumbnail(src),
}: {
  src: string;
  className: string;
  /** Still shown until the video can play. Defaults to the video's known poster. */
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(false);
  const hoveredRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!("IntersectionObserver" in window)) {
      void video.play().catch(() => {});
      return () => video.pause();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting || hoveredRef.current) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      onMouseEnter={() => {
        hoveredRef.current = true;
        void videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
        if (!inViewRef.current) videoRef.current?.pause();
      }}
      className={className}
    />
  );
}