import React from 'react';
import { Heart } from '@components/Animation';
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode;
    }) => (
      <div data-testid="heart-motion" {...props}>
        {children}
      </div>
    ),
  },
}));

describe('Heart', () => {
  it('Renders a heart icon with motion wrapper.', () => {
    const { getByTestId } = render(
      <Heart
        delay={0.2}
        envelopeHeight={100}
        offsetX={10}
        offsetY={20}
        size={16}
      />,
    );

    expect(getByTestId('heart-motion')).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <Heart delay={0} envelopeHeight={80} offsetX={0} offsetY={0} size={12} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
