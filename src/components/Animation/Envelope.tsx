'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from '@components/Animation';
import { HeartIcon } from 'lucide-react';
import { heartsConfig } from '@constants/animation';
import { useState, useEffect, useMemo } from 'react';
import { Progress } from '@components/Form';

const Envelope = () => {
  const [flapZIndex, setFlapZIndex] = useState(30);
  const [isReady, setIsReady] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [size, setSize] = useState({ width: 320, height: 224, flap: 120 });
  const [startAnimation, setStartAnimation] = useState(false);

  const updateSizeByWidth = (width: number) => {
    let newWidth;
    if (width > 1024) newWidth = 200;
    else if (width > 500) newWidth = 150;
    else newWidth = 100;

    const height = newWidth * (224 / 320);
    const flap = newWidth * (120 / 320);

    setSize({ width: newWidth, height, flap });
    setIsReady(true);
  };

  useEffect(() => {
    updateSizeByWidth(window.innerWidth);

    const handleResize = () => updateSizeByWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const timers = [
      setTimeout(() => setStartAnimation(true), 500),
      setTimeout(() => setShowLetter(true), 800),
      setTimeout(() => setFlapZIndex(5), 1000),
      setTimeout(() => setShowHeart(true), 1200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isReady]);

  const scaleFactor = useMemo(() => size.width / 287.8, [size.width]);

  if (!isReady)
    return (
      <div className="flex items-center justify-center h-[108px] md:h-[161px] lg:h-[215px]">
        <Progress color="white" size={16} />
      </div>
    );

  const letterWidth = size.width * 0.7;
  const letterHeight = size.height * 0.6;

  return (
    <div
      className="relative flex flex-col items-center justify-end"
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
            className="top-[30%] absolute bg-white border shadow-lg rounded-md flex items-center justify-center z-10 overflow-visible"
            style={{
              width: `${letterWidth}px`,
              height: `${letterHeight}px`,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: `calc(-${letterHeight}px - ${size.flap / 8}px)`,
              opacity: 1,
            }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full h-full">
              <AnimatePresence>
                {heartsConfig.map(
                  ({ delay, baseOffsetY, baseOffsetX, baseSize }, index) => (
                    <Heart
                      key={`heart-${index}`}
                      delay={delay}
                      offsetY={baseOffsetY * letterHeight}
                      offsetX={baseOffsetX * letterWidth}
                      size={baseSize * scaleFactor}
                      envelopeHeight={size.height}
                    />
                  ),
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
        <motion.div
          className="absolute top-0 left-0 w-0 h-0 border-l-transparent border-r-transparent border-t-yellow-500 origin-top"
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

        {showHeart && (
          <motion.div
            className="absolute bottom-[22%] z-40 flex items-center justify-center"
            style={{
              width: `${size.width * 0.4}px`,
              height: `${size.width * 0.4}px`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          >
            <HeartIcon
              color="#fb3e71"
              data-testid="envelope-heart"
              fill="#fb3e71"
              size={size.width * 0.7}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Envelope;
