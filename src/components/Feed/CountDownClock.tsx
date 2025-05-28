'use client';

import React, { useRef, useEffect, useState } from 'react';
import Tick from '@pqina/flip';
import '@pqina/flip/dist/flip.min.css';

interface Props {
  earliestSentAtDate: string;
}

const CountDownClock: React.FC<Props> = ({ earliestSentAtDate }) => {
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

    return () => {
      if (tickInstanceRef.current) {
        Tick.DOM.destroy(tickInstanceRef.current);
        tickInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!earliestSentAtDate) return;

    const startDate = new Date(earliestSentAtDate);
    const deadline = new Date(
      startDate.getTime() + Tick.helper.duration(1, 'years'),
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
    <>
      <p className="text-lg font-semibold">Ink Runs Dry In</p>
      <div ref={containerRef} className="tick text-4xl">
        <div
          data-repeat="true"
          data-layout="horizontal center fit"
          data-transform="preset(d, h, m, s) -> delay"
        >
          <div className="tick-group flex flex-col items-center gap-1 pr-4">
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
    </>
  );
};

export default CountDownClock;
