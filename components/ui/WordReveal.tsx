"use client";

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function WordReveal({
  text,
  as: Tag = "h2",
  className,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag className={className}>
      {text.split(" ").map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="-mb-[0.12em] mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className={cn("inline-block")}
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.05 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}