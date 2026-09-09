import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const CustomCursor: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Direct mouse positions
  const mousePos = useRef({ x: -100, y: -100 });
  // Elastic ring position (smoothed)
  const ringPos = useRef({ x: -100, y: -100 });

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if device uses touch/coarse pointer
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Directly translate the center dot without lag
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button, a, .gate-button, .qynx-btn, [role="button"], input, .circuit-slot, canvas')
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth RAF loop for elastic outer ring
    let rafId: number;
    const updateRing = () => {
      if (!prefersReduced) {
        // Linear interpolation with damping factor 0.18
        const lerpFactor = 0.18;
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
        }
      } else {
        // When reduced motion is preferred, jump instantly
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
        }
      }

      rafId = requestAnimationFrame(updateRing);
    };

    rafId = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible, prefersReduced]);

  if (isTouchDevice || prefersReduced) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 'var(--z-cursor, 9999)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}
    >
      {/* Center White Dot: Follows precisely */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          top: -3,
          left: -3,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          pointerEvents: 'none',
          boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
          willChange: 'transform',
        }}
      />

      {/* Outer Purple Elastic Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'absolute',
          top: isHovered ? -22 : -15,
          left: isHovered ? -22 : -15,
          width: isHovered ? '44px' : '30px',
          height: isHovered ? '44px' : '30px',
          borderRadius: '50%',
          border: `1.5px solid ${isHovered ? 'var(--color-purple-50, #A56EFF)' : 'var(--color-purple-60, #8A3FFC)'}`,
          backgroundColor: isHovered ? 'rgba(138, 63, 252, 0.12)' : 'transparent',
          boxShadow: isHovered ? '0 0 16px rgba(138, 63, 252, 0.45)' : '0 0 6px rgba(138, 63, 252, 0.2)',
          pointerEvents: 'none',
          transition: 'width 200ms cubic-bezier(0.16, 1, 0.3, 1), height 200ms cubic-bezier(0.16, 1, 0.3, 1), top 200ms cubic-bezier(0.16, 1, 0.3, 1), left 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms ease, background-color 200ms ease, box-shadow 200ms ease',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
