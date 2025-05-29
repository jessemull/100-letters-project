'use client';

import React, { useRef, useEffect, useState } from 'react';
import Tick from '@pqina/flip';
import '@pqina/flip/dist/flip.min.css';

interface Props {
  earliestSentAtDate?: string;
}

const Clock: React.FC<Props> = ({ earliestSentAtDate }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tickInstanceRef = useRef<any>(null);
  const [tickValue, setTickValue] = useState<string>();

  useEffect(() => {
    const initTick = (tick: any) => {
      tickInstanceRef.current = tick;
    };

    if (containerRef.current) {
      Tick.DOM.create(containerRef.current, {
        didInit: initTick,
      });
    }

    // Strict mode in development causes unwanted re-renders that destroy the clock.

    return () => {
      if (process.env.NODE_ENV !== 'development' && tickInstanceRef.current) {
        Tick.DOM.destroy(tickInstanceRef.current);
        tickInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // If there is no earliest sent at date just count down from a year until a letter is written.

    const baseDate = earliestSentAtDate
      ? new Date(earliestSentAtDate)
      : new Date();

    const deadline = new Date(
      baseDate.getTime() + Tick.helper.duration(1, 'years'),
    );

    const counter = Tick.count.down(deadline, {
      format: ['d', 'h', 'm', 's'],
    });

    counter.onupdate = (val: string) => {
      setTickValue(val);
    };

    return () => {
      counter?.timer?.stop();
    };
  }, [earliestSentAtDate]);

  useEffect(() => {
    if (tickInstanceRef.current && tickValue) {
      tickInstanceRef.current.value = tickValue;
    }
  }, [tickValue]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-semibold mb-2">Ink Runs Dry In</p>
      <div
        className="
          tick
          flex justify-center
          text-2xl
          sm:text-3xl
          md:text-4xl
          lg:text-5xl
        "
        ref={containerRef}
      >
        <div
          data-repeat="true"
          data-layout="horizontal center fit"
          data-transform="preset(d, h, m, s) -> delay"
          className="flex gap-5"
        >
          <div className="tick-group flex flex-col items-center gap-1">
            <div
              data-key="value"
              data-repeat="true"
              data-transform="pad(00) -> split -> delay"
            >
              <span data-view="flip"></span>
            </div>
            <span
              data-key="label"
              data-view="text"
              className="tick-label text-sm mt-1"
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
