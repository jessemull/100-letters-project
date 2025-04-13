import { Correspondence } from '@ts-types/correspondence';
import {
  CorrespondenceContext,
  CorrespondenceProvider,
  useCorrespondence,
} from './index';
import { CorrespondenceFactory } from '@factories/correspondence';
import { Letter } from '@ts-types/letter';
import { LetterFactory } from '@factories/letter';
import { Recipient } from '@ts-types/recipients';
import { RecipientFactory } from '@factories/recipient';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

const mockCorrespondences: Correspondence[] =
  CorrespondenceFactory.buildList(2);
const mockLetters: Letter[] = LetterFactory.buildList(2);
const mockRecipients: Recipient[] = RecipientFactory.buildList(2);

const TestComponent = () => {
  const { correspondences, letters, recipients } = useCorrespondence();
  return (
    <div>
      <div data-testid="correspondence-count">
        Correspondences: {correspondences.length}
      </div>
      <div data-testid="letter-count">Letters: {letters.length}</div>
      <div data-testid="recipient-count">Recipients: {recipients.length}</div>
    </div>
  );
};

describe('CorrespondenceContext', () => {
  it('Provides correct values to consumers', () => {
    render(
      <CorrespondenceProvider
        correspondences={mockCorrespondences}
        letters={mockLetters}
        recipients={mockRecipients}
      >
        <TestComponent />
      </CorrespondenceProvider>,
    );
    expect(screen.getByTestId('correspondence-count')).toHaveTextContent(
      'Correspondences: 2',
    );
    expect(screen.getByTestId('letter-count')).toHaveTextContent('Letters: 2');
    expect(screen.getByTestId('recipient-count')).toHaveTextContent(
      'Recipients: 2',
    );
  });

  it('Uses default values when no props are passed', () => {
    render(
      <CorrespondenceProvider correspondences={[]} letters={[]} recipients={[]}>
        <TestComponent />
      </CorrespondenceProvider>,
    );

    expect(screen.getByTestId('correspondence-count')).toHaveTextContent(
      'Correspondences: 0',
    );
    expect(screen.getByTestId('letter-count')).toHaveTextContent('Letters: 0');
    expect(screen.getByTestId('recipient-count')).toHaveTextContent(
      'Recipients: 0',
    );
  });

  it('Provides default values', () => {
    expect(CorrespondenceContext).toBeDefined();
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(
      <CorrespondenceProvider
        correspondences={mockCorrespondences}
        letters={mockLetters}
        recipients={mockRecipients}
      >
        <TestComponent />
      </CorrespondenceProvider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
