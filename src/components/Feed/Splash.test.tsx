import Image from 'next/image';
import Splash from '@components/Feed/Splash';
import { calculateCountdown } from '@util/feed';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';

jest.mock('@contexts/CorrespondenceProvider', () => ({
  useCorrespondence: jest.fn(),
}));

jest.mock('@components/Feed', () => ({
  Card: ({ correspondence }: any) => (
    <div data-testid="card">{correspondence.title}</div>
  ),
}));

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

  it('Renders header and correct stats.', () => {
    (useCorrespondence as jest.Mock).mockReturnValue(mockData);
    (calculateCountdown as jest.Mock).mockReturnValue({
      days: 10,
      hours: 5,
      minutes: 30,
      seconds: 15,
    });

    render(<Splash />);
    expect(screen.getByText('The 100 Letters Project')).toBeInTheDocument();
    expect(screen.getByText('4 Letters Written')).toBeInTheDocument();
    expect(screen.getByText('Respond-o-meter: 82.5%')).toBeInTheDocument();
    expect(
      screen.getByText('Countdown clock kicking off soon...'),
    ).toBeInTheDocument();
  });

  it('Shows fallback countdown if no earliestSentAtDate.', () => {
    (useCorrespondence as jest.Mock).mockReturnValue({
      ...mockData,
      earliestSentAtDate: null,
    });
    render(<Splash />);
    expect(
      screen.getByText(/Countdown clock kicking off soon/i),
    ).toBeInTheDocument();
  });

  it('Renders only first 3 letters and loads more on click.', () => {
    (useCorrespondence as jest.Mock).mockReturnValue(mockData);
    render(<Splash />);

    expect(screen.getAllByTestId('card')).toHaveLength(3);

    fireEvent.click(screen.getByTestId('show-more-letters'));
    expect(screen.getAllByTestId('card')).toHaveLength(4);
  });

  it('Shows coming soon when no correspondences.', () => {
    (useCorrespondence as jest.Mock).mockReturnValue({
      ...mockData,
      correspondences: [],
    });
    render(<Splash />);
    expect(screen.getByText(/Recent Letters Coming Soon!/)).toBeInTheDocument();
  });

  it('Starts countdown timer and clears it on unmount.', () => {
    (useCorrespondence as jest.Mock).mockReturnValue(mockData);
    (calculateCountdown as jest.Mock).mockReturnValue({
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
    });

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = render(<Splash />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(calculateCountdown).toHaveBeenCalled();
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });
});
