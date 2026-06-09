/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Calendar, Heart } from 'lucide-react';

export default function Countdown() {
  // Target Wedding Date: Friday 16 October 2026 at 8:00 PM (Egypt time, UTC+3)
  // 2026-10-16T20:00:00+03:00 is equivalently 2026-10-16T17:00:00Z in UTC.
  const targetDate = new Date('2026-10-16T20:00:00+03:00');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +targetDate - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: 'Days', val: timeLeft.days },
    { label: 'Hours', val: timeLeft.hours },
    { label: 'Minutes', val: timeLeft.minutes },
    { label: 'Seconds', val: timeLeft.seconds }
  ];

  return (
    <div className="my-10 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-4 w-4 text-gold-medium fill-gold-medium animate-pulse" />
        <span className="font-serif text-xs md:text-sm uppercase tracking-[0.2em] text-olive-medium font-bold">
          Counting Down to the Big Day
        </span>
        <Heart className="h-4 w-4 text-gold-medium fill-gold-medium animate-pulse" />
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-6 w-full max-w-lg px-2">
        {timeBlocks.map((block) => (
          <div
            key={block.label}
            className="flex flex-col items-center p-3 md:p-5 bg-ivory/80 border border-gold-medium/20 rounded-2xl shadow-md backdrop-blur-xs relative overflow-hidden"
            style={{ minHeight: '80px' }}
          >
            {/* Elegant upper gold border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-light via-gold-medium to-gold-dark"></div>
            
            <span className="font-serif text-3xl md:text-4xl font-extrabold text-olive-medium tracking-tight">
              {String(block.val).padStart(2, '0')}
            </span>

            <span className="text-[9px] md:text-[10px] font-cinzel text-gold-dark font-extrabold tracking-widest uppercase mt-2">
              {block.label}
            </span>
          </div>
        ))}
      </div>

      {timeLeft.isOver && (
        <span className="mt-4 px-4 py-1.5 rounded-full bg-olive-light text-olive-dark text-xs font-semibold uppercase tracking-widest">
          The Celebration Has Begun! 🎉
        </span>
      )}
    </div>
  );
}
