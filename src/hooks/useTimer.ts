import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  initialTime?: number;
  countDown?: boolean;
  autoStart?: boolean;
  onComplete?: () => void;
}

interface UseTimerReturn {
  time: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newTime?: number) => void;
  setTime: (time: number) => void;
  formattedTime: string;
}

export function useTimer({
  initialTime = 0,
  countDown = false,
  autoStart = false,
  onComplete
}: UseTimerOptions = {}): UseTimerReturn {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime(prev => {
          if (countDown) {
            if (prev <= 1) {
              setIsRunning(false);
              if (onCompleteRef.current) {
                onCompleteRef.current();
              }
              return 0;
            }
            return prev - 1;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, countDown]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTime?: number) => {
    setIsRunning(false);
    setTime(newTime ?? initialTime);
  }, [initialTime]);

  const setNewTime = useCallback((newTime: number) => {
    setTime(newTime);
  }, []);

  // Format time as MM:SS
  const formattedTime = formatTime(time);

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    setTime: setNewTime,
    formattedTime
  };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeWithHours(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Rest timer hook with vibration and sound
export function useRestTimer(defaultTime: number = 60) {
  const [isResting, setIsResting] = useState(false);

  const onComplete = useCallback(() => {
    setIsResting(false);

    // Vibration
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }, []);

  const timer = useTimer({
    initialTime: defaultTime,
    countDown: true,
    onComplete
  });

  const startRest = useCallback((customTime?: number) => {
    timer.reset(customTime ?? defaultTime);
    setIsResting(true);
    timer.start();
  }, [timer, defaultTime]);

  const stopRest = useCallback(() => {
    timer.pause();
    setIsResting(false);
  }, [timer]);

  return {
    ...timer,
    isResting,
    startRest,
    stopRest,
    remainingTime: timer.time
  };
}

// Workout duration timer
export function useWorkoutTimer() {
  const [startTime, setStartTime] = useState<Date | null>(null);

  const timer = useTimer({
    initialTime: 0,
    countDown: false
  });

  const startWorkout = useCallback(() => {
    setStartTime(new Date());
    timer.reset(0);
    timer.start();
  }, [timer]);

  const endWorkout = useCallback((): { startTime: string; endTime: string; duration: number } => {
    timer.pause();
    const endTime = new Date();
    return {
      startTime: startTime?.toISOString() || endTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: timer.time
    };
  }, [timer, startTime]);

  return {
    ...timer,
    startWorkout,
    endWorkout,
    duration: timer.time,
    formattedDuration: formatTimeWithHours(timer.time)
  };
}

export default useTimer;
