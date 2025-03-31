import HomePage from './page';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/link', () => {
  const MockLink = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
  MockLink.displayName = 'Link';
  return MockLink;
});

describe('HomePage Component', () => {
  it('Renders homepage.', () => {
    render(<HomePage />);
    expect(screen.getAllByText('100 Letters Project').length).toBe(2);
    expect(
      screen.getByText('© 2025 100 Letters Project. All rights reserved.'),
    ).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
