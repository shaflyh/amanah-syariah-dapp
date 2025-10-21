// components/home/animated-stats.tsx
"use client";

import { motion, useInView, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

export function AnimatedStats({
  value,
  label,
  prefix = "",
  suffix = "",
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const springValue = useSpring(0, {
    damping: 60,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [springValue, isInView, value]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          if (Number.isInteger(value)) {
            ref.current.textContent = Intl.NumberFormat("en-US").format(Math.round(latest));
          } else {
            ref.current.textContent = Intl.NumberFormat("id-ID", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }).format(latest);
          }
        }
      }),
    [springValue, value]
  );

  return (
    <div>
      <div className="text-3xl font-semibold text-primary">
        {prefix}
        <span ref={ref}>0</span>
        {suffix}
        <span className="text-gray-800">+</span> {/* Added the plus sign here */}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
