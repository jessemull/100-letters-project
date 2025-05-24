import { Letter } from '@ts-types/letter';
import { LetterText } from '@components/Correspondence';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

describe('LetterText Component', () => {
  const letter = {
    letterId: 'letter-001',
    title: 'A Letter to Maya Angelou',
    text: 'Your words gave me courage in the face of adversity.',
    description: 'A tribute to Maya Angelou’s influence.',
    imageURLs: [],
  } as unknown as Letter;

  it('Renders the letter title and text.', () => {
    render(<LetterText letter={letter} />);
    expect(
      screen.getByRole('heading', { name: /a letter to maya angelou/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/your words gave me courage/i)).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<LetterText letter={letter} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
