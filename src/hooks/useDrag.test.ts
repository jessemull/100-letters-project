import { renderHook, act } from '@testing-library/react';
import { useDrag } from './useDrag';

describe('useDrag', () => {
  it('Does nothing if containerRef.current is null on mousedown.', () => {
    const ref: any = { current: null };
    const { result } = renderHook(() => useDrag(ref));
    expect(result.current.shouldCancelClick()).toBe(false);
    act(() => {
      result.current.onMouseDown({ pageX: 10 } as any);
    });
    expect(result.current.shouldCancelClick()).toBe(false);
  });

  it('Sets up dragging and start positions on mousedown.', () => {
    const ref: any = { current: { scrollLeft: 100 } };
    const { result } = renderHook(() => useDrag(ref));
    act(() => {
      result.current.onMouseDown({ pageX: 20 } as any);
    });
    act(() => {
      result.current.onMouseMove({ pageX: 22 } as any);
    });
    expect(result.current.shouldCancelClick()).toBe(false);
  });

  it('Marks hasMoved when movement exceeds threshold and updates scrollLeft.', () => {
    const ref: any = { current: { scrollLeft: 50 } };
    const { result } = renderHook(() => useDrag(ref, 5));
    act(() => {
      result.current.onMouseDown({ pageX: 10 } as any);
    });
    act(() => {
      result.current.onMouseMove({ pageX: 30 } as any);
    });
    expect(result.current.shouldCancelClick()).toBe(true);
    expect(ref.current.scrollLeft).not.toBe(50);
  });

  it('Stops dragging on mouseup or mouseleave.', () => {
    const ref: any = { current: { scrollLeft: 0 } };
    const { result } = renderHook(() => useDrag(ref));
    act(() => {
      result.current.onMouseDown({ pageX: 0 } as any);
    });
    act(() => {
      result.current.onMouseUpOrLeave();
    });
    const prev = ref.current.scrollLeft;
    act(() => {
      result.current.onMouseMove({ pageX: 100 } as any);
    });
    expect(ref.current.scrollLeft).toBe(prev);
  });

  it('Allows threshold override.', () => {
    const ref: any = { current: { scrollLeft: 0 } };
    const { result } = renderHook(() => useDrag(ref, 100));
    act(() => {
      result.current.onMouseDown({ pageX: 0 } as any);
    });
    act(() => {
      result.current.onMouseMove({ pageX: 50 } as any);
    });
    expect(result.current.shouldCancelClick()).toBe(false);
    act(() => {
      result.current.onMouseMove({ pageX: 200 } as any);
    });
    expect(result.current.shouldCancelClick()).toBe(true);
  });
});
