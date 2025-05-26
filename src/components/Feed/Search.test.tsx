import React from 'react';
import Search from '@components/Feed/Search';
import { SearchAllItem } from '@ts-types/search';
import { axe } from 'jest-axe';
import { render, screen, waitFor } from '@testing-library/react';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';
import { useInView } from 'react-intersection-observer';

jest.mock('@contexts/CorrespondenceProvider', () => ({
  useCorrespondence: jest.fn(),
}));

jest.mock('@components/Feed', () => ({
  CardSkeleton: () => <div data-testid="card-skeleton">Loading...</div>,
  Card: ({ correspondence, loading, priority }: any) => (
    <div data-testid="card" data-priority={priority} data-loading={loading}>
      {correspondence.title}
    </div>
  ),
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

  it('Shows loading fallback and then loads cards when no term.', async () => {
    render(<Search results={[]} term="" />);

    await waitFor(() => {
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBe(correspondenceData.length);
      expect(cards[0]).toHaveAttribute('data-loading', 'eager');
      expect(cards[0]).toHaveAttribute('data-priority', 'true');
    });
  });

  it('Shows loading fallback and then loads cards when term is present.', async () => {
    render(
      <Search
        results={correspondenceData as SearchAllItem[]}
        term="some search"
      />,
    );

    await waitFor(() => {
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBe(correspondenceData.length);
      expect(cards[0]).toHaveAttribute('data-loading', 'eager');
      expect(cards[0]).toHaveAttribute('data-priority', 'true');
    });
  });

  it('Renders cards from correspondences when no term is present.', async () => {
    render(<Search results={[]} term="" />);
    await waitFor(() => {
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBe(correspondenceData.length);
    });
  });

  it('Loads next page when inView is true and more items exist.', async () => {
    (useInView as jest.Mock).mockReturnValue([{ current: null }, true]);
    const longList = Array.from({ length: 30 }, (_, i) => ({
      correspondenceId: `${i + 1}`,
      title: `Letter ${i + 1}`,
    }));

    render(<Search results={longList as SearchAllItem[]} term="search" />);

    await waitFor(() => {
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBeGreaterThan(12);
    });
  });

  it('Does not render Progress when all items are visible.', async () => {
    render(<Search results={correspondenceData as SearchAllItem[]} term="" />);

    await waitFor(() => {
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBe(correspondenceData.length);
    });

    expect(screen.queryByTestId('progress')).not.toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <Search results={correspondenceData as SearchAllItem[]} term="" />,
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('card').length).toBe(
        correspondenceData.length,
      );
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
