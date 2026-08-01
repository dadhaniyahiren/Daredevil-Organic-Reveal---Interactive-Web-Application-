
import React, { useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import OrganicMask from './OrganicMask';

interface RevealFrameProps {
  imageA: string;
  imageB: string;
}

const RevealFrame: React.FC<RevealFrameProps> = ({ imageA, imageB }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // High-performance spring config for the "fluid" feel
  const springConfig = { damping: 20, stiffness: 80, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const maskRadius = useMotionValue(0);
  const smoothRadius = useSpring(maskRadius, { damping: 35, stiffness: 120 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    maskRadius.set(240); // Larger reveal for full screen
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    maskRadius.set(0);
  };

  const maskId = "organic-reveal-mask-fs";

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full cursor-none overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image A: Initial State (Matt Murdock) - Static */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imageA} 
          alt="Matt Murdock"
          className="w-full h-full object-cover brightness-[0.8]"
        />
        {/* Dark vignettes to enhance depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Image B: Revealed Identity (Daredevil) - Masked */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ 
          clipPath: `url(#${maskId})`,
          WebkitClipPath: `url(#${maskId})`
        }}
      >
        <img 
          src={imageB} 
          alt="Daredevil"
          className="w-full h-full object-cover scale-[1.01]"
        />
        {/* Red tint/glow for the revealed area */}
        <div className="absolute inset-0 bg-red-900/10 mix-blend-color" />
      </div>

      {/* SVG Mask Definition */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <clipPath id={maskId} clipPathUnits="userSpaceOnUse">
             <OrganicMask 
                x={smoothX} 
                y={smoothY} 
                radius={smoothRadius} 
                isHovering={isHovering}
             />
          </clipPath>
        </defs>
      </svg>

      {/* Enhanced Custom Cursor */}
      <motion.div 
        className="fixed top-0 left-0 w-16 h-16 border-2 border-red-600 rounded-full pointer-events-none z-50 flex items-center justify-center mix-blend-screen"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          scale: useTransform(smoothRadius, [0, 240], [0.4, 1.2]),
          opacity: useTransform(smoothRadius, [0, 40], [0, 1])
        }}
      >
        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
      </motion.div>
    </div>
  );
};

export default RevealFrame;
