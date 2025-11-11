'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseRestTimerOptions {
  duration: number; // Duration in seconds
  onComplete?: () => void;
  autoStart?: boolean;
}

interface UseRestTimerReturn {
  secondsRemaining: number;
  isRunning: boolean;
  isComplete: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  reset: () => void;
  progress: number; // 0-1 for visual progress
}

export const useRestTimer = ({
  duration,
  onComplete,
  autoStart = false
}: UseRestTimerOptions): UseRestTimerReturn => {
  const [secondsRemaining, setSecondsRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref up to date
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (!isRunning || isComplete) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Call completion callback
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isComplete]);

  const start = useCallback(() => {
    setSecondsRemaining(duration);
    setIsComplete(false);
    setIsRunning(true);
  }, [duration]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (!isComplete) {
      setIsRunning(true);
    }
  }, [isComplete]);

  const skip = useCallback(() => {
    setIsRunning(false);
    setIsComplete(true);
    setSecondsRemaining(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Call completion callback
    if (onCompleteRef.current) {
      onCompleteRef.current();
    }
  }, []);

  const reset = useCallback(() => {
    setSecondsRemaining(duration);
    setIsRunning(false);
    setIsComplete(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [duration]);

  const progress = duration > 0 ? (duration - secondsRemaining) / duration : 1;

  return {
    secondsRemaining,
    isRunning,
    isComplete,
    start,
    pause,
    resume,
    skip,
    reset,
    progress
  };
};
