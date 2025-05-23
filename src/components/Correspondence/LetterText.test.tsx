import { render, screen } from '@testing-library/react';
import { LetterText } from '@components/Correspondence';
import { Letter } from '@ts-types/letter';

describe('LetterText', () => {
  const letter = {
    letterId: 'letter-001',
    title: 'A Letter to Maya Angelou',
    text: 'Your words gave me courage in the face of adversity.',
    description: 'A tribute to Maya Angelou’s influence.',
    imageURLs: [],
  } as unknown as Letter;

  it('renders the letter title and text', () => {
    render(<LetterText letter={letter} />);

    expect(
      screen.getByRole('heading', { name: /a letter to maya angelou/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/your words gave me courage/i)).toBeInTheDocument();
  });
});
