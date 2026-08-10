import React from 'react';
import { axe } from 'jest-axe';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ProjectLightbox from './ProjectLightbox';

jest.mock('yet-another-react-lightbox', () => {
  const React = require('react');

  const MockYarlLightbox = ({
    close,
    controller,
    on,
    open,
    slides,
  }: {
    close: () => void;
    controller?: {
      ref?: React.MutableRefObject<{
        next: () => void;
        prev: () => void;
        close: () => void;
      } | null>;
    };
    on?: {
      view?: (args: { index: number }) => void;
      zoom?: (args: { zoom: number }) => void;
    };
    open: boolean;
    slides: Array<{ src: string }>;
  }) => {
    if (controller?.ref) {
      controller.ref.current = {
        next: () => on?.view?.({ index: 1 }),
        prev: () => on?.view?.({ index: 0 }),
        close,
      };
    }

    React.useEffect(() => {
      if (open) {
        on?.view?.({ index: 0 });
      }
      // Intentionally omit `on` — seed once on open like YARL's first view event.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return open ? (
      <div data-testid="mock-yarl-lightbox">
        <div className="yarl__portal_open">
          <div className="yarl__slide">
            {/* eslint-disable-next-line @next/next/no-img-element -- YARL mock */}
            <img
              alt=""
              className="yarl__slide_image"
              height={200}
              src={slides[0]?.src}
              width={200}
            />
          </div>
        </div>
        <button onClick={() => on?.view?.({ index: 1 })} type="button">
          Trigger View
        </button>
        <button onClick={() => on?.view?.({ index: 0 })} type="button">
          Trigger View Prev
        </button>
        <button onClick={() => on?.zoom?.({ zoom: 2 })} type="button">
          Trigger Zoom
        </button>
        <button onClick={() => on?.zoom?.({ zoom: 1 })} type="button">
          Trigger Zoom Out
        </button>
        <button onClick={close} type="button">
          Library Close
        </button>
      </div>
    ) : null;
  };

  return {
    __esModule: true,
    default: MockYarlLightbox,
  };
});

jest.mock('yet-another-react-lightbox/plugins/zoom', () => ({
  __esModule: true,
  default: {},
}));

describe('ProjectLightbox', () => {
  const slides = [{ src: '/one.jpg' }, { src: '/two.jpg' }];
  let mediaListeners: Array<() => void> = [];
  let mediaMatches = true;

  const mockDesktopMedia = (matches: boolean) => {
    mediaMatches = matches;
    mediaListeners = [];
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => {
        const media = {
          get matches() {
            return mediaMatches && query.includes('1024');
          },
          media: query,
          onchange: null,
          addEventListener: jest.fn((_event: string, listener: () => void) => {
            mediaListeners.push(listener);
          }),
          removeEventListener: jest.fn(),
          addListener: jest.fn(),
          removeListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
        return media;
      }),
    });
  };

  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      top: 100,
      left: 100,
      right: 300,
      bottom: 300,
      toJSON: () => ({}),
    }));
    mockDesktopMedia(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing interactive when closed', () => {
    render(<ProjectLightbox close={jest.fn()} open={false} slides={slides} />);
    expect(screen.queryByTestId('lightbox-toolbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-yarl-lightbox')).not.toBeInTheDocument();
  });

  it('opens chrome controls and closes from the toolbar', async () => {
    jest.useFakeTimers();
    const close = jest.fn();

    render(<ProjectLightbox close={close} open index={0} slides={slides} />);

    expect(screen.getByTestId('mock-yarl-lightbox')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByTestId('lightbox-toolbar')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(close).toHaveBeenCalled();
  });

  it('exposes zoom controls once chrome is ready', async () => {
    jest.useFakeTimers();

    render(
      <ProjectLightbox close={jest.fn()} open index={0} slides={slides} />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Zoom in'));
    fireEvent.click(screen.getByLabelText('Zoom out'));
  });

  it('shows desktop arrow navigation when unzoomed', async () => {
    jest.useFakeTimers();

    render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous image')).toBeDisabled();
  });

  it('hides desktop arrows while zoomed and restores them after zoom out', async () => {
    jest.useFakeTimers();

    render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Trigger Zoom'));
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Trigger Zoom Out'));
    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
  });

  it('navigates with next arrow and restores chrome after swipe settle', async () => {
    jest.useFakeTimers();
    const onView = jest.fn();

    render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        onView={onView}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    fireEvent.click(screen.getByLabelText('Next image'));

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(onView).toHaveBeenCalledWith(1);
    expect(screen.getByTestId('lightbox-toolbar')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous image')).not.toBeDisabled();
  });

  it('navigates with previous arrow after moving forward', async () => {
    jest.useFakeTimers();
    const onView = jest.fn();

    render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        onView={onView}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    fireEvent.click(screen.getByLabelText('Next image'));
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.click(screen.getByLabelText('Previous image'));
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(onView).toHaveBeenCalledWith(0);
  });

  it('ignores previous clicks when already at the first slide', async () => {
    jest.useFakeTimers();
    const onView = jest.fn();

    render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        onView={onView}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    onView.mockClear();
    fireEvent.click(screen.getByLabelText('Previous image'));
    expect(onView).not.toHaveBeenCalled();
  });

  it('does not show desktop arrows on mobile viewports', async () => {
    mockDesktopMedia(false);
    jest.useFakeTimers();

    render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByTestId('lightbox-toolbar')).toBeInTheDocument();
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
  });

  it('hides navigation when showNavigation is false', async () => {
    jest.useFakeTimers();

    render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        open
        showNavigation={false}
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByTestId('lightbox-toolbar')).toBeInTheDocument();
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
  });

  it('hides navigation for a single slide by default', async () => {
    jest.useFakeTimers();

    render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        open
        slides={[{ src: '/only.jpg' }]}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
  });

  it('syncs when the index prop changes', async () => {
    jest.useFakeTimers();
    const { rerender } = render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByLabelText('Previous image')).toBeDisabled();

    rerender(
      <ProjectLightbox
        close={jest.fn()}
        index={1}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByLabelText('Next image')).toBeDisabled();
  });

  it('clears chrome when closed after opening', async () => {
    jest.useFakeTimers();
    const { rerender } = render(
      <ProjectLightbox close={jest.fn()} open index={0} slides={slides} />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(screen.getByTestId('lightbox-toolbar')).toBeInTheDocument();

    rerender(
      <ProjectLightbox
        close={jest.fn()}
        open={false}
        index={0}
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    expect(screen.queryByTestId('lightbox-toolbar')).not.toBeInTheDocument();
  });

  it('updates fit layout on window resize while open', async () => {
    jest.useFakeTimers();

    render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      x: 50,
      y: 50,
      width: 300,
      height: 240,
      top: 50,
      left: 50,
      right: 350,
      bottom: 290,
      toJSON: () => ({}),
    }));

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
  });

  it('reacts to desktop media query changes', async () => {
    jest.useFakeTimers();

    render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByLabelText('Next image')).toBeInTheDocument();

    mediaMatches = false;
    await act(async () => {
      mediaListeners.forEach((listener) => listener());
    });

    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
  });

  it('handles library-driven view transitions and close', async () => {
    jest.useFakeTimers();
    const close = jest.fn();
    const onView = jest.fn();

    render(
      <ProjectLightbox
        close={close}
        index={0}
        onView={onView}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    fireEvent.click(screen.getByText('Trigger View'));
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(onView).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText('Library Close'));
    expect(close).toHaveBeenCalled();
  });

  it('reschedules settle when view changes mid-transition', async () => {
    jest.useFakeTimers();

    render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    fireEvent.click(screen.getByText('Trigger View'));
    fireEvent.click(screen.getByText('Trigger View Prev'));

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByTestId('lightbox-toolbar')).toBeInTheDocument();
  });

  it('cleans up an in-flight settle timer on unmount', async () => {
    jest.useFakeTimers();

    const { unmount } = render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    fireEvent.click(screen.getByLabelText('Next image'));
    unmount();

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  });

  it('skips resize layout updates while zoomed', async () => {
    jest.useFakeTimers();

    render(
      <ProjectLightbox
        close={jest.fn()}
        index={0}
        open
        showNavigation
        slides={slides}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    fireEvent.click(screen.getByText('Trigger Zoom'));
    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
  });

  it('has no accessibility violations when open with chrome', async () => {
    const { container } = render(
      <ProjectLightbox close={jest.fn()} open slides={slides} />,
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
