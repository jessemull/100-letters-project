import Digit from './Digit';
import React from 'react';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('Digit Component', () => {
  it('Renders correctly with a valid digit.', () => {
    render(<Digit digit="3" />);
    const span = screen.getByText('3');
    expect(span).toBeInTheDocument();
  });

  it('Renders all digits from 0 to 9.', () => {
    render(<Digit digit="0" />);
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it('Applies correct transform style based on digit.', () => {
    render(<Digit digit="5" />);
    const innerSpan = screen.getByText('0').parentElement as HTMLSpanElement;

    expect(innerSpan).toHaveStyle({
      transform: 'translateY(calc(-5 * 3rem))',
    });
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<Digit digit="2" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Handles invalid digits gracefully (non-numeric).', () => {
    render(<Digit digit="x" />);
    const innerSpan = screen.getByText('0').parentElement as HTMLSpanElement;
    expect(innerSpan).toHaveStyle({
      transform: 'translateY(calc(-x * 3rem))',
    });
  });

  it('Handles edge digits like 0 and 9.', () => {
    const { container, rerender } = render(<Digit digit="0" />);
    const span0 = container.querySelector('span span') as HTMLSpanElement;
    expect(span0).toHaveStyle({
      transform: 'translateY(calc(-0 * 3rem))',
    });

    rerender(<Digit digit="9" />);
    const span9 = container.querySelector('span span') as HTMLSpanElement;
    expect(span9).toHaveStyle({
      transform: 'translateY(calc(-9 * 3rem))',
    });
  });
});
