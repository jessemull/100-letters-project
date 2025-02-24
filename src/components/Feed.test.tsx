import Feed from './Feed';
import { axe } from 'jest-axe';
import { Correspondence } from '../types';
import { CorrespondenceFactory } from '@/factories';
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
  it('Renders feed component.', () => {
    render(<Feed correspondence={correspondence} />);
    const title = screen.getByText('Letters');
    expect(title).toBeInTheDocument();
  });

  it('Renders all correspondence.', () => {
    render(<Feed correspondence={correspondence} />);
    correspondence.forEach((item) => {
      const letterTitle = screen.getByText(item.title);
      expect(letterTitle).toBeInTheDocument();
    });
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(<Feed correspondence={correspondence} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
