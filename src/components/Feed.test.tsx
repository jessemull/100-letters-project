import Feed from './Feed';
import { Correspondence } from '../types';
import { CorrespondenceFactory } from '@/factories';
import { render, screen } from '@testing-library/react';

const correspondence = CorrespondenceFactory.buildList(3)

jest.mock('./Card', () => ({ correspondence }: { correspondence: Correspondence }) => (
  <div>{correspondence.title}</div>
));

describe('Feed Component', () => {
  test('Renders feed component.', () => {
    render(<Feed correspondence={correspondence} />);
    const title = screen.getByText('Letters');
    expect(title).toBeInTheDocument();
  });
  test('Renders all correspondence.', () => {
    render(<Feed correspondence={correspondence} />);
    correspondence.forEach((item) => {
      const letterTitle = screen.getByText(item.title);
      expect(letterTitle).toBeInTheDocument();
    });
  });
});
