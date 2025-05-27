import LetterCount from './LetterCount';
import React from 'react';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('LetterCount Component', () => {
  it('Renders the correct text with number count.', () => {
    render(<LetterCount count={42} />);
    expect(screen.getByText('42 Letters Written')).toBeInTheDocument();
  });

  it('Renders the correct text with string count.', () => {
    render(<LetterCount count="99" />);
    expect(screen.getByText('99 Letters Written')).toBeInTheDocument();
  });

  it('Renders default text when no count is provided.', () => {
    render(<LetterCount />);
    expect(screen.getByText('0 Letters Written')).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<LetterCount count={5} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
