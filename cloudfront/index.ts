import jwksClient from 'jwks-rsa';
import { CloudFrontRequestEvent, CloudFrontRequestResult } from 'aws-lambda';
import { decode, Jwt, JwtPayload, verify, VerifyErrors } from 'jsonwebtoken';

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_USER_POOL_CLIENT_ID = process.env.COGNITO_USER_POOL_CLIENT_ID;
const ADMIN_PATH_REGEX = /^\/admin(\/.*)?$/;
const JWKS_URI = `https://cognito-idp.us-west-2.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

console.log('JWKS_URI:', JWKS_URI);

const client = jwksClient({ jwksUri: JWKS_URI });

async function getSigningKey(kid: string): Promise<string> {
  console.log('BEFORE SIGN KEY...', JWKS_URI, kid);
  try {
    const key = await client.getSigningKey(kid);
    if (!key) {
      throw new Error('No signing key found');
    }
    console.log('SIGN KEY: ', key);
    return key.getPublicKey();
  } catch (error) {
    console.error('Error fetching signing key:', error);
    throw error;
  }
}

async function verifyToken(token: string): Promise<JwtPayload | null> {
  const decoded = decode(token, { complete: true });

  console.log('DECODED...', decoded);

  if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
    throw new Error('Invalid JWT');
  }

  console.log('BEFORE SIGNING KEY...');

  const signingKey = await getSigningKey(decoded.header.kid);

  console.log('SIGNING KEY...');

  return new Promise((resolve, reject) => {
    verify(
      token,
      signingKey,
      { algorithms: ['RS256'], complete: true },
      (err: VerifyErrors | null, jwt: Jwt | undefined) => {
        if (err) {
          return reject(err);
        }

        if (!jwt || !jwt.payload || typeof jwt.payload === 'string') {
          return reject(new Error('Invalid payload'));
        }

        if (jwt.payload.aud !== COGNITO_USER_POOL_CLIENT_ID) {
          return reject(new Error('Invalid audience'));
        }

        resolve(jwt);
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
    console.error('JWT Verification Failed: ', error);
    return {
      status: '403',
      statusDescription: 'Forbidden',
      body: 'Access denied!',
    };
  }
};
