'use client';

import Lightbox, {
  type ControllerRef,
  type SlideImage,
} from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import 'yet-another-react-lightbox/styles.css';

interface LightboxZoomRef {
  changeZoom: (
    targetZoom: number,
    rapid?: boolean,
    dx?: number,
    dy?: number,
  ) => void;
  disabled: boolean;
  maxZoom: number;
  minZoom: number;
  offsetX: number;
  offsetY: number;
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
}

interface Props {
  close: () => void;
  index?: number;
  onView?: (index: number) => void;
  open: boolean;
  showNavigation?: boolean;
  slides: SlideImage[];
}

interface ImageLayout {
  height: number;
  left: number;
  top: number;
  width: number;
}

const DESKTOP_MQ = '(min-width: 1024px)';
const ARROW_SIZE_PX = 40;
const ARROW_GAP_PX = 8;
const VIEWPORT_PAD_PX = 16;
/** Desktop slide padding must leave room for image-adjacent arrows. */
const DESKTOP_SLIDE_PAD_PX = 64;
const SWIPE_MS = 400;
const SETTLE_BUFFER_MS = 80;
const ZOOM_EPS = 1.02;

const findCenteredSlide = (): HTMLElement | null => {
  const slides = Array.from(
    document.querySelectorAll<HTMLElement>('.yarl__portal_open .yarl__slide'),
  );
  if (slides.length === 0) return null;

  const viewportCenterX = window.innerWidth / 2;
  let best: HTMLElement | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const slide of slides) {
    const rect = slide.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) continue;
    const score = Math.abs(rect.left + rect.width / 2 - viewportCenterX);
    if (score < bestScore) {
      bestScore = score;
      best = slide;
    }
  }

  return best;
};

/**
 * Visual bounds of the current slide image at zoom 1.
 * Prefer the rendered img rect — YARL padding/CSS vars make slide-math unreliable.
 */
const measureFitLayout = (): ImageLayout | null => {
  const slide = findCenteredSlide();
  if (!slide) return null;

  const image = slide.querySelector<HTMLImageElement>(
    '.yarl__slide_image:not(.yarl__slide_image_loading)',
  );
  if (!image) return null;

  const rect = image.getBoundingClientRect();
  if (rect.width < 8 || rect.height < 8) return null;

  return {
    width: rect.width,
    height: rect.height,
    left: rect.left,
    top: rect.top,
  };
};

const ProjectLightbox = ({
  close,
  index = 0,
  onView,
  open,
  showNavigation,
  slides,
}: Props) => {
  const controllerRef = useRef<ControllerRef>(null);
  const zoomRef = useRef<LightboxZoomRef | null>(null);
  const transitioningRef = useRef(false);
  const settleTimerRef = useRef<number | null>(null);
  const hasReceivedViewRef = useRef(false);

  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia(DESKTOP_MQ).matches,
  );
  const [fitLayout, setFitLayout] = useState<ImageLayout | null>(null);
  const [chromeReady, setChromeReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [portalEl, setPortalEl] = useState<Element | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [indexSyncedFromProp, setIndexSyncedFromProp] = useState(index);

  if (index !== indexSyncedFromProp) {
    setIndexSyncedFromProp(index);
    setCurrentIndex(index);
  }

  const navigationEnabled = showNavigation ?? slides.length > 1;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < slides.length - 1;
  const isZoomed = zoomLevel > ZOOM_EPS;

  const syncPortal = useCallback(() => {
    const portal = document.querySelector('.yarl__portal_open');
    if (portal) setPortalEl(portal);
  }, []);

  const refreshFitLayout = useCallback((): ImageLayout | null => {
    if (!open) return null;
    syncPortal();
    return measureFitLayout();
  }, [open, syncPortal]);

  const revealChrome = useCallback(() => {
    if (transitioningRef.current) return;
    const nextLayout = refreshFitLayout();
    if (nextLayout) setFitLayout(nextLayout);
    setChromeReady(true);
  }, [refreshFitLayout]);

  const beginTransition = useCallback(() => {
    transitioningRef.current = true;
    setChromeReady(false);
    setZoomLevel(1);
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  const finishTransition = useCallback(() => {
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = window.setTimeout(() => {
      transitioningRef.current = false;
      revealChrome();
      settleTimerRef.current = null;
    }, SWIPE_MS + SETTLE_BUFFER_MS);
  }, [revealChrome]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;

    const media = window.matchMedia(DESKTOP_MQ);
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!open) {
      transitioningRef.current = false;
      hasReceivedViewRef.current = false;
      const clearId = window.setTimeout(() => {
        setFitLayout(null);
        setPortalEl(null);
        setZoomLevel(1);
        setChromeReady(false);
      }, 0);
      return () => window.clearTimeout(clearId);
    }

    transitioningRef.current = true;
    let remeasureTimer: number | null = null;
    const openTimer = window.setTimeout(() => {
      transitioningRef.current = false;
      revealChrome();
      // Image decode can finish after the first paint — remeasure once more.
      remeasureTimer = window.setTimeout(() => {
        if (transitioningRef.current) return;
        const nextLayout = refreshFitLayout();
        if (nextLayout) setFitLayout(nextLayout);
      }, 200);
    }, 120);

    const onResize = () => {
      if (transitioningRef.current) return;
      if ((zoomRef.current?.zoom ?? 1) > ZOOM_EPS) return;
      const nextLayout = refreshFitLayout();
      if (nextLayout) setFitLayout(nextLayout);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(openTimer);
      if (remeasureTimer !== null) window.clearTimeout(remeasureTimer);
      window.removeEventListener('resize', onResize);
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };
  }, [open, refreshFitLayout, revealChrome]);

  const goPrev = () => {
    if (!canGoPrev || transitioningRef.current || isZoomed) return;
    beginTransition();
    controllerRef.current?.prev();
  };

  const goNext = () => {
    if (!canGoNext || transitioningRef.current || isZoomed) return;
    beginTransition();
    controllerRef.current?.next();
  };

  const showDesktopArrows =
    isDesktop && navigationEnabled && !isZoomed && chromeReady && fitLayout;

  const prevArrowLeft = fitLayout
    ? Math.max(VIEWPORT_PAD_PX, fitLayout.left - ARROW_GAP_PX - ARROW_SIZE_PX)
    : VIEWPORT_PAD_PX;
  const nextArrowLeft = fitLayout
    ? Math.min(
        window.innerWidth - VIEWPORT_PAD_PX - ARROW_SIZE_PX,
        fitLayout.left + fitLayout.width + ARROW_GAP_PX,
      )
    : window.innerWidth - VIEWPORT_PAD_PX - ARROW_SIZE_PX;
  const arrowTop = fitLayout
    ? fitLayout.top + fitLayout.height / 2
    : window.innerHeight / 2;

  const mountNode =
    portalEl ?? (typeof document !== 'undefined' ? document.body : null);

  const chrome =
    open && mountNode && chromeReady
      ? createPortal(
          <div className="pointer-events-none">
            {/* Always viewport top-right — never tracks zoom/pan. */}
            <div
              className="pointer-events-auto fixed z-[10000] flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 shadow-lg backdrop-blur-md"
              data-testid="lightbox-toolbar"
              style={{
                top: VIEWPORT_PAD_PX,
                right: VIEWPORT_PAD_PX,
              }}
            >
              <button
                aria-label="Zoom in"
                className="cursor-pointer text-white transition-colors hover:text-gray-300"
                onClick={() => zoomRef.current?.zoomIn()}
                type="button"
              >
                <ZoomIn className="h-5 w-5" strokeWidth={1.75} />
              </button>
              <button
                aria-label="Zoom out"
                className="cursor-pointer text-white transition-colors hover:text-gray-300"
                onClick={() => zoomRef.current?.zoomOut()}
                type="button"
              >
                <ZoomOut className="h-5 w-5" strokeWidth={1.75} />
              </button>
              <button
                aria-label="Close"
                className="cursor-pointer text-white transition-colors hover:text-gray-300"
                onClick={() => {
                  controllerRef.current?.close();
                  close();
                }}
                type="button"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            {showDesktopArrows && (
              <>
                <button
                  aria-disabled={!canGoPrev}
                  aria-label="Previous image"
                  className={`pointer-events-auto fixed z-[10000] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-sm transition ${
                    canGoPrev
                      ? 'cursor-pointer hover:bg-white/30'
                      : 'cursor-not-allowed opacity-40'
                  }`}
                  disabled={!canGoPrev}
                  onClick={goPrev}
                  style={{ left: prevArrowLeft, top: arrowTop }}
                  type="button"
                >
                  <ChevronLeft
                    className="h-6 w-6 -translate-x-px"
                    strokeWidth={1.75}
                  />
                </button>
                <button
                  aria-disabled={!canGoNext}
                  aria-label="Next image"
                  className={`pointer-events-auto fixed z-[10000] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-sm transition ${
                    canGoNext
                      ? 'cursor-pointer hover:bg-white/30'
                      : 'cursor-not-allowed opacity-40'
                  }`}
                  disabled={!canGoNext}
                  onClick={goNext}
                  style={{ left: nextArrowLeft, top: arrowTop }}
                  type="button"
                >
                  <ChevronRight
                    className="h-6 w-6 translate-x-px"
                    strokeWidth={1.75}
                  />
                </button>
              </>
            )}
          </div>,
          mountNode,
        )
      : null;

  return (
    <>
      <Lightbox
        animation={{ fade: 250, swipe: SWIPE_MS }}
        carousel={{
          finite: true,
          padding: isDesktop ? DESKTOP_SLIDE_PAD_PX : 20,
        }}
        close={close}
        controller={{ ref: controllerRef }}
        index={index}
        on={{
          view: ({ index: nextIndex }) => {
            setCurrentIndex(nextIndex);
            onView?.(nextIndex);

            if (!hasReceivedViewRef.current) {
              hasReceivedViewRef.current = true;
              return;
            }

            if (!transitioningRef.current) {
              beginTransition();
            }
            finishTransition();
          },
          zoom: ({ zoom }) => {
            setZoomLevel(zoom);
            if (zoom <= ZOOM_EPS && !transitioningRef.current) {
              const nextLayout = refreshFitLayout();
              if (nextLayout) setFitLayout(nextLayout);
            }
          },
        }}
        open={open}
        plugins={[Zoom]}
        render={{
          buttonClose: () => null,
          buttonNext: () => null,
          buttonPrev: () => null,
        }}
        slides={slides}
        toolbar={{ buttons: [] }}
        zoom={{
          doubleClickMaxStops: 3,
          maxZoomPixelRatio: 5,
          pinchZoomV4: true,
          ref: zoomRef,
          scrollToZoom: true,
          zoomInMultiplier: 2,
        }}
      />
      {chrome}
    </>
  );
};

export default ProjectLightbox;
