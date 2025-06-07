import React from 'react';
import { render } from '@testing-library/react';
import { Skeleton } from '@components/Skeleton';

describe('Skeleton Component', () => {
  it('Renders without crashing.', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('Renders with default classes.', () => {
    const { container } = render(<Skeleton />);
    const div = container.firstChild;
    expect(div).toHaveClass('bg-white/20');
    expect(div).toHaveClass('rounded');
    expect(div).toHaveClass('animate-pulse');
    expect(div).toHaveClass('backdrop-blur-md');
  });

  it('Appends additional className prop.', () => {
    const { container } = render(
      <Skeleton className="extra-class another-class" />,
    );
    const div = container.firstChild;
    expect(div).toHaveClass('extra-class');
    expect(div).toHaveClass('another-class');
  });

  it('Renders empty div with no children.', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild?.childNodes.length).toBe(0);
  });
});
