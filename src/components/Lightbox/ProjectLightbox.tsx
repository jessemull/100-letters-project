'use client';

import Lightbox, {
  type ControllerRef,
  type SlideImage,
} from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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
const ARROW_GAP_PX = 10;
const TOOLBAR_INSET_PX = 12;
const VIEWPORT_PAD_PX = 8;
/** Keep in sync with Lightbox `animation.swipe`. */
const SWIPE_MS = 400;
const SETTLE_BUFFER_MS = 80;

const findActiveSlideImage = (): HTMLImageElement | null => {
  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>(
      '.yarl__portal_open .yarl__slide_image',
    ),
  );

  const viewportCenterX = window.innerWidth / 2;
  const viewportCenterY = window.innerHeight / 2;

  let best: HTMLImageElement | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const image of images) {
    const rect = image.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) continue;

    const visibleWidth =
      Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
    const visibleHeight =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    if (visibleWidth < 32 || visibleHeight < 32) continue;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const score =
      Math.abs(centerX - viewportCenterX) + Math.abs(centerY - viewportCenterY);

    if (score < bestScore) {
      bestScore = score;
      best = image;
    }
  }

  return best;
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
  const [layout, setLayout] = useState<ImageLayout | null>(null);
  const [chromeVisible, setChromeVisible] = useState(false);
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

  const measureLayout = useCallback((): ImageLayout | null => {
    if (!open) return null;

    const portal = document.querySelector('.yarl__portal_open');
    if (portal) setPortalEl(portal);

    const image = findActiveSlideImage();
    if (!image) return null;

    const rect = image.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) return null;

    return {
      height: rect.height,
      left: rect.left,
      top: rect.top,
      width: rect.width,
    };
  }, [open]);

  const revealChrome = useCallback(() => {
    if (transitioningRef.current) return;
    const nextLayout = measureLayout();
    if (!nextLayout) return;
    setLayout(nextLayout);
    setChromeVisible(true);
  }, [measureLayout]);

  const beginTransition = useCallback(() => {
    transitioningRef.current = true;
    setChromeVisible(false);
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
        setLayout(null);
        setPortalEl(null);
        setZoomLevel(1);
        setChromeVisible(false);
      }, 0);
      return () => window.clearTimeout(clearId);
    }

    // Initial open: wait a beat for the portal/image to mount, then show chrome.
    transitioningRef.current = true;
    const openTimer = window.setTimeout(() => {
      transitioningRef.current = false;
      revealChrome();
    }, 120);

    const onResize = () => {
      if (transitioningRef.current) return;
      const nextLayout = measureLayout();
      if (nextLayout) setLayout(nextLayout);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(openTimer);
      window.removeEventListener('resize', onResize);
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };
  }, [open, measureLayout, revealChrome]);

  const goPrev = () => {
    if (!canGoPrev || transitioningRef.current) return;
    beginTransition();
    controllerRef.current?.prev();
  };

  const goNext = () => {
    if (!canGoNext || transitioningRef.current) return;
    beginTransition();
    controllerRef.current?.next();
  };

  const showDesktopArrows = isDesktop && navigationEnabled;
  // Chrome unmounts while transitioning, so zoom alone gates arrow clicks.
  const arrowsInteractive = zoomLevel <= 1.01;

  const toolbarLeft = layout
    ? Math.min(
        window.innerWidth - VIEWPORT_PAD_PX,
        Math.max(
          VIEWPORT_PAD_PX + 120,
          layout.left + layout.width - TOOLBAR_INSET_PX,
        ),
      )
    : window.innerWidth - VIEWPORT_PAD_PX * 2;
  const toolbarTop = layout
    ? Math.max(VIEWPORT_PAD_PX, layout.top + TOOLBAR_INSET_PX)
    : VIEWPORT_PAD_PX * 2;

  const prevArrowLeft = layout
    ? Math.max(VIEWPORT_PAD_PX, layout.left - ARROW_GAP_PX - ARROW_SIZE_PX)
    : VIEWPORT_PAD_PX;
  const nextArrowLeft = layout
    ? Math.min(
        window.innerWidth - VIEWPORT_PAD_PX - ARROW_SIZE_PX,
        layout.left + layout.width + ARROW_GAP_PX,
      )
    : window.innerWidth - VIEWPORT_PAD_PX - ARROW_SIZE_PX;
  const arrowTop = layout
    ? layout.top + layout.height / 2
    : window.innerHeight / 2;

  const mountNode =
    portalEl ?? (typeof document !== 'undefined' ? document.body : null);

  const chrome =
    open && mountNode
      ? createPortal(
          <AnimatePresence>
            {chromeVisible && layout && (
              <motion.div
                key={`lightbox-chrome-${currentIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="pointer-events-none"
              >
                <div
                  className="pointer-events-auto flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 shadow-lg backdrop-blur-md"
                  data-testid="lightbox-toolbar"
                  style={{
                    left: toolbarLeft,
                    position: 'fixed',
                    top: toolbarTop,
                    transform: 'translateX(-100%)',
                    zIndex: 10000,
                  }}
                >
                  <button
                    aria-label="Zoom in"
                    className="cursor-pointer text-white transition-colors hover:text-gray-300"
                    onClick={() => zoomRef.current?.zoomIn()}
                    type="button"
                  >
                    <ZoomIn className="h-6 w-6" />
                  </button>
                  <button
                    aria-label="Zoom out"
                    className="cursor-pointer text-white transition-colors hover:text-gray-300"
                    onClick={() => zoomRef.current?.zoomOut()}
                    type="button"
                  >
                    <ZoomOut className="h-6 w-6" />
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
                    <X className="h-6 w-6" />
                  </button>
                </div>
                {showDesktopArrows && (
                  <>
                    <button
                      aria-disabled={!canGoPrev || !arrowsInteractive}
                      aria-label="Previous image"
                      className={`pointer-events-auto fixed z-[10000] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-sm transition ${
                        canGoPrev && arrowsInteractive
                          ? 'cursor-pointer hover:bg-white/30'
                          : 'cursor-not-allowed opacity-40'
                      }`}
                      disabled={!canGoPrev || !arrowsInteractive}
                      onClick={goPrev}
                      style={{ left: prevArrowLeft, top: arrowTop }}
                      type="button"
                    >
                      <ChevronLeft className="h-7 w-7 -translate-x-px" />
                    </button>
                    <button
                      aria-disabled={!canGoNext || !arrowsInteractive}
                      aria-label="Next image"
                      className={`pointer-events-auto fixed z-[10000] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-sm transition ${
                        canGoNext && arrowsInteractive
                          ? 'cursor-pointer hover:bg-white/30'
                          : 'cursor-not-allowed opacity-40'
                      }`}
                      disabled={!canGoNext || !arrowsInteractive}
                      onClick={goNext}
                      style={{ left: nextArrowLeft, top: arrowTop }}
                      type="button"
                    >
                      <ChevronRight className="h-7 w-7 translate-x-px" />
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          mountNode,
        )
      : null;

  return (
    <>
      <Lightbox
        animation={{ fade: 250, swipe: SWIPE_MS }}
        carousel={{
          finite: true,
          padding: isDesktop ? 72 : 20,
        }}
        close={close}
        controller={{ ref: controllerRef }}
        index={index}
        on={{
          view: ({ index: nextIndex }) => {
            setCurrentIndex(nextIndex);
            onView?.(nextIndex);

            // Initial open already reveals chrome via the open effect.
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
            if (!transitioningRef.current) {
              const nextLayout = measureLayout();
              if (nextLayout) setLayout(nextLayout);
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
