import * as Sentry from '@sentry/nextjs';

const isProduction =
  process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT === 'production';

Sentry.init({
  debug: false,
  dsn: 'https://85c88c8995c94b0fdb186d9d703c04df@o4509435480702976.ingest.us.sentry.io/4509436735127552',
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  tracesSampleRate: isProduction ? 0.1 : 1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
