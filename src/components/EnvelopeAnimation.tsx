'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const EnvelopeAnimation = () => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [flapZIndex, setFlapZIndex] = useState(50); // Flap starts in front of the envelope

  useEffect(() => {
    setTimeout(() => setStartAnimation(true), 500); // Start flap animation
    setTimeout(() => {
      setFlapZIndex(10); // Move the flap behind the envelope once it starts opening
    }, 1300); // This will be after the flap animation starts
    setTimeout(() => setShowLetter(true), 2000); // Show letter after flap opens completely
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-100">
      {/* Envelope Container */}
      <div className="relative w-40 h-28 z-10">
        {/* Envelope Body */}
        <div className="absolute top-0 left-0 w-full h-full bg-yellow-500 shadow-lg rounded-b-md z-50" />

        {/* Flap (Triangle) - stays visible after opening */}
        <motion.div
          className="absolute top-0 left-0 w-0 h-0 border-l-[80px] border-r-[80px] border-t-[60px] border-l-transparent border-r-transparent border-t-yellow-600 origin-top"
          initial={{ rotateX: 0 }}
          animate={startAnimation ? { rotateX: 180 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            transformOrigin: 'top center',
            zIndex: flapZIndex, // Dynamically adjust z-index of flap
          }}
        />

        {/* Letter (Centered and emerges from flap opening) */}
        {showLetter && (
          <div className="absolute top-1/3 w-full flex justify-center z-40">
            <motion.div
              className="w-28 h-20 bg-white border shadow-md rounded-sm"
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: -80, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnvelopeAnimation;
