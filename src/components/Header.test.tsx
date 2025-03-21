import Header from './Header';
import { axe } from 'jest-axe';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

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

  it('Handles link clicks.', async () => {
    const preventDefault = jest.fn();

    await render(<Header />);

    const home = screen.getByTestId('home-link');
    const about = screen.getByTestId('about-link');
    const contact = screen.getByTestId('contact-link');

    await fireEvent.click(home, { preventDefault });
    await fireEvent.click(about, { preventDefault });
    await fireEvent.click(contact, { preventDefault });

    waitFor(() => expect(preventDefault).toHaveBeenCalledTimes(3));
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
