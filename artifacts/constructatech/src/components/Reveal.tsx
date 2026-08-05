import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  /** Seconds to delay the animation — used to stagger siblings. */
  delay?: number;
  className?: string;
}

/**
 * Fades content up as it scrolls into view.
 *
 * When the visitor has asked their OS to reduce motion, this renders a plain
 * element with no transform and no transition — the content is simply there.
 * `once` keeps it from replaying on every scroll past, which reads as noise.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
