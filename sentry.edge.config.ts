// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  debug: false,
  dsn: 'https://85c88c8995c94b0fdb186d9d703c04df@o4509435480702976.ingest.us.sentry.io/4509436735127552',
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1,
});
