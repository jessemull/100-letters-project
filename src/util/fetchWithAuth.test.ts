import { fetchWithAuth } from './fetchWithAuth';

describe('useFetch', () => {
  const mockResponse = { data: 'mock data' };
  const mockUrl = 'https://api.example.com/data';
  const mockToken = 'mock-token';

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should fetch and return data.', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchWithAuth({
      url: mockUrl,
      token: mockToken,
      options: {},
    });
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      headers: {
        Authorization: `Bearer ${mockToken}`,
        'Content-Type': 'application/json',
      },
    });
  });

  it('Should throw an error when response is not ok.', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(
      fetchWithAuth({ url: mockUrl, token: mockToken, options: {} }),
    ).rejects.toThrow('Error 500: Internal Server Error');
  });

  it('Uses default options if not provided.', async () => {
    const mockData = { message: 'default options test' };
    const token = 'test-token';
    const url = 'https://example.com/api/test';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
      status: 200,
      statusText: 'OK',
    });

    const result = await fetchWithAuth<typeof mockData>({
      token,
      url,
    } as any);

    expect(fetch).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });

    expect(result).toEqual(mockData);
  });
});
