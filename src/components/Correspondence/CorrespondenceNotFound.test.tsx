import CorrespondenceNotFound from './CorrespondenceNotFound';
import React from 'react';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@components/Feed', () => ({
  Categories: () => <div data-testid="mock-categories">Mock Categories</div>,
}));

describe('CorrespondenceNotFound Component', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders heading and button.', () => {
    render(<CorrespondenceNotFound />);

    expect(screen.getByText('Correspondence not found.')).toBeInTheDocument();
    const button = screen.getByTestId('go-home');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Go Home');
  });

  it('Calls router.push("/") when the button is clicked.', () => {
    render(<CorrespondenceNotFound />);
    fireEvent.click(screen.getByTestId('go-home'));
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/');
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
