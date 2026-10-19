"use client";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  MotionConfig,
} from "motion/react";
import type { ReactNode } from "react";

// The same curve and timing as Product's design-system motion patterns.
export const change = { duration: 0.2, ease: [0.23, 1, 0.32, 1] as const };
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
export function Crossfade({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return (
    <span className="crossfade">
      <AnimatePresence initial={false} mode="popLayout">
        <m.span
          key={value}
          initial={{ opacity: 0, scale: 0.96, filter: "blur(2px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.96, filter: "blur(2px)" }}
          transition={change}
        >
          {children}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
export function Reveal({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <m.div
          className="reveal"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={change}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
}
