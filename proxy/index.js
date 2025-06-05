require('dotenv').config({ path: '.env.local' });
const cookieParser = require('cookie-parser');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { getSignedCookies } = require('./util');

const app = express();

const PORT = 8080;
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;
const COOKIE_TTL = 60 * 60 * 1000;

app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK');
});

app.use(cookieParser());

app.use((req, res, next) => {
  if (!req.cookies['CloudFront-Policy']) {
    const signedCookies = getSignedCookies();

    Object.entries(signedCookies).forEach(([name, value]) => {
      res.cookie(name, value, {
        httpOnly: false,
        secure: true,
        domain: 'localhost',
        maxAge: COOKIE_TTL,
      });
    });

    return res.redirect(307, req.originalUrl);
  }
  next();
});

app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2|webp|ico?)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  next();
});

app.use((req, res, next) => {
  const baseUrl = req.originalUrl.split('?')[0];
  if (baseUrl === '/') {
    req.url = '/index.html';
  } else if (!baseUrl.match(/\.[a-zA-Z0-9]+$/)) {
    req.url += '.html';
  }
  next();
});

app.use(
  '/',
  createProxyMiddleware({
    changeOrigin: true,
    http2: true,
    target: `https://${CLOUDFRONT_DOMAIN}`,
    onProxyReq: (proxyReq, req, res) => {
      if (req.headers.cookie) {
        proxyReq.setHeader('Cookie', req.headers.cookie);
      }
    },
  }),
);

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
