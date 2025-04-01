import jwksClient from 'jwks-rsa';
import { COGNITO_USER_POOL_CLIENT_ID, COGNITO_USER_POOL_ID } from './config';
import { CloudFrontRequestEvent, CloudFrontRequestResult } from 'aws-lambda';
import { decode, JwtPayload, verify, VerifyErrors } from 'jsonwebtoken';
import { logger } from './logger';

const ADMIN_PATH_REGEX = /^\/admin(\/.*)?$/;
const JWKS_URI = `https://cognito-idp.us-west-2.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

const client = jwksClient({ jwksUri: JWKS_URI });

async function getSigningKey(kid: string): Promise<string> {
  const key = await client.getSigningKey(kid);
  return key.getPublicKey();
}

async function verifyToken(token: string): Promise<JwtPayload | null> {
  const decoded = decode(token, { complete: true });

  if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
    throw new Error('Invalid JWT');
  }

  const signingKey = await getSigningKey(decoded.header.kid);

  return new Promise((resolve, reject) => {
    verify(
      token,
      signingKey,
      { algorithms: ['RS256'], complete: true },
      (err: VerifyErrors | null, payload: JwtPayload | undefined) => {
        if (err) return reject(err);

        if (!payload || typeof payload === 'string')
          return reject(new Error('Invalid payload'));

        if (payload.aud !== COGNITO_USER_POOL_CLIENT_ID) {
          return reject(new Error('Invalid audience'));
        }

        resolve(payload);
      },
    );
  });
}

export const handler = async (
  event: CloudFrontRequestEvent,
): Promise<CloudFrontRequestResult> => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;
  const uri = request.uri;

  if (!ADMIN_PATH_REGEX.test(uri)) {
    return request;
  }

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
    logger.error('JWT Verification Failed: ', error);
    return {
      status: '403',
      statusDescription: 'Forbidden',
      body: 'Access denied!',
    };
  }
};
