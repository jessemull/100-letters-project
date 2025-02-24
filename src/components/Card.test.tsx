import Card from './Card';
import { axe } from 'jest-axe';
import { CorrespondenceFactory } from '../factories';
import { render, screen } from '@testing-library/react';

const correspondence = CorrespondenceFactory.build();

describe('Card Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    const rendered = render(<Card correspondence={correspondence} />);
    container = rendered.container;
  });

  it('Renders the card and correspondence.', () => {
    expect(screen.getByText(correspondence.title)).toBeInTheDocument();
    expect(
      screen.getByText(`Corresponding with: ${correspondence.recipient}`),
    ).toBeInTheDocument();
  });

  it('Renders sent letters.', () => {
    correspondence.letters.sent.forEach((sentLetter) => {
      expect(
        screen.queryAllByText(`Date Received: ${sentLetter.date}`),
      ).not.toBeNull();
      expect(screen.queryAllByText(sentLetter.text)).not.toBeNull();
      expect(
        screen.queryAllByText(`Medium: ${sentLetter.medium}`),
      ).not.toBeNull();
      expect(
        screen.queryAllByText(`Status: ${sentLetter.status}`),
      ).not.toBeNull();
    });
  });

  it('Renders received letters.', () => {
    correspondence.letters.received.forEach((receivedLetter) => {
      expect(
        screen.queryAllByText(`Date Received: ${receivedLetter.date}`),
      ).not.toBeNull();
      expect(screen.queryAllByText(receivedLetter.text)).not.toBeNull();
      expect(
        screen.queryAllByText(`Medium: ${receivedLetter.medium}`),
      ).not.toBeNull();
      expect(
        screen.queryAllByText(`Status: ${receivedLetter.status}`),
      ).not.toBeNull();
    });
  });

  it('Renders message when no sent letters are available.', () => {
    const withoutSent = CorrespondenceFactory.build(
      {},
      {
        transient: {
          sent: [],
        },
      },
    );
    render(<Card correspondence={withoutSent} />);
    expect(screen.getByText('No sent letters available.')).toBeInTheDocument();
  });

  it('Renders message when no received letters are available.', () => {
    const withoutReceived = CorrespondenceFactory.build(
      {},
      {
        transient: {
          received: [],
        },
      },
    );
    render(<Card correspondence={withoutReceived} />);
    expect(
      screen.getByText('No received letters available.'),
    ).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
