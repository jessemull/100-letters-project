import { render, screen } from '@testing-library/react';
import { LetterDetails } from '@components/Correspondence';
import { Letter } from '@ts-types/letter';
import { Status } from '@ts-types/correspondence';

describe('LetterDetails', () => {
  const baseLetter = {
    letterId: 'letter-001',
    title: 'Thank You, Mr. Rogers',
    description: 'A letter expressing appreciation for kindness and empathy.',
    imageURLs: [],
  } as unknown as Letter;

  it('renders required fields: title and description', () => {
    render(<LetterDetails letter={baseLetter} />);

    expect(
      screen.getByRole('heading', { name: /letter details/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(baseLetter.title)).toBeInTheDocument();
    expect(
      screen.getByText(baseLetter.description as string),
    ).toBeInTheDocument();
  });

  it('renders sentAt, receivedAt, and status when provided', () => {
    const letterWithExtras: Letter = {
      ...baseLetter,
      sentAt: '2024-04-01T00:00:00Z',
      receivedAt: '2024-04-05T00:00:00Z',
      status: Status.RESPONDED,
    };

    render(<LetterDetails letter={letterWithExtras} />);

    expect(screen.getByText(/status: responded/i)).toBeInTheDocument();
  });

  it('omits sentAt, receivedAt, and status if not provided', () => {
    render(<LetterDetails letter={baseLetter} />);

    expect(screen.queryByText(/sent:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/received:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/status:/i)).not.toBeInTheDocument();
  });
});
