import React from 'react';
import Splash from '@components/Feed/Splash';
import { axe } from 'jest-axe';
import { calculateCountdown } from '@util/feed';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';

jest.mock('@contexts/CorrespondenceProvider', () => ({
  useCorrespondence: jest.fn(),
}));

jest.mock('@components/Feed', () => ({
  CardSkeleton: () => <div data-testid="card-skeleton">Loading...</div>,
  Card: ({ correspondence }: any) => (
    <div data-testid="card">{correspondence.title}</div>
  ),
  Categories: () => <div data-testid="categories">Categories</div>,
}));

jest.mock('@util/feed', () => ({
  calculateCountdown: jest.fn(),
}));

describe('Splash Component', () => {
  const baseDate = new Date('2025-01-01T00:00:00Z');

  const correspondenceData = [
    { correspondenceId: '1', title: 'Letter 1' },
    { correspondenceId: '2', title: 'Letter 2' },
    { correspondenceId: '3', title: 'Letter 3' },
    { correspondenceId: '4', title: 'Letter 4' },
    { correspondenceId: '5', title: 'Letter 5' },
    { correspondenceId: '6', title: 'Letter 6' },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondences: correspondenceData,
      earliestSentAtDate: baseDate.toISOString(),
      responseCompletion: 0.25,
    });
    (calculateCountdown as jest.Mock).mockReturnValue({
      days: 300,
      hours: 5,
      minutes: 30,
      seconds: 10,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Renders header and stats correctly.', async () => {
    await act(async () => {
      render(<Splash />);
    });

    expect(screen.getByText(/The 100 Letters Project/i)).toBeInTheDocument();
    expect(screen.getByText('6 Letters Written')).toBeInTheDocument();
    expect(screen.getByText('Respond-o-meter: 25%')).toBeInTheDocument();
  });

  it('Shows countdown once earliestSentAtDate is provided.', async () => {
    await act(async () => {
      render(<Splash />);
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Countdown to the Letter-o-calypse/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/300d 5h 30m 10s/i)).toBeInTheDocument();
    });
  });

  it('Shows fallback countdown if earliestSentAtDate is missing.', async () => {
    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondences: [],
      earliestSentAtDate: null,
      responseCompletion: 0.5,
    });

    await act(async () => {
      render(<Splash />);
    });

    expect(
      screen.getByText(/Countdown clock kicking off soon/i),
    ).toBeInTheDocument();
  });

  it('Shows "Recent Letters Coming Soon!" if no correspondences exist.', async () => {
    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondences: [],
      earliestSentAtDate: baseDate.toISOString(),
      responseCompletion: 0.25,
    });

    await act(async () => {
      render(<Splash />);
    });

    expect(
      screen.getByText(/Recent Letters Coming Soon!/i),
    ).toBeInTheDocument();
  });

  it('Renders first row of cards (3 items).', async () => {
    await act(async () => {
      render(<Splash />);
    });

    const cards = await screen.findAllByTestId('card');
    expect(cards.length).toBe(3);
    expect(cards[0]).toHaveTextContent('Letter 1');
  });

  it('Does not show "View More Letters +" button when all are visible.', async () => {
    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondences: [
        { correspondenceId: '1', title: 'Only One' },
        { correspondenceId: '2', title: 'Only Two' },
      ],
      earliestSentAtDate: baseDate.toISOString(),
      responseCompletion: 0.25,
    });

    await act(async () => {
      render(<Splash />);
    });

    expect(screen.queryByRole('button', { name: /Show More/i })).toBeNull();
  });

  it('Shows "View More Letters +" button when more items exist.', async () => {
    await act(async () => {
      render(<Splash />);
    });

    expect(
      screen.getByRole('button', { name: /View More Letters +/i }),
    ).toBeInTheDocument();
  });

  it('Loads next row when "View More Letters +" is clicked.', async () => {
    await act(async () => {
      render(<Splash />);
    });

    await act(async () => {
      screen.getByRole('button', { name: /View More Letters +/i }).click();
    });

    await waitFor(() => {
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBe(6);
    });
  });

  it('Cleans up countdown interval on unmount.', async () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    let unmount: () => void;
    await act(async () => {
      ({ unmount } = render(<Splash />));
    });

    await act(async () => {
      unmount();
    });

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('Has no accessibility violations.', async () => {
    jest.useRealTimers();
    const { container } = render(<Splash />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
