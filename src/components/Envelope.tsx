'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, MutableRefObject } from 'react';
import { useResizeDetector } from 'react-resize-detector';

interface EnvelopeProps {
  containerRef: MutableRefObject<HTMLElement>;
}

const Envelope: React.FC<EnvelopeProps> = ({ containerRef }) => {
  const [flapZIndex, setFlapZIndex] = useState(30);
  const [isReady, setIsReady] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showText, setShowText] = useState(false);
  const [size, setSize] = useState({ width: 320, height: 224, flap: 120 });
  const [startAnimation, setStartAnimation] = useState(false);
  const [textSize, setTextSize] = useState('text-4xl');

  const { width } = useResizeDetector({
    targetRef: containerRef,
  });

  useEffect(() => {
    if (width) {
      let newWidth = Math.max(width * 0.2, 110);

      if (width < 768) {
        newWidth = width * 0.6;
      }

      const height = newWidth * (224 / 320);
      const flap = newWidth * (120 / 320);

      setSize({ width: newWidth, height, flap });

      let newTextSize: string;

      if (newWidth < 320 * 0.25) {
        newTextSize = 'text-xs';
      } else if (newWidth < 480 * 0.25) {
        newTextSize = 'text-sm';
      } else if (newWidth < 640 * 0.25) {
        newTextSize = 'text-lg';
      } else if (newWidth < 768 * 0.25) {
        newTextSize = 'text-xl';
      } else if (newWidth < 1024 * 0.25) {
        newTextSize = 'text-2xl';
      } else if (newWidth < 1280 * 0.25) {
        newTextSize = 'text-3xl';
      } else {
        newTextSize = 'text-4xl';
      }

      if (newTextSize !== textSize) {
        setTextSize(newTextSize);
      }

      setIsReady(true);
    }
  }, [width, textSize]);

  useEffect(() => {
    if (isReady) {
      setTimeout(() => setStartAnimation(true), 500);
      setTimeout(() => setShowLetter(true), 800);
      setTimeout(() => {
        setFlapZIndex(5);
      }, 1000);
      setTimeout(() => setShowText(true), 1200);
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <div
      className="relative flex flex-col items-center justify-end bg-gray-100"
      data-testid="envelope"
      style={{ height: size.height + size.flap }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: size.width, height: size.height }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-0 left-0 w-full h-full shadow-lg rounded-b-md z-20 bg-gradient-to-b from-yellow-400 to-yellow-500" />
        {showLetter && (
          <motion.div
            className="absolute bg-white border shadow-lg rounded-md flex items-center justify-center z-10"
            style={{
              width: `${size.width * 0.7}px`,
              height: `${size.height * 0.6}px`,
              top: '30%',
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: `calc(-${size.height * 0.6}px - ${size.flap / 8}px)`,
              opacity: 1,
            }}
            transition={{ duration: 0.8 }}
          />
        )}
        <motion.div
          className="absolute top-0 left-0 w-0 h-0 border-l-transparent border-r-transparent  border-t-yellow-500 origin-top"
          style={{
            borderLeftWidth: `${size.width * 0.5}px`,
            borderRightWidth: `${size.width * 0.5}px`,
            borderTopWidth: `${size.flap}px`,
            zIndex: flapZIndex,
            background: 'linear-gradient(to bottom, #fdd835 0%, #fbc02d 100%)',
          }}
          initial={{ rotateX: 0 }}
          animate={startAnimation ? { rotateX: 180 } : {}}
          transition={{ duration: 0.8 }}
        />
        {showText && (
          <motion.div
            className={`absolute flex flex-col items-center justify-center ${textSize} font-bold z-40 font-merriweather text-midnight`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
          >
            <div data-testid="msg-100">100</div>
            <div data-testid="msg-letters">Letters</div>
            <div data-testid="msg-letters">Project</div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Envelope;
