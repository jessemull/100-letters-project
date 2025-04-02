import { CloudFrontRequestEvent, CloudFrontResultResponse } from 'aws-lambda';
import { decode as mockDecode, verify as mockVerify } from 'jsonwebtoken';
import { handler } from './index';

jest.mock('jwks-rsa', () => {
  return jest.fn().mockImplementation(() => ({
    getSigningKey: () => ({ getPublicKey: () => ({ aud: 'audience' }) }),
  }));
});

jest.mock('jsonwebtoken');

let mockEvent: CloudFrontRequestEvent;

const getMockEvent = () =>
  ({
    Records: [
      {
        cf: {
          request: {
            uri: '/admin/some/path',
            headers: {
              authorization: [{ value: 'Bearer valid-token' }],
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
    jest.resetAllMocks();
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
    const error = new Error('Invalid JWT');
    (mockVerify as jest.Mock).mockImplementationOnce(
      (
        token: string,
        secret: string,
        options: unknown,
        callback: (error: Error | null, decoded: unknown) => void,
      ) => {
        callback(error, null);
      },
    );
    const result = (await handler(mockEvent)) as CloudFrontResultResponse;
    expect(result.status).toBe('403');
    expect(result.body).toBe('Access denied!');
    expect(console.error).toHaveBeenCalledWith(
      'JWT Verification Failed: ',
      new Error('Invalid JWT'),
    );
  });

  it('should forward the request if JWT verification is successful', async () => {
    const mockDecodedToken = { payload: { aud: undefined } };
    (mockDecode as jest.Mock).mockReturnValue({
      header: { kid: 'test-kid' },
    });
    (mockVerify as jest.Mock).mockImplementationOnce(
      (
        token: string,
        secret: string,
        options: unknown,
        callback: (error: Error | null, decoded: unknown) => void,
      ) => {
        callback(null, mockDecodedToken);
      },
    );
    const result = await handler(mockEvent);
    expect(result).toEqual(mockEvent.Records[0].cf.request);
  });

  it('should throw an error if JWT audience is wrong', async () => {
    const mockDecodedToken = { payload: { aud: 'invalid' } };
    (mockDecode as jest.Mock).mockReturnValue({
      header: { kid: 'test-kid' },
    });
    (mockVerify as jest.Mock).mockImplementationOnce(
      (
        token: string,
        secret: string,
        options: unknown,
        callback: (error: Error | null, decoded: unknown) => void,
      ) => {
        callback(null, mockDecodedToken);
      },
    );
    const result = (await handler(mockEvent)) as CloudFrontResultResponse;
    expect(result.status).toBe('403');
    expect(result.body).toBe('Access denied!');
  });

  it('should throw an error if the aud is wrong', async () => {
    const mockDecodedToken = { aud: 'invalid' };
    (mockDecode as jest.Mock).mockReturnValue({
      header: { kid: 'test-kid' },
    });
    (mockVerify as jest.Mock).mockImplementationOnce(
      (
        token: string,
        secret: string,
        options: unknown,
        callback: (error: Error | null, decoded: unknown) => void,
      ) => {
        callback(null, mockDecodedToken);
      },
    );
    const result = (await handler(mockEvent)) as CloudFrontResultResponse;
    expect(result.status).toBe('403');
    expect(result.body).toBe('Access denied!');
  });

  it('should re-throw the error on verify', async () => {
    const mockDecodedToken = { aud: 'invalid' };
    (mockDecode as jest.Mock).mockReturnValue({
      header: { kid: 'test-kid' },
    });
    (mockVerify as jest.Mock).mockImplementationOnce(
      (
        token: string,
        secret: string,
        options: unknown,
        callback: (error: Error | null, decoded: unknown) => void,
      ) => {
        callback(new Error('Throw again!'), mockDecodedToken);
      },
    );
    const result = (await handler(mockEvent)) as CloudFrontResultResponse;
    expect(result.status).toBe('403');
    expect(result.body).toBe('Access denied!');
  });

  it('should throw an error if the payload is a string', async () => {
    (mockDecode as jest.Mock).mockReturnValue({
      header: { kid: 'test-kid' },
    });
    (mockVerify as jest.Mock).mockImplementationOnce(
      (
        token: string,
        secret: string,
        options: unknown,
        callback: (error: Error | null, decoded: unknown) => void,
      ) => {
        callback(null, 'invalid');
      },
    );
    const result = (await handler(mockEvent)) as CloudFrontResultResponse;
    expect(result.status).toBe('403');
    expect(result.body).toBe('Access denied!');
  });
});
