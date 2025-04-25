import LetterPage from './page';
import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@components/Admin/Letters/LetterForm', () => {
  const MockForm = () => <div data-testid="letter-form" />;
  MockForm.displayName = 'MockForm';
  return MockForm;
});

jest.mock('../../page.layout', () => {
  const MockLayout = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-layout">{children}</div>
  );
  MockLayout.displayName = 'MockLayout';
  return MockLayout;
});

jest.mock('@components/Form', () => {
  const Progress = ({ size, color }: { size: number; color: string }) => (
    <div data-testid="progress" data-size={size} data-color={color}>
      Loading...
    </div>
  );
  Progress.displayName = 'MockProgress';
  return { Progress };
});

describe('LetterPage', () => {
  it('renders the page layout', () => {
    render(<LetterPage />);
    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
  });

  it('renders the letter form', async () => {
    render(<LetterPage />);
    expect(screen.getByTestId('letter-form')).toBeInTheDocument();
  });
});
