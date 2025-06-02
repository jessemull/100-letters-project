import React from 'react';
import { Categories } from '@components/Feed';
import { axe } from 'jest-axe';
import { fireEvent, render, screen } from '@testing-library/react';

const mockPush = jest.fn();

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => <div data-testid="image">Image</div>,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Categories Commponent', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete (window as any).location;
    window.location = { href: '', assign: jest.fn() } as any;
  });

  afterEach(() => {
    window.location = originalLocation as string & Location;
  });

  it('Renders the categories.', () => {
    render(<Categories />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('Calls window.location.href when a category is clicked.', () => {
    render(<Categories />);
    const button = screen.getByRole('button', {
      name: /view letters in category technology/i,
    });
    fireEvent.click(button);
    expect(window.location.href).toBe('/category?category=Technology');
  });

  it('Calls window.location.href when Enter or Space is pressed.', () => {
    render(<Categories />);
    const button = screen.getByRole('button', {
      name: /view letters in category technology/i,
    });

    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(window.location.href).toBe('/category?category=Technology');

    fireEvent.keyDown(button, { key: ' ' });
    expect(window.location.href).toBe('/category?category=Technology');
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<Categories />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
