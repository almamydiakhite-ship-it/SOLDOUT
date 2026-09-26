import React from 'react';
import { FingerprintLogo } from './FingerprintLogo';
import { MARQUEE_ITEMS } from '../data/products';

export const Marquee: React.FC = () => {
  return (
    <div className="overflow-hidden border-y so-hairline bg-ink-900 py-4 select-none">
      <div className="so-marquee-track flex w-max">
        {[0, 1].map((setIndex) => (
          <div
            key={setIndex}
            className="flex shrink-0 animate-marquee"
            aria-hidden={setIndex === 1}
          >
            {MARQUEE_ITEMS.map((item) => (
              <span
                key={`${setIndex}-${item}`}
                className="so-label flex shrink-0 items-center gap-10 pr-10 text-fog tracking-[0.24em]"
              >
                {item}
                <FingerprintLogo
                  className="h-4 w-auto text-rose/60"
                  strokeWidth={2.4}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
