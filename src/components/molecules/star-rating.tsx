'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

export interface StarRatingProps {
  /**
   * Current rating value (1-5)
   */
  value?: number;
  /**
   * Callback when rating changes
   */
  onChange?: (rating: number) => void;
  /**
   * Maximum number of stars (default: 5)
   */
  maxStars?: number;
  /**
   * Read-only mode (no interaction)
   */
  readonly?: boolean;
  /**
   * Size of stars in pixels (default: 32)
   */
  size?: number;
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
}

/**
 * Star Rating Molecule
 * Interactive 1-5 star selector (or read-only display)
 * Used in workout completion screen
 * Large touch targets for mobile use
 */
export function StarRating({
  value = 0,
  onChange,
  maxStars = 5,
  readonly = false,
  size = 32,
  ariaLabel = 'Rating'
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || value;

  return (
    <div
      role={readonly ? 'img' : 'radiogroup'}
      aria-label={`${ariaLabel}: ${value} out of ${maxStars} stars`}
      className="flex items-center gap-1"
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            role={readonly ? 'presentation' : 'radio'}
            aria-checked={readonly ? undefined : starValue === value}
            aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
            className={`transition-all duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'} ${readonly ? '' : 'rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'} `}
            style={{ width: size, height: size }}
          >
            <Star
              className={`h-full w-full transition-colors duration-150 ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'} `}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
