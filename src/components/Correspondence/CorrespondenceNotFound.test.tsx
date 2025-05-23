import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CorrespondenceNotFound from './CorrespondenceNotFound';
import { useRouter } from 'next/navigation';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Categories component
jest.mock('@components/Feed', () => ({
  Categories: () => <div data-testid="mock-categories">Mock Categories</div>,
}));

describe('CorrespondenceNotFound', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders heading and button', () => {
    render(<CorrespondenceNotFound />);

    expect(screen.getByText('Correspondence not found.')).toBeInTheDocument();
    const button = screen.getByTestId('go-home');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Go Home');
  });

  it('calls router.push("/") when the button is clicked', () => {
    render(<CorrespondenceNotFound />);
    fireEvent.click(screen.getByTestId('go-home'));
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('renders the Categories component', () => {
    render(<CorrespondenceNotFound />);
    expect(screen.getByTestId('mock-categories')).toBeInTheDocument();
  });
});
