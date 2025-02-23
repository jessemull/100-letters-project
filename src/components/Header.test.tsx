import Header from './Header';
import { render, screen } from '@testing-library/react';

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
});
