import { Feed, calculateCountdown } from '@components/Feed';
import { axe } from 'jest-axe';
import {
  fireEvent,
  getByTestId,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';
import { act } from 'react';
import { CorrespondenceFactory } from '@factories/correspondence';
import { categories } from '@pages/page';

jest.mock('@contexts/CorrespondenceProvider');

describe('Feed Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders correspondences.', () => {
    const correspondences = CorrespondenceFactory.buildList(6);
    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondences,
      earliestSentAtDate: '',
      responseCompletion: 0.5,
    });

    render(<Feed categories={categories} />);
    expect(screen.getByText('Browse by Category')).toBeInTheDocument();
    expect(screen.getByText(correspondences[0].title)).toBeInTheDocument();
  });

  it('Renders default image and alt.', () => {
    const correspondences = CorrespondenceFactory.buildList(6);
    correspondences[0].letters = [];
    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondences,
      earliestSentAtDate: '',
      responseCompletion: 0.5,
    });

    render(<Feed categories={categories} />);
    expect(screen.getByText('Browse by Category')).toBeInTheDocument();
    expect(screen.getByAltText('Letter Image')).toBeInTheDocument();
  });

  it('Has no accessibility errors.', async () => {
    jest.useRealTimers();

    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondences: [],
      earliestSentAtDate: '',
      responseCompletion: 0.5,
    });

    const { container } = render(<Feed categories={categories} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Shows countdown when earliestSentAtDate is present.', async () => {
    jest.useFakeTimers();

    const now = new Date();
    const mockDate = new Date(now);
    mockDate.setFullYear(now.getFullYear() - 1);

    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondences: [],
      earliestSentAtDate: mockDate.toISOString(),
      responseCompletion: 0.5,
    });

    render(<Feed categories={categories} />);

    await act(async () => {
      jest.advanceTimersByTime(1100);
    });

    expect(
      screen.getByText(/Countdown to the Letter-o-calypse/),
    ).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('Does not show countdown when earliestSentAtDate is not present.', () => {
    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondences: [],
      earliestSentAtDate: null,
      responseCompletion: 0.5,
    });

    render(<Feed categories={categories} />);
    expect(
      screen.getByText(/Countdown clock kicking off soon/),
    ).toBeInTheDocument();
  });

  it('Helper calculateCountdown returns zeros if date is in the past.', () => {
    const pastDate = new Date(Date.now() - 10000);

    const { days, hours, minutes, seconds } = calculateCountdown(pastDate);

    expect(days).toBe(0);
    expect(hours).toBe(0);
    expect(minutes).toBe(0);
    expect(seconds).toBe(0);
  });

  it('Helper calculateCountdown returns correct values if date is in the future.', () => {
    const futureDate = new Date(Date.now() + 90061000); // 1d 1h 1m 1s

    const { days, hours, minutes, seconds } = calculateCountdown(futureDate);

    expect(days).toBe(1);
    expect(hours).toBe(1);
    expect(minutes).toBe(1);
    expect(seconds).toBe(1);
  });

  it('Shows more correspondences.', async () => {
    const correspondences = CorrespondenceFactory.buildList(6);
    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondences,
      earliestSentAtDate: '',
      responseCompletion: 0.5,
    });

    render(<Feed categories={categories} />);

    fireEvent.click(screen.getByTestId('show-more-letters'));

    expect(screen.getByText('Browse by Category')).toBeInTheDocument();
    expect(screen.getByText(correspondences[4].title)).toBeInTheDocument();
  });

  it('Shows more categories.', async () => {
    const correspondences = CorrespondenceFactory.buildList(6);
    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondences,
      earliestSentAtDate: '',
      responseCompletion: 0.5,
    });

    render(<Feed categories={[...categories, ...categories]} />);

    fireEvent.click(screen.getByTestId('show-more-categories'));

    expect(screen.getByText('Browse by Category')).toBeInTheDocument();
    expect(screen.getAllByText(categories[0].name).length).toEqual(2);
  });
});
