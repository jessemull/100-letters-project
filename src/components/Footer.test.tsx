import Footer from './Footer';
import { render, screen } from '@testing-library/react';

test('renders footer with copyright label', () => {
  render(<Footer />);
  const footer = screen.getByText('© 2025 100 Letters Project. All rights reserved.');
  expect(footer).toBeInTheDocument();
});
