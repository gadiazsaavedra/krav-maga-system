import { useSwipeable } from 'react-swipeable';

interface UseSwipeGesturesProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export const useSwipeGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50
}: UseSwipeGesturesProps) => {
  return useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
    onSwipedUp: onSwipeUp,
    onSwipedDown: onSwipeDown,
    delta: threshold,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false
  });
};