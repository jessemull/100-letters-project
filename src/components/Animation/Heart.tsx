'use client';

import React from 'react';
import { Heart as HeartIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  delay: number;
  envelopeHeight: number;
  offsetX: number;
  offsetY: number;
  size: number;
}

const Heart: React.FC<Props> = ({
  delay,
  envelopeHeight,
  offsetX,
  offsetY,
  size,
}) => {
  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: `${offsetX}px`,
        top: `${offsetY}px`,
      }}
      animate={{
        y: [0, -envelopeHeight * 1.5],
        x: [0, -5, 5, -5, 5, 0],
        opacity: [0, 1, 1, 1, 0],
      }}
      initial={{ y: 0, opacity: 0 }}
      transition={{
        duration: 3,
        ease: 'easeInOut',
        delay: delay,
      }}
    >
      <HeartIcon color="#fb3e71" fill="#fb3e71" size={size} />
    </motion.div>
  );
};

export default Heart;
