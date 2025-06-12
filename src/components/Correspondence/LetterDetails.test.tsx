import { Letter } from '@ts-types/letter';
import { LetterDetails } from '@components/Correspondence';
import { Status } from '@ts-types/correspondence';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('LetterDetails Component', () => {
  const baseLetter = {
    letterId: 'letter-001',
    title: 'Thank You, Mr. Rogers',
    description: 'A letter expressing appreciation for kindness and empathy.',
    imageURLs: [],
  } as unknown as Letter;

  it('Renders description and header.', () => {
    render(<LetterDetails letter={baseLetter} />);

    expect(
      screen.getByRole('heading', { name: /letter details/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(baseLetter.description as string),
    ).toBeInTheDocument();
  });

  it('Renders sentAt, receivedAt, and status when provided.', () => {
    const letterWithExtras: Letter = {
      ...baseLetter,
      sentAt: '2024-04-01T00:00:00Z',
      receivedAt: '2024-04-05T00:00:00Z',
      status: Status.RESPONDED,
    };

    render(<LetterDetails letter={letterWithExtras} />);

    expect(screen.getByText(/responded/i)).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<LetterDetails letter={baseLetter} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
