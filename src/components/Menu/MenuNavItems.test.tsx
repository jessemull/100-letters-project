import MenuNavItems from './MenuNavItems';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/link', () => {
  const Link = ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  );
  Link.displayName = 'MockNextLink';
  return Link;
});

describe('MenuNavItems Component', () => {
  const handleLogout = jest.fn();

  beforeEach(() => {
    handleLogout.mockClear();
  });

  it('Renders and handles navigation safely when onNavigate is not defined.', () => {
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

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <MenuNavItems
        isLoggedIn={true}
        handleLogout={handleLogout}
        collapsed={true}
        onNavigate={jest.fn()}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
