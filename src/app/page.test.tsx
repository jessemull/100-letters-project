import HomePage from './page';
import { render, screen } from '@testing-library/react';

describe('HomePage Component', () => {
  it('Renders homepage.', () => {
    render(<HomePage />);
    expect(screen.getByText('100 Letters Project')).toBeInTheDocument();
    expect(screen.getByText('© 2025 100 Letters Project. All rights reserved.')).toBeInTheDocument();
    expect(screen.getByText('Letters')).toBeInTheDocument();
  });
});
