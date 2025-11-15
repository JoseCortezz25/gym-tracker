/**
 * YouTube Player Component
 *
 * Embeds YouTube videos using iframe.
 * Atom component for video display.
 */

'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  className?: string;
}

export function YouTubePlayer({
  videoId,
  title = 'Exercise video',
  className
}: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  if (!videoId) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative aspect-video overflow-hidden rounded-lg bg-black',
        className
      )}
    >
      {!isPlaying ? (
        // Thumbnail with play button
        <div
          className="group relative h-full w-full cursor-pointer"
          onClick={handlePlay}
        >
          {/* YouTube thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={e => {
              // Fallback to medium quality if maxres not available
              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 transition-transform group-hover:scale-110">
              <Play className="ml-1 h-8 w-8 fill-white text-white" />
            </div>
          </div>
        </div>
      ) : (
        // YouTube iframe
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      )}
    </div>
  );
}
