import { Correspondence } from '@ts-types/correspondence';
import { RecipientDetails } from '@components/Correspondence';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('RecipientDetails Component', () => {
  const correspondence = {
    correspondenceId: 'abc123',
    title: 'Letter to Marie Curie',
    reason: {
      description: 'Her pioneering work in radioactivity inspired me.',
      domain: 'Science',
    },
    recipient: {
      firstName: 'Marie',
      lastName: 'Curie',
      occupation: 'Physicist and Chemist',
      organization: 'Sorbonne University',
      description:
        'First woman to win a Nobel Prize and the only person to win in two scientific fields.',
    },
  } as unknown as Correspondence;

  it('Renders all recipient details.', () => {
    render(<RecipientDetails correspondence={correspondence} />);
    expect(
      screen.getByRole('heading', { name: /recipient/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Marie Curie/)).toBeInTheDocument();
    expect(screen.getByText(/Physicist and Chemist/)).toBeInTheDocument();
    expect(screen.getByText(/Sorbonne University/)).toBeInTheDocument();
    expect(
      screen.getByText(
        /First woman to win a Nobel Prize and the only person to win in two scientific fields/i,
      ),
    ).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <RecipientDetails correspondence={correspondence} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
