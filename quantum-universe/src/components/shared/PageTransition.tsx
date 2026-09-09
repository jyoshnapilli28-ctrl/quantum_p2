import React from 'react';
import { motion } from 'framer-motion';
import { animationConfig } from '../../animations/animationConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  style = {}
}) => {
  const prefersReduced = useReducedMotion();

  const variants = {
    initial: {
      opacity: 0,
      y: prefersReduced ? 0 : 16,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationConfig.durations.pageTransition / 1000,
        ease: animationConfig.easings.smoothOut,
      },
    },
    exit: {
      opacity: 0,
      y: prefersReduced ? 0 : -10,
      transition: {
        duration: 0.2,
        ease: animationConfig.easings.quickOut,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      style={style as any}
    >
      {children}
    </motion.div>
  );
};
