import * as Sentry from '@sentry/nextjs';

export async function register() {
  const isDev = process.env.NODE_ENV === 'development';
  const isNode = process.env.NEXT_RUNTIME === 'nodejs';
  const isExport = process.env.NEXT_PHASE === 'phase-export';
  if (isDev && isNode && !isExport) {
    await import('../sentry.server.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
