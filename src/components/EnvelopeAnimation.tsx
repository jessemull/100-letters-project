'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, MutableRefObject } from 'react';
import { useResizeDetector } from 'react-resize-detector';

interface EnvelopeAnimationProps {
  containerRef: MutableRefObject<HTMLElement>;
}

const EnvelopeAnimation: React.FC<EnvelopeAnimationProps> = ({
  containerRef,
}) => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [flapZIndex, setFlapZIndex] = useState(30);
  const [showText, setShowText] = useState(false);
  const [size, setSize] = useState({ width: 320, height: 224, flap: 120 });
  const [textSize, setTextSize] = useState('text-4xl');
  const [isReady, setIsReady] = useState(false); // Add isReady state

  // Resize listener for parent container
  const { width } = useResizeDetector({
    targetRef: containerRef,
  });

  // Dynamically adjust envelope and text size based on container width
  useEffect(() => {
    if (width) {
      const newWidth = Math.max(width * 0.25, 110); // Set envelope width to 35% of container width
      const height = newWidth * (224 / 320); // Maintain relative proportions
      const flap = newWidth * (120 / 320); // Maintain flap size proportion

      setSize({ width: newWidth, height, flap });

      // Dynamically set text size based on the width
      let newTextSize: string;

      if (newWidth < 320 * 0.25) {
        newTextSize = 'text-xs';
      } else if (newWidth < 480 * 0.25) {
        newTextSize = 'text-sm';
      } else if (newWidth < 640 * 0.25) {
        newTextSize = 'text-lg';
      } else if (newWidth < 740 * 0.25) {
        newTextSize = 'text-xl';
      } else if (newWidth < 840 * 0.25) {
        newTextSize = 'text-2xl';
      } else if (newWidth < 940 * 0.25) {
        newTextSize = 'text-3xl';
      } else {
        newTextSize = 'text-4xl';
      }

      // Only update text size if it's different from the current value
      if (newTextSize !== textSize) {
        setTextSize(newTextSize);
      }

      // Set isReady to true once the size calculation is done
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
    return null; // Don't render the animation until the sizes are calculated
  }

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-100">
      {/* Envelope Container (Dynamically sized) */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: size.width, height: size.height }}
        animate={{
          translateY: startAnimation ? `${Math.round(size.flap / 4)}px` : '0',
        }} // Move the envelope down by the flap height
        transition={{ duration: 0.8 }} // Ensure the duration matches the flap animation
      >
        {/* Envelope Body */}
        <div className="absolute top-0 left-0 w-full h-full bg-yellow-500 shadow-lg rounded-b-md z-20" />

        {/* Letter (Moves up between envelope and flap) */}
        {showLetter && (
          <motion.div
            className="absolute bg-white border shadow-md rounded-sm flex items-center justify-center"
            style={{
              width: size.width * 0.7, // 70% of envelope width
              height: size.height * 0.6, // 60% of envelope height
              top: `30%`, // Keep the letter in the correct position
              zIndex: 10, // Appears in front of the envelope, but behind the flap
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: `calc(-${size.height * 0.6}px - ${size.flap / 8}px)`, // Moves the letter past the flap half the flap height
              opacity: 1,
            }}
            transition={{ duration: 0.8 }}
          />
        )}

        {/* Flap (Triangle) */}
        <motion.div
          className="absolute top-0 left-0 w-0 h-0 border-l-transparent border-r-transparent border-t-yellow-600 origin-top"
          style={{
            borderLeftWidth: size.width * 0.5,
            borderRightWidth: size.width * 0.5,
            borderTopWidth: size.flap,
            zIndex: flapZIndex,
          }}
          initial={{ rotateX: 0 }}
          animate={startAnimation ? { rotateX: 180 } : {}}
          transition={{ duration: 0.8 }}
        />

        {/* Centered Text */}
        {showText && (
          <motion.div
            className={`absolute flex flex-col items-center justify-center ${textSize} font-bold z-40 font-merriweather text-midnight`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
          >
            <div>100</div>
            <div>Letters</div>
            <div>Project</div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EnvelopeAnimation;
