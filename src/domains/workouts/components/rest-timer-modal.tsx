'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRestTimer } from '../hooks/use-rest-timer';
import { workoutsTextMap } from '../workouts.text-map';
import { Check } from 'lucide-react';

interface RestTimerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  restSeconds: number;
  onComplete: () => void;
}

export const RestTimerModal = ({
  isOpen,
  onOpenChange,
  restSeconds,
  onComplete
}: RestTimerModalProps) => {
  const { secondsRemaining, isComplete, skip, progress } = useRestTimer({
    duration: restSeconds,
    onComplete: () => {
      // Play audio notification (optional)
      if (typeof window !== 'undefined' && 'Audio' in window) {
        try {
          const audio = new Audio('/sounds/timer-complete.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {
            // Ignore errors (user might not have audio enabled)
          });
        } catch {
          // Ignore audio errors
        }
      }

      // Auto-close after 2 seconds when complete
      setTimeout(() => {
        onOpenChange(false);
        onComplete();
      }, 2000);
    },
    autoStart: isOpen
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSkip = () => {
    skip();
    onOpenChange(false);
    onComplete();
  };

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen && !isComplete) {
      skip();
    }
  }, [isOpen, isComplete, skip]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {workoutsTextMap.workout.active.restTimer.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-8 py-8">
          {/* Circular Progress */}
          <div className="relative flex h-48 w-48 items-center justify-center">
            {/* Background circle */}
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
                opacity="0.2"
              />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-primary transition-all duration-1000"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress)}`}
                strokeLinecap="round"
              />
            </svg>

            {/* Timer Display */}
            <div className="z-10 text-center">
              {isComplete ? (
                <div className="flex flex-col items-center gap-2">
                  <Check className="text-primary" size={48} />
                  <p className="text-primary text-lg font-semibold">
                    {workoutsTextMap.workout.active.restTimer.ready}
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-5xl font-bold tabular-nums">
                    {formatTime(secondsRemaining)}
                  </div>
                  <div className="text-muted-foreground mt-2 text-sm">
                    remaining
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Progress Bar (Linear) */}
          <div className="w-full space-y-2">
            <Progress value={progress * 100} className="h-2" />
            <p className="text-muted-foreground text-center text-xs">
              {Math.round(progress * 100)}% complete
            </p>
          </div>

          {/* Skip Button */}
          {!isComplete && (
            <Button
              onClick={handleSkip}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {workoutsTextMap.workout.active.restTimer.skip}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
