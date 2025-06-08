'use client';

import Digit from './Digit';
import React from 'react';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('Digit Component', () => {
  let addListenerMock: jest.Mock;
  let removeListenerMock: jest.Mock;

  beforeEach(() => {
    addListenerMock = jest.fn();
    removeListenerMock = jest.fn();
  });

  const mockMatchMedia = (matches: boolean) => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      addEventListener: addListenerMock,
      dispatchEvent: jest.fn(),
      matches,
      media: query,
      onchange: null,
      removeEventListener: removeListenerMock,
    }));
  };

  it('Renders the correct digit and div stack with height 40 on small screens.', () => {
    mockMatchMedia(false);

    render(<Digit digit="3" />);
    const outer = screen.getByText('3').parentElement?.parentElement;

    expect(screen.getAllByText(/\d/)).toHaveLength(10);

    const inner = outer?.querySelector('span > span') as HTMLSpanElement;
    expect(inner.style.transform).toBe('translateY(-120px)');
  });

  it('Renders the correct digit with height 48 on sm screens.', () => {
    mockMatchMedia(true);

    render(<Digit digit="5" />);
    const outer = screen.getByText('5').parentElement?.parentElement;
    const inner = outer?.querySelector('span > span') as HTMLSpanElement;

    expect(inner.style.transform).toBe('translateY(-240px)');
  });

  it('Adds and removes the event listener.', () => {
    mockMatchMedia(true);
    const { unmount } = render(<Digit digit="2" />);

    expect(addListenerMock).toHaveBeenCalledTimes(1);
    unmount();
    expect(removeListenerMock).toHaveBeenCalledTimes(1);
  });

  it('Has no accessibility violations.', async () => {
    mockMatchMedia(false);
    const { container } = render(<Digit digit="7" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
