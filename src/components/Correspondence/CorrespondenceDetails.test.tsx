import { CorrespondenceCard } from '@ts-types/correspondence';
import { CorrespondenceDetails } from '@components/Correspondence';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('CorrespondenceDetails Component', () => {
  const mockCorrespondence = {
    correspondenceId: 'abc123',
    title: 'Letter to Ada Lovelace',
    reason: {
      description: 'For pioneering work in computing.',
      category: 'Technology',
    },
    letters: [],
    recipient: {
      name: 'Ada Lovelace',
    },
  } as unknown as CorrespondenceCard;

  it('Renders the correspondence title and reason description.', () => {
    render(<CorrespondenceDetails correspondence={mockCorrespondence} />);

    expect(
      screen.getByRole('heading', { name: /letter to ada lovelace/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/for pioneering work in computing\./i),
    ).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <CorrespondenceDetails correspondence={mockCorrespondence} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
