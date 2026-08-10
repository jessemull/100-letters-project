import CorrespondenceNotFound from './CorrespondenceNotFound';
import React from 'react';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('@components/Feed', () => ({
  Categories: () => <div data-testid="mock-categories">Mock Categories</div>,
}));

describe('CorrespondenceNotFound Component', () => {
  it('Renders heading and home link.', () => {
    render(<CorrespondenceNotFound />);
    expect(screen.getByText('Correspondence not found.')).toBeInTheDocument();

    const link = screen.getByTestId('go-home');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Go Home');
    expect(link).toHaveAttribute('href', '/');
  });

  it('Renders a custom title and description when provided.', () => {
    render(
      <CorrespondenceNotFound
        title="Unable to load correspondence."
        description="Please try again later."
      />,
    );
    expect(
      screen.getByText('Unable to load correspondence.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Please try again later.')).toBeInTheDocument();
  });

  it('Renders the Categories component.', () => {
    render(<CorrespondenceNotFound />);
    expect(screen.getByTestId('mock-categories')).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<CorrespondenceNotFound />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
