import Feed from './Feed';
import { Correspondence } from '../types';
import { CorrespondenceContext } from '../contexts';
import { CorrespondenceFactory } from '../factories';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

const correspondence = CorrespondenceFactory.buildList(3);

jest.mock('./Card', () => {
  const MockCard = ({ correspondence }: { correspondence: Correspondence }) => (
    <div>{correspondence.title}</div>
  );
  MockCard.displayName = 'Card';
  return MockCard;
});

describe('Feed Component', () => {
  it('Renders all correspondence.', () => {
    render(
      <CorrespondenceContext.Provider
        value={{ correspondences: correspondence, letters: [], recipients: [] }}
      >
        <Feed />
      </CorrespondenceContext.Provider>,
    );

    correspondence.forEach((item) => {
      const letterTitle = screen.getByText(item.title);
      expect(letterTitle).toBeInTheDocument();
    });
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(
      <CorrespondenceContext.Provider
        value={{ correspondences: correspondence, letters: [], recipients: [] }}
      >
        <Feed />
      </CorrespondenceContext.Provider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
