import Header from './Header';
import { axe } from 'jest-axe';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';

describe('Header Component', () => {
  it('Renders header.', async () => {
    await act(async () => {
      render(<Header />);
    });
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('100 Letters Project')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    await act(async () => {
      const { container } = render(<Header />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it('Opens menu when the button is clicked (on mobile).', async () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Open Menu');
    expect(menuButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(menuButton);
    });
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});
