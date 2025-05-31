import React from 'react';
import { Heart as HeartIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  delay: number;
  envelopeHeight: number;
  offsetY: number;
  size: number;
}

const Heart: React.FC<Props> = ({ delay, envelopeHeight, offsetY, size }) => {
  return (
    <motion.div
      className="z-12"
      animate={{
        y: [envelopeHeight * 0.1, envelopeHeight * -1 * offsetY],
        x: [0, -5, 5, -5, 5, -5, 5, -5, 5, 0],
        opacity: [0, 1, 1, 1, 1],
      }}
      exit={{ opacity: 0, y: '-20%' }}
      initial={{ y: envelopeHeight * 0.1, opacity: 0 }}
      transition={{
        duration: 1.75,
        ease: 'easeInOut',
        delay: delay,
      }}
    >
      <HeartIcon color="red" fill="red" size={size} />
    </motion.div>
  );
};

export default Heart;
