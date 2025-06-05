import React from 'react';
import Completion from '@components/Feed/Completion';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('@public/data/bootstrap.json', () => ({
  totalCorrespondences: 42,
}));

describe('Completion Component', () => {
  it('Renders mocked completion data', () => {
    render(<Completion />);
    expect(screen.getByText('Letters Written')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('Has no accessibility violations', async () => {
    const { container } = render(<Completion />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
