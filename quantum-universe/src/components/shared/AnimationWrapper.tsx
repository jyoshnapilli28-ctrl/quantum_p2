import React from 'react';
import { motion } from 'framer-motion';
import { animationConfig } from '../../animations/animationConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AnimationWrapperProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 20,
  className = '',
  style = {}
}) => {
  const prefersReduced = useReducedMotion();

  const getInitialOffset = () => {
    if (prefersReduced || direction === 'none') return { x: 0, y: 0 };
    switch (direction) {
      case 'up': return { x: 0, y: distance };
      case 'down': return { x: 0, y: -distance };
      case 'left': return { x: distance, y: 0 };
      case 'right': return { x: -distance, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };

  const offset = getInitialOffset();

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: animationConfig.durations.pageReveal / 1000,
        delay: delay / 1000,
        ease: animationConfig.easings.smoothOut,
      }}
      className={className}
      style={style as any}
    >
      {children}
    </motion.div>
  );
};
