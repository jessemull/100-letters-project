import { render, screen } from '@testing-library/react';
import { CorrespondenceDetails } from '@components/Correspondence';
import { Correspondence } from '@ts-types/correspondence';

describe('CorrespondenceDetails', () => {
  const mockCorrespondence = {
    correspondenceId: 'abc123',
    title: 'Letter to Ada Lovelace',
    reason: {
      description: 'For pioneering work in computing.',
      domain: 'Computer Science',
    },
    letters: [],
    recipient: {
      name: 'Ada Lovelace',
    },
  } as unknown as Correspondence;

  it('renders the correspondence title, reason description, and domain', () => {
    render(<CorrespondenceDetails correspondence={mockCorrespondence} />);

    expect(
      screen.getByRole('heading', { name: /letter to ada lovelace/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/for pioneering work in computing\./i),
    ).toBeInTheDocument();

    expect(screen.getByText(/domain: computer science/i)).toBeInTheDocument();
  });
});
