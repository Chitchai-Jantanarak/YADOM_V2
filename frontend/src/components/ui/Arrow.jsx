import React from 'react';
import { motion } from 'framer-motion';

export default function Arrow  ({ 
  size = 24, 
  color = "currentColor", 
  strokeWidth = 2,
  rotationDeg = 0,
  hoverRotationDeg = -315,
  duration = 0.3
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ rotate: rotationDeg }}
      animate={{ rotate: rotationDeg }}
      whileHover={{ rotate: hoverRotationDeg }}
      transition={{ duration, type: "spring", stiffness: 200 }}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </motion.svg>
  );
};
