import React from 'react';
import { Categories } from '@components/Feed';
import { axe } from 'jest-axe';
import { fireEvent, render, screen } from '@testing-library/react';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Categories Commponent', () => {
  it('Renders the categories.', () => {
    render(<Categories />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('Calls router.push when a category is clicked.', () => {
    render(<Categories />);
    const button = screen.getByRole('button', {
      name: /view letters in category technology/i,
    });
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/category?category=Technology');
  });

  it('Calls router.push when Enter or Space is pressed.', () => {
    render(<Categories />);
    const button = screen.getByRole('button', {
      name: /view letters in category technology/i,
    });

    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(mockPush).toHaveBeenCalledWith('/category?category=Technology');

    fireEvent.keyDown(button, { key: ' ' });
    expect(mockPush).toHaveBeenCalledWith('/category?category=Technology');
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<Categories />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
