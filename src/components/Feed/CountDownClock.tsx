'use client';

import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  parseISO,
  isBefore,
  addYears,
  addMonths,
  addDays,
  addHours,
  addMinutes,
} from 'date-fns';

type Theme = 'light' | 'dark';
type Size = 'large' | 'medium' | 'small' | 'extra-small';
type TitlePosition = 'top' | 'bottom';

interface FlipCountdownProps {
  theme?: Theme;
  size?: Size;
  endAt?: string | Date;
  hideYear?: boolean;
  hideMonth?: boolean;
  hideDay?: boolean;
  hideHour?: boolean;
  hideMinute?: boolean;
  hideSecond?: boolean;
  titlePosition?: TitlePosition;
  yearTitle?: string;
  monthTitle?: string;
  dayTitle?: string;
  hourTitle?: string;
  minuteTitle?: string;
  secondTitle?: string;
  endAtZero?: boolean;
  onTimeUp?: () => void;
  children?: React.ReactNode;
}

interface TimeUnit {
  title: string;
  value: number;
  prevValue: number;
  ref: MutableRefObject<HTMLSpanElement | null>;
}

const FlipCountdown: React.FC<FlipCountdownProps> = ({
  theme = 'dark',
  size = 'medium',
  endAt = new Date(),
  hideYear = false,
  hideMonth = false,
  hideDay = false,
  hideHour = false,
  hideMinute = false,
  hideSecond = false,
  titlePosition = 'top',
  yearTitle,
  monthTitle,
  dayTitle,
  hourTitle,
  minuteTitle,
  secondTitle,
  endAtZero = false,
  onTimeUp = () => {},
  children,
}) => {
  const endDate = typeof endAt === 'string' ? parseISO(endAt) : endAt;

  const [time, setTime] = useState({
    year: 0,
    prevYear: 0,
    month: 0,
    prevMonth: 0,
    day: 0,
    prevDay: 0,
    hour: 0,
    prevHour: 0,
    minute: 0,
    prevMinute: 0,
    second: 0,
    prevSecond: 0,
  });

  const [completed, setCompleted] = useState(false);

  const refs = {
    year: useRef<HTMLSpanElement>(null),
    month: useRef<HTMLSpanElement>(null),
    day: useRef<HTMLSpanElement>(null),
    hour: useRef<HTMLSpanElement>(null),
    minute: useRef<HTMLSpanElement>(null),
    second: useRef<HTMLSpanElement>(null),
  };

  const triggerFlip = (unit: keyof typeof refs) => {
    const el = refs[unit].current;
    if (!el) return;
    ['one', 'two'].forEach((secClass) => {
      const section = el.querySelector(
        `.flip-countdown-card-sec.${secClass}`,
      ) as HTMLElement;
      if (!section) return;
      section.classList.remove('flip');
      section.offsetWidth;
      section.classList.add('flip');
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();

      if (isBefore(endDate, now)) {
        setCompleted(true);
        clearInterval(intervalId);
        onTimeUp();
        return;
      }

      const years = differenceInYears(endDate, now);
      const afterYears = addYears(now, years);

      const months = differenceInMonths(endDate, afterYears);
      const afterMonths = addMonths(afterYears, months);

      const days = differenceInDays(endDate, afterMonths);
      const afterDays = addDays(afterMonths, days);

      const hours = differenceInHours(endDate, afterDays);
      const afterHours = addHours(afterDays, hours);

      const minutes = differenceInMinutes(endDate, afterHours);
      const afterMinutes = addMinutes(afterHours, minutes);

      const seconds = differenceInSeconds(endDate, afterMinutes);

      setTime((prevTime) => {
        const newTime = {
          year: years,
          prevYear: prevTime.year,
          month: months,
          prevMonth: prevTime.month,
          day: days,
          prevDay: prevTime.day,
          hour: hours,
          prevHour: prevTime.hour,
          minute: minutes,
          prevMinute: prevTime.minute,
          second: seconds,
          prevSecond: prevTime.second,
        };

        (['year', 'month', 'day', 'hour', 'minute', 'second'] as const).forEach(
          (unit) => {
            if (unit === 'year' && hideYear) return;
            if (unit === 'month' && hideMonth) return;
            if (unit === 'day' && hideDay) return;
            if (unit === 'hour' && hideHour) return;
            if (unit === 'minute' && hideMinute) return;
            if (unit === 'second' && hideSecond) return;

            const curVal = newTime[unit];
            const prevVal = prevTime[unit];

            const curTens = Math.floor(curVal / 10);
            const curOnes = curVal % 10;
            const prevTens = Math.floor(prevVal / 10);
            const prevOnes = prevVal % 10;

            if (curTens !== prevTens || curOnes !== prevOnes) {
              triggerFlip(unit);
            }
          },
        );

        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endDate, hideYear, hideMonth, hideDay, hideHour, hideMinute, hideSecond]);

  const getPiece = (key: keyof typeof refs) => {
    const val = time[key];
    const prevVal = time[
      `prev${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof typeof time
    ] as number;

    const part1 = Math.floor(val / 10);
    const part2 = val % 10;
    const prev1 = Math.floor(prevVal / 10);
    const prev2 = prevVal % 10;

    const titleMap: Record<string, string | undefined> = {
      year: yearTitle,
      month: monthTitle,
      day: dayTitle,
      hour: hourTitle,
      minute: minuteTitle,
      second: secondTitle,
    };

    return (
      <span className="flip-countdown-piece" ref={refs[key]}>
        {titlePosition === 'top' && (
          <span className="flip-countdown-title">
            {titleMap[key] || key.charAt(0).toUpperCase() + key.slice(1)}
          </span>
        )}

        <span className="flip-countdown-card">
          <span className="flip-countdown-card-sec one">
            <span className="card__top">{part1}</span>
            <span className="card__bottom" data-value={prev1} />
            <span className="card__back" data-value={prev1}>
              <span className="card__bottom" data-value={part1} />
            </span>
          </span>

          <span className="flip-countdown-card-sec two">
            <span className="card__top">{part2}</span>
            <span className="card__bottom" data-value={prev2} />
            <span className="card__back" data-value={prev2}>
              <span className="card__bottom" data-value={part2} />
            </span>
          </span>
        </span>

        {titlePosition === 'bottom' && (
          <span className="flip-countdown-title">
            {titleMap[key] || key.charAt(0).toUpperCase() + key.slice(1)}
          </span>
        )}
      </span>
    );
  };

  if (completed && !endAtZero) {
    return <div className="flip-countdown">{children || endAt.toString()}</div>;
  }

  return (
    <div className={`flip-countdown theme-${theme} size-${size}`}>
      {!hideYear && getPiece('year')}
      {!hideMonth && getPiece('month')}
      {!hideDay && getPiece('day')}
      {!hideHour && getPiece('hour')}
      {!hideMinute && getPiece('minute')}
      {!hideSecond && getPiece('second')}
    </div>
  );
};

export default FlipCountdown;
