import React from 'react';
import Search from '@components/Feed/Search';
import { CorrespondenceCard } from '@ts-types/correspondence';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';
import { useInView } from 'react-intersection-observer';

jest.mock('@contexts/CorrespondenceProvider', () => ({
  useCorrespondence: jest.fn(),
}));

jest.mock('@components/Feed', () => ({
  Card: ({ correspondence, loading, priority }: any) => (
    <div data-testid="card" data-priority={priority} data-loading={loading}>
      {correspondence.title}
    </div>
  ),
  Categories: () => <div data-testid="categories">Categories</div>,
}));

jest.mock('@components/Form', () => ({
  Progress: ({ color, size }: any) => (
    <div data-testid="progress" data-color={color} data-size={size}></div>
  ),
}));

jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(),
}));

describe('Search Component', () => {
  const correspondenceData = [
    { correspondenceId: '1', title: 'Letter 1' },
    { correspondenceId: '2', title: 'Letter 2' },
    { correspondenceId: '3', title: 'Letter 3' },
    { correspondenceId: '4', title: 'Letter 4' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondences: correspondenceData,
    });
    (useInView as jest.Mock).mockReturnValue([{ current: null }, false]);
  });

  it('Renders fallback text when items is empty.', () => {
    (useCorrespondence as jest.Mock).mockReturnValue({ correspondences: [] });
    render(<Search results={[]} term="" />);
    expect(
      screen.getByText(/No matching letters or people found/i),
    ).toBeInTheDocument();
  });

  it('Renders cards from results when term is present.', () => {
    render(
      <Search
        results={correspondenceData as CorrespondenceCard[]}
        term="some search"
      />,
    );
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBe(correspondenceData.length);
    expect(cards[0]).toHaveAttribute('data-loading', 'eager');
    expect(cards[0]).toHaveAttribute('data-priority', 'true');
  });

  it('Renders cards from correspondences when no term is present.', () => {
    render(<Search results={[]} term="" />);
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBe(correspondenceData.length);
  });

  it('Renders Progress component if more items can be loaded and inView is false.', () => {
    const extraItems = Array.from({ length: 20 }, (_, i) => ({
      correspondenceId: `extra-${i + 1}`,
      title: `Extra ${i + 1}`,
    }));

    render(
      <Search
        results={[...correspondenceData, ...extraItems] as CorrespondenceCard[]}
        term="some"
      />,
    );
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Loads next page when inView is true and more items exist.', () => {
    (useInView as jest.Mock).mockReturnValue([{ current: null }, true]);
    const longList = Array.from({ length: 30 }, (_, i) => ({
      correspondenceId: `${i + 1}`,
      title: `Letter ${i + 1}`,
    }));

    render(<Search results={longList as CorrespondenceCard[]} term="search" />);
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBeGreaterThan(12);
  });

  it('Does not render Progress when all items are visible.', () => {
    render(
      <Search results={correspondenceData as CorrespondenceCard[]} term="" />,
    );
    expect(screen.queryByTestId('progress')).not.toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <Search results={correspondenceData as CorrespondenceCard[]} term="" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
