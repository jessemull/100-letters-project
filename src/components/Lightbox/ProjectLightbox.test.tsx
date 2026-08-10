import React from 'react';
import { axe } from 'jest-axe';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ProjectLightbox from './ProjectLightbox';

jest.mock('yet-another-react-lightbox', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({
      close,
      on,
      open,
      slides,
    }: {
      close: () => void;
      on?: {
        view?: (args: { index: number }) => void;
        zoom?: (args: { zoom: number }) => void;
      };
      open: boolean;
      slides: Array<{ src: string }>;
    }) =>
      open ? (
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
          <button onClick={() => on?.zoom?.({ zoom: 2 })} type="button">
            Trigger Zoom
          </button>
          <button onClick={close} type="button">
            Library Close
          </button>
        </div>
      ) : null,
  };
});

jest.mock('yet-another-react-lightbox/plugins/zoom', () => ({
  __esModule: true,
  default: {},
}));

describe('ProjectLightbox', () => {
  const slides = [{ src: '/one.jpg' }, { src: '/two.jpg' }];

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

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query.includes('1024'),
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
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
