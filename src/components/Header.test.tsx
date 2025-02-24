import Header from './Header';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('next/link', () => {
  const MockLink = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
  MockLink.displayName = 'Link';
  return MockLink;
});

describe('Header Component', () => {
  it('Renders header.', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('Renders project name.', () => {
    render(<Header />);
    expect(screen.getByText('100 Letters Project')).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
