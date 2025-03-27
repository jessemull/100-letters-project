'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const EnvelopeAnimation = () => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [flapZIndex, setFlapZIndex] = useState(50); // Flap starts in front of the envelope
  const [showText, setShowText] = useState(false); // Controls text appearance

  useEffect(() => {
    setTimeout(() => {
      setStartAnimation(true); // Start flap animation
    }, 500);

    setTimeout(() => {
      setShowText(true); // Text appears 1 second after flap starts opening
    }, 1000);

    setTimeout(() => {
      setFlapZIndex(10); // Move the flap behind the envelope once it starts opening
    }, 1300);

    setTimeout(() => setShowLetter(true), 1000); // Show letter after flap opens completely
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-100">
      {/* Envelope Container */}
      <div className="relative w-40 h-28 z-10 flex items-center justify-center">
        {/* Envelope Body */}
        <div className="absolute top-0 left-0 w-full h-full bg-yellow-500 shadow-lg rounded-b-md z-50" />

        {/* Flap (Triangle) */}
        <motion.div
          className="absolute top-0 left-0 w-0 h-0 border-l-[80px] border-r-[80px] border-t-[60px] border-l-transparent border-r-transparent border-t-yellow-600 origin-top"
          initial={{ rotateX: 0 }}
          animate={startAnimation ? { rotateX: 180 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            transformOrigin: 'top center',
            zIndex: flapZIndex,
          }}
        />

        {/* Letter */}
        {showLetter && (
          <div className="absolute top-1/3 w-full flex justify-center z-40">
            <motion.div
              className="w-28 h-20 bg-white border shadow-md rounded-sm flex items-center justify-center"
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: -80, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
        )}

        {/* Centered Text (Each word in its own div) */}
        {showText && (
          <motion.div
            className="absolute w-full h-full flex flex-col items-center justify-center text-2xl font-bold z-50 font-merriweather text-midnight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
            // style={{ fontFamily: "'Merriweather', serif", color: "#1E3A8A" }} // Deep Navy Blue
          >
            <div>100</div>
            <div>Letters</div>
            <div>Project</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnvelopeAnimation;
