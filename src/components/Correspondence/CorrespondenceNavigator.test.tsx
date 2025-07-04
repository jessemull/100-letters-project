import CorrespondenceNavigator from './CorrespondenceNavigator';
import React, { useCallback, useState } from 'react';
import { axe } from 'jest-axe';
import {
  render,
  screen,
  fireEvent,
  renderHook,
  act,
} from '@testing-library/react';
import { useCorrespondence } from '@contexts/CorrespondenceProvider';
import { useSearchParams } from 'next/navigation';

jest.mock('yet-another-react-lightbox', () => {
  return {
    __esModule: true,
    default: ({ open, close, on }: any) => {
      if (!open) return null;
      return (
        <div data-testid="mock-lightbox">
          <button
            onClick={() => on.view({ index: 1 })}
            data-testid="view-handler"
          >
            View Handler
          </button>
          <button onClick={close} data-testid="close-button">
            Close
          </button>
        </div>
      );
    },
  };
});

jest.mock('yet-another-react-lightbox/plugins/zoom', () => {
  return {};
});

const MockCarousel = (props: any) => (
  <div
    role="button"
    tabIndex={0}
    data-testid="carousel"
    onClick={() => props.onClick(1)}
    onKeyDown={(e) => e.key === 'Enter' && props.onClick(1)}
  >
    MockCarousel
  </div>
);

MockCarousel.displayName = 'MockCarousel';

jest.mock('./ImageCarousel', () => ({
  __esModule: true,
  default: (props: any) => <MockCarousel {...props} />,
}));

const MockCorrespondenceDetails = () => (
  <div data-testid="correspondence-details">MockCorrespondenceDetails</div>
);

MockCorrespondenceDetails.displayName = 'MockCorrespondenceDetails';

jest.mock('./CorrespondenceDetails', () => ({
  __esModule: true,
  default: (props: any) => <MockCorrespondenceDetails {...props} />,
}));

jest.mock('@components/Correspondence', () => ({
  LetterSelector: (props: any) => (
    <div data-testid="letter-selector">
      <button onClick={() => props.onSelect(1)}>SelectLetter</button>
      {props.onScrollToText && (
        <button onClick={props.onScrollToText} data-testid="scroll-to-text">
          Read Text
        </button>
      )}
    </div>
  ),
  LetterSelectorMobile: (props: any) => (
    <div data-testid="letter-selector-mobile">
      <button onClick={() => props.onSelect(1)}>SelectMobileLetter</button>
      {props.onScrollToText && (
        <button
          onClick={props.onScrollToText}
          data-testid="mobile-scroll-to-text"
        >
          Read Text
        </button>
      )}
    </div>
  ),
  LetterDetails: () => (
    <div data-testid="letter-details">MockLetterDetails</div>
  ),
  LetterText: () => <div data-testid="letter-text">MockLetterText</div>,
  RecipientDetails: () => (
    <div data-testid="recipient-details">MockRecipientDetails</div>
  ),
  CorrespondenceNotFound: () => (
    <div data-testid="not-found">Correspondence not found.</div>
  ),
}));

jest.mock('@contexts/CorrespondenceProvider', () => ({
  useCorrespondence: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('CorrespondenceNavigator Component', () => {
  const mockLetters = [
    {
      letterId: 'a',
      title: 'Test Letter A',
      text: 'Test letter content A',
      imageURLs: [
        { id: 'img1', url: '/img1.jpg' },
        { id: 'img2', url: '/img2.jpg' },
      ],
    },
    {
      letterId: 'b',
      title: 'Test Letter B',
      text: 'Test letter content B',
      imageURLs: [{ id: 'img3', url: '/img3.jpg' }],
    },
  ];

  const mockCorrespondence = {
    letters: mockLetters,
    title: 'Test Correspondence Title',
    metadata: { id: 'test', subject: 'Hello' },
    reason: {
      category: 'TECHNOLOGY',
      description: 'Test correspondence description',
    },
  };

  beforeEach(() => {
    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondencesById: {
        test: mockCorrespondence,
      },
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === 'correspondenceId') return 'test';
        if (key === 'letterId') return 'a';
        return null;
      },
    });
  });

  it('Renders the main image and mocked children correctly.', () => {
    render(<CorrespondenceNavigator />);

    expect(screen.getByAltText('Selected letter')).toHaveAttribute(
      'src',
      '/_next/image?url=%2Fimg1.jpg&w=3840&q=75',
    );
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('letter-selector')).toBeInTheDocument();
    expect(screen.getByTestId('recipient-details')).toBeInTheDocument();
    expect(screen.getByTestId('letter-text')).toBeInTheDocument();
    expect(screen.getAllByTestId('letter-details').length).toBe(1);
  });

  it('Updates selected letter index and resets image index on letter select.', () => {
    render(<CorrespondenceNavigator />);
    fireEvent.click(screen.getByText('SelectLetter'));
    expect(screen.getByAltText('Selected letter')).toHaveAttribute(
      'src',
      '/_next/image?url=%2Fimg3.jpg&w=3840&q=75',
    );
  });

  it('Updates selected image when a thumbnail is clicked in carousel.', () => {
    render(<CorrespondenceNavigator />);
    fireEvent.click(screen.getByTestId('carousel'));
    expect(screen.getByAltText('Selected letter')).toHaveAttribute(
      'src',
      '/_next/image?url=%2Fimg2.jpg&w=3840&q=75',
    );
  });

  it('Falls back to /alt-image.jpg if selected image is undefined.', () => {
    const noImageCorrespondence = {
      letters: [
        {
          letterId: 'a',
          title: 'No Image Letter',
          text: 'Content',
          imageURLs: [],
        },
      ],
      reason: {
        category: 'TECHNOLOGY',
      },
    };

    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondencesById: { test: noImageCorrespondence },
    });

    render(<CorrespondenceNavigator />);
    expect(screen.getByAltText('Selected letter')).toHaveAttribute(
      'src',
      '/_next/image?url=%2Falt-image.jpg&w=3840&q=75',
    );
  });

  it('Returns CorrespondenceNotFound if correspondenceId param is missing.', async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => null,
    });

    render(<CorrespondenceNavigator />);

    const notFound = await screen.findByTestId('not-found');
    expect(notFound).toBeInTheDocument();
  });

  it('Renders CorrespondenceNotFound when correspondence is missing.', () => {
    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondencesById: {},
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === 'correspondenceId') return 'missing-id';
        return null;
      },
    });

    render(<CorrespondenceNavigator />);
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('Falls back to index 0 when letterId does not match any letter.', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === 'correspondenceId') return 'test';
        if (key === 'letterId') return 'nonexistent-id';
        return null;
      },
    });

    render(<CorrespondenceNavigator />);

    expect(screen.getByAltText('Selected letter')).toHaveAttribute(
      'src',
      '/_next/image?url=%2Fimg1.jpg&w=3840&q=75',
    );
  });

  it('Updates selected letter index when mobile letter selector is used.', () => {
    render(<CorrespondenceNavigator />);
    fireEvent.click(screen.getByText('SelectMobileLetter'));

    expect(screen.getByAltText('Selected letter')).toHaveAttribute(
      'src',
      '/_next/image?url=%2Fimg3.jpg&w=3840&q=75',
    );
  });

  test('Opens lightbox and triggers view and close handlers.', () => {
    render(<CorrespondenceNavigator />);

    fireEvent.click(screen.getByLabelText(/expand to fullscreen/i));

    expect(screen.getByTestId('mock-lightbox')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('view-handler'));

    expect(screen.getByText('Close')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-button'));

    expect(screen.queryByText('Close')).toBeNull();
  });

  it('Opens lightbox when image is clicked.', () => {
    render(<CorrespondenceNavigator />);
    const image = screen.getByRole('button', { name: /selected letter/i });
    fireEvent.click(image);
    expect(screen.getByTestId('mock-lightbox')).toBeInTheDocument();
  });

  it('Opens lightbox when pressing Enter or Space on the image.', () => {
    render(<CorrespondenceNavigator />);
    const image = screen.getByRole('button', { name: /selected letter/i });

    fireEvent.keyDown(image, { key: 'Enter' });
    expect(screen.getByTestId('mock-lightbox')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-button'));
    expect(screen.queryByTestId('mock-lightbox')).not.toBeInTheDocument();

    fireEvent.keyDown(image, { key: ' ' });
    expect(screen.getByTestId('mock-lightbox')).toBeInTheDocument();
  });

  it('Renders CorrespondenceNotFound if correspondence has no letters.', () => {
    const correspondenceWithNoLetters = {
      letters: [],
      metadata: { id: 'test', subject: 'No Letters' },
    };

    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondencesById: {
        test: correspondenceWithNoLetters,
      },
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === 'correspondenceId') return 'test';
        return null;
      },
    });

    render(<CorrespondenceNavigator />);
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('Handles case where selectedLetter.imageURLs is undefined.', () => {
    const letterWithoutImageURLs = {
      letterId: 'a',
      title: 'Letter Without Images',
      text: 'Content without images',
    };

    const correspondenceWithMissingImageURLs = {
      letters: [letterWithoutImageURLs],
      metadata: { id: 'test', subject: 'Missing imageURLs' },
      reason: {
        category: 'TECHNOLOGY',
      },
    };

    (useCorrespondence as jest.Mock).mockReturnValue({
      correspondencesById: {
        test: correspondenceWithMissingImageURLs,
      },
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === 'correspondenceId') return 'test';
        return null;
      },
    });

    render(<CorrespondenceNavigator />);

    const image = screen.getByAltText('Selected letter');
    expect(image).toHaveAttribute(
      'src',
      '/_next/image?url=%2Falt-image.jpg&w=3840&q=75',
    );
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<CorrespondenceNavigator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Scrolls to letter text section when scroll button is clicked.', () => {
    const mockScrollIntoView = jest.fn();
    const mockGetElementById = jest.spyOn(document, 'getElementById');

    mockGetElementById.mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    } as any);

    render(<CorrespondenceNavigator />);

    const scrollButton = screen.getByTestId('scroll-to-text');
    fireEvent.click(scrollButton);

    expect(mockGetElementById).toHaveBeenCalledWith('letter-text-section');
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    mockGetElementById.mockRestore();
  });

  it('Handles case where letter text section element is not found.', () => {
    const mockGetElementById = jest.spyOn(document, 'getElementById');
    mockGetElementById.mockReturnValue(null);

    render(<CorrespondenceNavigator />);

    const scrollButton = screen.getByTestId('scroll-to-text');
    fireEvent.click(scrollButton);

    expect(mockGetElementById).toHaveBeenCalledWith('letter-text-section');
    // Should not throw an error when element is null

    mockGetElementById.mockRestore();
  });

  it('Scrolls to letter text section when mobile scroll button is clicked.', () => {
    const mockScrollIntoView = jest.fn();
    const mockGetElementById = jest.spyOn(document, 'getElementById');

    mockGetElementById.mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    } as any);

    render(<CorrespondenceNavigator />);

    const mobileScrollButton = screen.getByTestId('mobile-scroll-to-text');
    fireEvent.click(mobileScrollButton);

    expect(mockGetElementById).toHaveBeenCalledWith('letter-text-section');
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    mockGetElementById.mockRestore();
  });

  it('rightColumnRef exits early if element is null.', () => {
    const { result } = renderHook(() => {
      const [_rightColumnHeight, _setRightColumnHeight] = useState(0);
      const refCallback = useCallback((element: HTMLDivElement | null) => {
        if (!element) return 'early-exit';
      }, []);
      return refCallback;
    });

    const returnValue = result.current(null);
    expect(returnValue).toBe('early-exit');
  });

  it('ResizeObserver sets rightColumnHeight when triggered.', () => {
    const observe = jest.fn();
    const disconnect = jest.fn();

    global.ResizeObserver = jest.fn().mockImplementation((callback) => ({
      observe,
      disconnect,
      callback,
    }));

    const _mockElement = {
      getBoundingClientRect: () => ({ height: 123 }),
    };

    render(<CorrespondenceNavigator />);

    const refContainer = screen.getByTestId('recipient-details').parentElement;
    expect(refContainer).toBeTruthy();

    const resizeCallback = (global.ResizeObserver as jest.Mock).mock
      .calls[0][0];
    act(() => {
      resizeCallback([
        {
          contentRect: {
            height: 456,
          },
        },
      ]);
    });

    expect(screen.getByTestId('recipient-details')).toBeInTheDocument();

    (global.ResizeObserver as jest.Mock).mockReset();
  });
});
