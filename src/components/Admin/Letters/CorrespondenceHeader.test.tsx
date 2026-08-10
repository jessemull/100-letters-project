import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import CorrespondenceHeader from './CorrespondenceHeader';

describe('CorrespondenceHeader', () => {
  it('renders a label when provided', () => {
    render(<CorrespondenceHeader label="Doe, Jane - Hello" />);
    expect(screen.getByText('Doe, Jane - Hello')).toBeInTheDocument();
  });

  it('renders skeletons when label is missing', () => {
    const { container } = render(<CorrespondenceHeader label={null} />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
      0,
    );
  });

  it('has no accessibility violations with a label', async () => {
    const { container } = render(
      <CorrespondenceHeader label="Doe, Jane - Hello" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
