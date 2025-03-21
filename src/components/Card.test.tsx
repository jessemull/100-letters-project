import Card from './Card';
import { axe } from 'jest-axe';
import { CorrespondenceFactory, LetterFactory } from '../factories';
import { render, screen } from '@testing-library/react';
import { LetterMethod, LetterStatus, LetterType } from '../types';

const correspondence = CorrespondenceFactory.build();

describe('Card Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    const rendered = render(<Card correspondence={correspondence} />);
    container = rendered.container;
  });

  it('Renders the card', () => {
    expect(
      screen.getAllByText(new RegExp(correspondence.title, 'i')).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(new RegExp(correspondence.recipientId, 'i')).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        new RegExp(
          new Date(correspondence.createdAt).toLocaleDateString(),
          'i',
        ),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        new RegExp(
          new Date(correspondence.updatedAt).toLocaleDateString(),
          'i',
        ),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(new RegExp(correspondence.reason.description, 'i'))
        .length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(new RegExp(correspondence.reason.domain, 'i')).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(new RegExp(correspondence.reason.impact, 'i')).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(new RegExp(correspondence.status, 'i')).length,
    ).toBeGreaterThan(0);

    if (correspondence.letters.length > 0) {
      correspondence.letters.forEach((letter) => {
        expect(
          screen.getAllByText(new RegExp(letter.title, 'i')).length,
        ).toBeGreaterThan(0);
        expect(
          screen.getAllByText(new RegExp(letter.method, 'i')).length,
        ).toBeGreaterThan(0);
        expect(
          screen.getAllByText(new RegExp(letter.status, 'i')).length,
        ).toBeGreaterThan(0);
        expect(
          screen.getAllByText(new RegExp(letter.type, 'i')).length,
        ).toBeGreaterThan(0);
      });
    }

    expect(
      screen.getAllByText(
        new RegExp(
          `${correspondence.recipient.firstName} ${correspondence.recipient.lastName}`,
          'i',
        ),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        new RegExp(correspondence.recipient.address.street, 'i'),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        new RegExp(correspondence.recipient.address.city, 'i'),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        new RegExp(correspondence.recipient.address.state, 'i'),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        new RegExp(correspondence.recipient.address.postalCode, 'i'),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(
        new RegExp(correspondence.recipient.address.country, 'i'),
      ).length,
    ).toBeGreaterThan(0);
  });

  it('Displays default text when letter description is missing', () => {
    const letter = LetterFactory.build({
      description: undefined,
      letterId: '1',
      title: 'Test Letter',
      method: LetterMethod.DIGITAL,
      status: LetterStatus.SENT,
      type: LetterType.MAIL,
      sentAt: '2025-01-01',
      text: 'This is a test letter.',
    });
    const correspondenceWithMissingDescription = CorrespondenceFactory.build({
      letters: [letter],
    });
    render(<Card correspondence={correspondenceWithMissingDescription} />);
    expect(
      screen.getAllByText(new RegExp('No description available', 'i')).length,
    ).toBeGreaterThan(0);
  });

  it('Has no accessibility errors.', async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
