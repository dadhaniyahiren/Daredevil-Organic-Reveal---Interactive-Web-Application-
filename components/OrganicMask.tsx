
import React, { useMemo, useEffect, useState } from 'react';
import { motion, useTransform, MotionValue, useVelocity } from 'framer-motion';

interface OrganicMaskProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  radius: MotionValue<number>;
  isHovering: boolean;
}

const OrganicMask: React.FC<OrganicMaskProps> = ({ x, y, radius }) => {
  // Use velocity to create deformation (stretching)
  const velX = useVelocity(x);
  const velY = useVelocity(y);

  // Define 8 points for a smooth blob path
  const points = 8;
  const angleStep = (Math.PI * 2) / points;

  // We'll create "springy" offsets for each point to create the organic fluid feel
  // Using React state to trigger re-renders for the path string
  // In a production environment with massive complexity, we'd use a dedicated canvas or lower-level animation loop,
  // but for a single mask, Framer Motion's useTransform combined with SVG is efficient.
  
  const [path, setPath] = useState("");

  useEffect(() => {
    // We update the path on every frame where values change
    const updatePath = () => {
      const currentX = x.get();
      const currentY = y.get();
      const currentR = radius.get();
      const vX = velX.get() * 0.05; // Strength of deformation
      const vY = velY.get() * 0.05;

      if (currentR <= 0.1) {
        setPath("");
        return;
      }

      const pathPoints: { x: number; y: number }[] = [];

      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep;
        
        // Calculate organic "wobble" and "stretch"
        // Points facing the direction of movement stretch more
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        // Dot product of point direction and velocity direction
        const dot = cos * vX + sin * vY;
        const deformation = Math.max(0, dot * 0.5); // Only stretch forward
        
        // Subtle "breath" based on sin/cos
        const noise = Math.sin(Date.now() * 0.002 + i) * (currentR * 0.05);

        const r = currentR + deformation + noise;
        
        pathPoints.push({
          x: currentX + Math.cos(angle) * r,
          y: currentY + Math.sin(angle) * r,
        });
      }

      // Build Catmull-Rom or simple Bezier path
      // Here we use a smooth SVG curve (C)
      let d = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
      for (let i = 0; i < points; i++) {
        const p0 = pathPoints[i];
        const p1 = pathPoints[(i + 1) % points];
        const midX = (p0.x + p1.x) / 2;
        const midY = (p0.y + p1.y) / 2;
        
        // Create organic curves using quadratic beziers
        d += ` Q ${p0.x} ${p0.y}, ${midX} ${midY}`;
      }
      d += " Z";

      setPath(d);
    };

    const unsubscribeX = x.on("change", updatePath);
    const unsubscribeY = y.on("change", updatePath);
    const unsubscribeR = radius.on("change", updatePath);
    
    // Also run an animation loop for the "breathing" effect when static
    const animationFrame = requestAnimationFrame(function animate() {
      updatePath();
      requestAnimationFrame(animate);
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
      unsubscribeR();
      cancelAnimationFrame(animationFrame);
    };
  }, [x, y, radius, velX, velY, points, angleStep]);

  return (
    <path 
      d={path} 
      fill="white" 
    />
  );
};

export default OrganicMask;
