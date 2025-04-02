import { CloudFrontRequestEvent, CloudFrontResultResponse } from 'aws-lambda';
import { jwtVerify, importJWK } from 'jose';
import axios from 'axios';
import { handler } from './index';

jest.mock('axios');
jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
  importJWK: jest.fn(),
}));

let mockEvent: CloudFrontRequestEvent;

const getMockEvent = () =>
  ({
    Records: [
      {
        cf: {
          request: {
            uri: '/admin/some/path',
            headers: {
              authorization: [
                {
                  value: `Bearer ${[
                    Buffer.from(
                      JSON.stringify({ alg: 'RS256', kid: 'mocked-kid' }),
                    ).toString('base64'),
                    Buffer.from(
                      JSON.stringify({
                        aud: process.env.COGNITO_USER_POOL_CLIENT_ID,
                      }),
                    ).toString('base64'),
                    'signature',
                  ].join('.')}`,
                },
              ],
            },
          },
        },
      },
    ],
  }) as unknown as CloudFrontRequestEvent;

describe('Lambda handler tests', () => {
  beforeEach(() => {
    console.error = jest.fn();
    mockEvent = getMockEvent();
    jest.resetModules();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should forward the request if the URI is not an admin path', async () => {
    mockEvent.Records[0].cf.request.uri = '/non-admin-path';
    const result = await handler(mockEvent);
    expect(result).toEqual(mockEvent.Records[0].cf.request);
  });

  it('should return 403 if Authorization header is missing', async () => {
    mockEvent.Records[0].cf.request.headers = {};
    const result = (await handler(mockEvent)) as CloudFrontResultResponse;
    expect(result.status).toBe('403');
    expect(result.body).toBe('Access denied!');
  });

  it('should return 403 if Authorization header does not start with "Bearer "', async () => {
    mockEvent.Records[0].cf.request.headers = {
      authorization: [{ value: 'Basic invalid-token' }],
    };
    const result = (await handler(mockEvent)) as CloudFrontResultResponse;
    expect(result.status).toBe('403');
    expect(result.body).toBe('Access denied!');
  });

  it('should return 403 and log an error when JWT verification fails', async () => {
    (importJWK as jest.Mock).mockResolvedValue('mocked-key');
    (jwtVerify as jest.Mock).mockResolvedValue(new Error('Invalid JWT!'));
    (axios.get as jest.Mock).mockResolvedValue({
      data: { keys: [{ kid: 'mocked-kid', alg: 'RS256' }] },
    });
    const result = (await handler(mockEvent)) as CloudFrontResultResponse;
    expect(result.status).toBe('403');
    expect(result.body).toBe('Access denied!');
  });

  it('should forward the request if JWT verification is successful', async () => {
    (importJWK as jest.Mock).mockResolvedValue('mocked-key');
    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: { aud: process.env.COGNITO_USER_POOL_CLIENT_ID },
    });
    (axios.get as jest.Mock).mockResolvedValue({
      data: { keys: [{ kid: 'mocked-kid', alg: 'RS256' }] },
    });
    const result = await handler(mockEvent);
    expect(result).toEqual(mockEvent.Records[0].cf.request);
  });

  it('should return 403 if JWT audience is invalid', async () => {
    (importJWK as jest.Mock).mockResolvedValue('mocked-key');
    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: { aud: 'invalid-audience' },
    });
    (axios.get as jest.Mock).mockResolvedValue({
      data: { keys: [{ kid: 'mocked-kid', alg: 'RS256' }] },
    });
    const result = (await handler(mockEvent)) as CloudFrontResultResponse;
    expect(result.status).toBe('403');
    expect(result.body).toBe('Access denied!');
  });

  it('should return 403 if no signing key is found', async () => {
    (importJWK as jest.Mock).mockResolvedValue('mocked-key');
    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: { aud: process.env.COGNITO_USER_POOL_CLIENT_ID },
    });
    (axios.get as jest.Mock).mockResolvedValue({
      data: { keys: [] },
    });
    const result = (await handler(mockEvent)) as CloudFrontResultResponse;
    expect(result.status).toBe('403');
    expect(result.body).toBe('Access denied!');
  });

  it('should return 403 if token is missing "kid" header', async () => {
    mockEvent.Records[0].cf.request.headers.authorization[0].value = `Bearer ${[
      Buffer.from(JSON.stringify({ alg: 'RS256' })).toString('base64'),
      Buffer.from(
        JSON.stringify({ aud: process.env.COGNITO_USER_POOL_CLIENT_ID }),
      ).toString('base64'),
      'signature',
    ].join('.')}`;
    (jwtVerify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid JWT: Missing kid');
    });
    const result = (await handler(mockEvent)) as CloudFrontResultResponse;
    expect(result.status).toBe('403');
    expect(result.body).toBe('Access denied!');
  });

  it('should return 403 on uncaught errors', async () => {
    (importJWK as jest.Mock).mockResolvedValue('mocked-key');
    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: { aud: process.env.COGNITO_USER_POOL_CLIENT_ID },
    });
    (axios.get as jest.Mock).mockRejectedValue(new Error('Bad call!'));
    const result = (await handler(mockEvent)) as CloudFrontResultResponse;
    expect(result.status).toBe('403');
    expect(result.body).toBe('Access denied!');
  });

  it('should  redirect to homepage', async () => {
    (importJWK as jest.Mock).mockResolvedValue('mocked-key');
    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: { aud: process.env.COGNITO_USER_POOL_CLIENT_ID },
    });
    (axios.get as jest.Mock).mockResolvedValue({
      data: { keys: [{ kid: 'mocked-kid', alg: 'RS256' }] },
    });
    mockEvent.Records[0].cf.request.uri = '/';
    const result = await handler(mockEvent);
    expect(result).toEqual(mockEvent.Records[0].cf.request);
  });
});
