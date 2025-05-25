import React, { useRef, useState, useCallback } from 'react';

export const useDrag = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  threshold = 5,
) => {
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const c = containerRef.current;
      if (!c) return;
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      setStartX(e.pageX);
      setScrollLeft(c.scrollLeft);
    },
    [containerRef],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const c = containerRef.current;
      if (!c || !isDraggingRef.current) return;
      const walk = (e.pageX - startX) * 1.5;
      if (Math.abs(walk) > threshold) {
        hasMovedRef.current = true;
      }
      c.scrollLeft = scrollLeft - walk;
    },
    [containerRef, scrollLeft, startX, threshold],
  );

  const onMouseUpOrLeave = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const shouldCancelClick = useCallback(() => hasMovedRef.current, []);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUpOrLeave,
    shouldCancelClick,
  };
};
