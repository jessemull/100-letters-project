import { CloudFrontRequestEvent, CloudFrontRequestResult } from 'aws-lambda';
import { jwtVerify, importJWK } from 'jose';
import axios from 'axios';

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_USER_POOL_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID;
const ADMIN_PATH_REGEX = /^\/admin(\/.*)?$/;
const JWKS_URI = `https://cognito-idp.us-west-2.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

async function fetchJWKS() {
  try {
    const response = await axios.get(JWKS_URI);
    return response.data.keys;
  } catch (error) {
    throw new Error('Unable to fetch JWKS');
  }
}

async function getSigningKey(kid: string) {
  const keys = await fetchJWKS();
  const signingKey = keys.find((key: { kid: string }) => key.kid === kid);

  if (!signingKey) {
    throw new Error('No signing key found');
  }

  return await importJWK(signingKey, 'RS256');
}

// Verify JWT
async function verifyToken(token: string) {
  const decodedHeader = JSON.parse(
    Buffer.from(token.split('.')[0], 'base64').toString(),
  );

  if (!decodedHeader.kid) {
    throw new Error('Invalid JWT: Missing kid');
  }

  const key = await getSigningKey(decodedHeader.kid);

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['RS256'] });

    if (payload.aud !== COGNITO_USER_POOL_CLIENT_ID) {
      throw new Error('Invalid audience');
    }

    return payload;
  } catch (error) {
    throw new Error('JWT verification failed: ' + (error as Error).message);
  }
}

// Lambda handler
export const handler = async (
  event: CloudFrontRequestEvent,
): Promise<CloudFrontRequestResult> => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;
  let uri = request.uri;

  // If the uri is '/' (root), rewrite it to '/index.html'
  if (uri === '/') {
    uri = '/index.html';
  }

  // If the uri does not already end with .html, append it
  if (!uri.endsWith('.html')) {
    uri = uri + '.html';
  }

  // Log the modified URI
  console.log('Modified URI: ', uri);

  // Now the URI should be either '/index.html' or another page with '.html' appended
  request.uri = uri;

  // Handle the authentication if necessary
  if (ADMIN_PATH_REGEX.test(uri)) {
    const authHeader = headers['authorization']?.[0]?.value;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: '403',
        statusDescription: 'Forbidden',
        body: 'Access denied!',
      };
    }

    const token = authHeader.split(' ')[1];

    try {
      await verifyToken(token);
      return request;
    } catch (error) {
      console.error('JWT Verification Failed: ', error);
      return {
        status: '403',
        statusDescription: 'Forbidden',
        body: 'Access denied!',
      };
    }
  }

  return request;
};
