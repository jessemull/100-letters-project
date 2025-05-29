import { MobileMenu } from '@components/Menu';
import { axe } from 'jest-axe';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('@hooks/useSearch', () => ({
  useSearch: jest.fn(() => []),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock('@components/Menu/RecipientSearch', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-recipient-search">Recipient Search</div>
  ),
}));

jest.mock('@components/Menu/LetterSearch', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-letter-search">Letter Search</div>,
}));

jest.mock('@components/Menu/CorrespondenceSearch', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-correspondence-search">Correspondence Search</div>
  ),
}));

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

  it('Renders with logged-out state and closes on all links.', async () => {
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

    await waitFor(() => fireEvent.click(screen.getByText('Home')));
    await waitFor(() => fireEvent.click(screen.getByText('About')));
    await waitFor(() => fireEvent.click(screen.getByText('Contact')));
    await waitFor(() => fireEvent.click(screen.getByText('Login')));

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

    await waitFor(() => fireEvent.click(screen.getByText('Admin')));
    expect(onClose).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(handleLogout).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('Closes when X button is clicked.', async () => {
    render(
      <MobileMenu
        isOpen={true}
        onClose={onClose}
        isLoggedIn={false}
        handleLogout={handleLogout}
      />,
    );
    const closeButton = screen.getByLabelText('Close Menu');
    await waitFor(() => fireEvent.click(closeButton));
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
