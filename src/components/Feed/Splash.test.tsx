import Image from 'next/image';
import Splash from '@components/Feed/Splash';
import { axe } from 'jest-axe';
import { calculateCountdown } from '@util/feed';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';

jest.mock('@contexts/CorrespondenceProvider', () => ({
  useCorrespondence: jest.fn(),
}));

jest.mock('@components/Feed', () => {
  return {
    Card: ({ correspondence }: any) => (
      <div data-testid="card">{correspondence.title}</div>
    ),
    Categories: () => <div data-testid="categories">Categories</div>,
    Completion: () => <div data-testid="completion">Completion</div>,
    ResponseChart: () => <div data-testid="response-chart">Chart</div>,
    Clock: () => <div data-testid="count-down-clock">Clock</div>,
    ClockSkeleton: () => (
      <div data-testid="count-down-clock-skeleton">Clock Skeleton</div>
    ),
    Digit: () => <div data-testid="count-down-clock-digit">Clock</div>,
  };
});

jest.mock('@components/Admin/Letters', () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <Image
      src={src}
      alt={alt}
      width={100}
      height={100}
      data-testid="card-image"
    />
  ),
}));

jest.mock('@util/feed', () => ({
  calculateCountdown: jest.fn(),
}));

describe('Splash Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockData = {
    correspondences: [
      { correspondenceId: '1', title: 'Letter 1' },
      { correspondenceId: '2', title: 'Letter 2' },
      { correspondenceId: '3', title: 'Letter 3' },
      { correspondenceId: '4', title: 'Letter 4' },
    ],
    earliestSentAtDate: new Date().toISOString(),
    responseCompletion: 0.825,
  };

  it('Renders header and correct stats.', async () => {
    (useCorrespondence as jest.Mock).mockReturnValue(mockData);
    (calculateCountdown as jest.Mock).mockReturnValue({
      days: 10,
      hours: 5,
      minutes: 30,
      seconds: 15,
    });

    await act(async () => {
      render(<Splash />);
    });

    expect(screen.getByText('The 100 Letters Project')).toBeInTheDocument();
    expect(screen.getByText('Completion')).toBeInTheDocument();
  });

  it('Renders only first 3 letters and loads more on click.', async () => {
    (useCorrespondence as jest.Mock).mockReturnValue(mockData);

    await act(async () => {
      render(<Splash />);
    });

    expect(screen.getAllByTestId('card')).toHaveLength(3);

    fireEvent.click(screen.getByTestId('show-more-letters'));
    expect(screen.getAllByTestId('card')).toHaveLength(4);
  });

  it('Shows coming soon when no correspondences.', async () => {
    (useCorrespondence as jest.Mock).mockReturnValue({
      ...mockData,
      correspondences: [],
    });

    await act(async () => {
      render(<Splash />);
    });

    expect(screen.getByText(/Recent Letters Coming Soon!/)).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    jest.useRealTimers();

    (useCorrespondence as jest.Mock).mockReturnValue(mockData);

    const { container } = (await act(async () => {
      return render(<Splash />);
    })) as ReturnType<typeof render>;

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
