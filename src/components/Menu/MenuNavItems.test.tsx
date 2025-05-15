import { render, screen, fireEvent } from '@testing-library/react';
import MenuNavItems from './MenuNavItems';

jest.mock('next/link', () => {
  const Link = ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  );
  Link.displayName = 'MockNextLink';
  return Link;
});

describe('MenuNavItems', () => {
  const handleLogout = jest.fn();

  beforeEach(() => {
    handleLogout.mockClear();
  });

  it('renders and handles navigation safely when onNavigate is not defined', () => {
    render(
      <MenuNavItems
        isLoggedIn={false}
        handleLogout={handleLogout}
        collapsed={false}
      />,
    );

    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);

    expect(homeLink).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders only icons when collapsed is true', () => {
    render(
      <MenuNavItems
        isLoggedIn={true}
        handleLogout={handleLogout}
        collapsed={true}
        onNavigate={jest.fn()}
      />,
    );

    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.queryByText('About')).not.toBeInTheDocument();
    expect(screen.queryByText('Contact')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
});
