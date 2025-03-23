require('dotenv').config({ path: '.env.local' });
const cookieParser = require('cookie-parser');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { getSignedCookies } = require('./util');

const app = express();

const PORT = 3001;
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;
const COOKIE_TTL = 60 * 60 * 1000;

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

    return res.redirect(req.originalUrl);
  }
  next();
});

app.use(
  '/',
  createProxyMiddleware({
    target: `https://${CLOUDFRONT_DOMAIN}`,
    changeOrigin: true,
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
