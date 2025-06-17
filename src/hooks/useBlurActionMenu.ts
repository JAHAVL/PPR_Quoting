import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for managing blur action menu state and interactions.
 * This hook enables any component to use the blur action menu with click-away functionality.
 */
export const useBlurActionMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLongPress = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const startLongPress = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    // Clear any existing timeout
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
    
    // Set a timeout for long press detection (500ms)
    longPressTimeoutRef.current = setTimeout(() => {
      handleLongPress();
    }, 500);
  }, [handleLongPress]);

  const endLongPress = useCallback(() => {
    // Clear the timeout if the user releases before long press is detected
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Props to spread on the container element
  const containerProps = {
    ref: containerRef as any, // Cast to any due to potential ref type issues
    onMouseDown: startLongPress,
    onMouseUp: endLongPress,
    onMouseLeave: endLongPress,
    onTouchStart: startLongPress,
    onTouchEnd: endLongPress,
  };

  return {
    isMenuOpen,
    closeMenu,
    containerRef,
    containerProps,
  };
};

export default useBlurActionMenu;
