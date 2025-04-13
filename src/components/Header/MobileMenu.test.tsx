import { MobileMenu } from '@components/Header';
import { axe } from 'jest-axe';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('next/link', () => {
  const Link = ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  );
  Link.displayName = 'MockNextLink';
  return Link;
});

/* eslint-disable @next/next/no-img-element */

jest.mock('next/image', () => {
  const Image = (props: any) => {
    const { src, alt, width, height } = props;
    return <img src={src} alt={alt} width={width} height={height} />;
  };
  Image.displayName = 'MockNextImage';
  return Image;
});

jest.mock('next/link', () => {
  const mockLink = ({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode;
    href: string;
    onClick: () => void;
  }) => {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        {children}
      </a>
    );
  };
  mockLink.displayName = 'Link';
  return mockLink;
});

describe('MobileMenu', () => {
  const handleLogout = jest.fn(() => Promise.resolve());
  const onClose = jest.fn();

  beforeEach(() => {
    handleLogout.mockClear();
    onClose.mockClear();
  });

  it('Does not render when isOpen is false.', () => {
    const { container } = render(
      <MobileMenu
        isOpen={false}
        onClose={onClose}
        isLoggedIn={false}
        handleLogout={handleLogout}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('Renders with logged-out state and closes on all links.', () => {
    render(
      <MobileMenu
        isOpen={true}
        onClose={onClose}
        isLoggedIn={false}
        handleLogout={handleLogout}
      />,
    );

    expect(screen.getByText('100 Letters Project')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Home'));
    fireEvent.click(screen.getByText('About'));
    fireEvent.click(screen.getByText('Contact'));
    fireEvent.click(screen.getByText('Login'));

    expect(onClose).toHaveBeenCalledTimes(4);
  });

  it('Renders with logged-in state and handles logout + admin link.', async () => {
    render(
      <MobileMenu
        isOpen={true}
        onClose={onClose}
        isLoggedIn={true}
        handleLogout={handleLogout}
      />,
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Admin'));
    expect(onClose).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => {
      expect(handleLogout).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledTimes(2); // Admin + Logout
    });
  });

  it('Closes when X button is clicked.', () => {
    render(
      <MobileMenu
        isOpen={true}
        onClose={onClose}
        isLoggedIn={false}
        handleLogout={handleLogout}
      />,
    );
    const closeButton = screen.getByLabelText('Close Menu');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <MobileMenu
        isOpen={true}
        onClose={onClose}
        isLoggedIn={false}
        handleLogout={handleLogout}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
