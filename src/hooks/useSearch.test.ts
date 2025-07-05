import { SearchResult } from '@ts-types/search';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useSearch } from '@hooks/useSearch';

// Mock bootstrap.json with dataVersion
jest.mock('@public/data/bootstrap.json', () => ({
  default: {
    dataVersion: 1234567890,
    totalCorrespondences: 2,
    earliestSentAtDate: '2023-01-01T00:00:00Z',
  },
}));

global.fetch = jest.fn().mockImplementation((url: string) => {
  if (url.includes('data.') && url.endsWith('.json')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          correspondences: [
            {
              id: 'c1',
              title: 'First Correspondence',
              recipient: {
                firstName: 'Alice',
                lastName: 'Smith',
                fullName: 'Alice Smith',
              },
              reason: {
                category: 'TECHNOLOGY',
              },
              letters: [{ title: 'Thank You Note' }],
            },
            {
              id: 'c2',
              title: 'Second Correspondence',
              recipient: {
                firstName: 'Bob',
                lastName: 'Jones',
                fullName: 'Bob Jones',
              },
              reason: {
                category: 'SCIENCE',
              },
              letters: [{ title: 'Welcome Letter' }],
            },
          ],
        }),
    });
  }

  if (url.includes('search.') && url.endsWith('.json')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          correspondences: [
            { id: 'c1', title: 'First Correspondence' },
            { id: 'c2', title: 'Second Correspondence' },
          ],
          recipients: [
            {
              id: 'r1',
              firstName: 'Alice',
              lastName: 'Smith',
              fullName: 'Alice Smith',
            },
            {
              id: 'r2',
              firstName: 'Bob',
              lastName: 'Jones',
              fullName: 'Bob Jones',
            },
          ],
          letters: [
            { id: 'l1', title: 'Thank You Note' },
            { id: 'l2', title: 'Welcome Letter' },
          ],
        }),
    });
  }

  return Promise.reject(new Error('Unknown fetch URL'));
});

describe('useSearch', () => {
  it('Returns empty array if search term is blank.', async () => {
    const { result } = renderHook(() =>
      useSearch({ type: 'correspondences', term: '  ' }),
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it('Returns empty array when fuse is undefined for given type.', async () => {
    let result: { current: SearchResult[] };

    await act(async () => {
      const hook = renderHook(() =>
        useSearch({ type: 'unknown' as any, term: 'anything' }),
      );
      result = hook.result;
    });

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it('Returns correspondence search results.', async () => {
    let result: { current: SearchResult[] };

    await act(async () => {
      const hook = renderHook(() =>
        useSearch({ type: 'correspondences', term: 'First' }),
      );
      result = hook.result;
    });

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.objectContaining({ title: 'First Correspondence' }),
      ]),
    );
  });

  it('Returns recipient search results (matches fullName).', async () => {
    let result: { current: SearchResult[] };

    await act(async () => {
      const hook = renderHook(() =>
        useSearch({ type: 'recipients', term: 'Alice' }),
      );
      result = hook.result;
    });

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.objectContaining({ fullName: 'Alice Smith' }),
      ]),
    );
  });

  it('Returns letter search results.', async () => {
    let result: { current: SearchResult[] };

    await act(async () => {
      const hook = renderHook(() =>
        useSearch({ type: 'letters', term: 'Thank' }),
      );
      result = hook.result;
    });

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.objectContaining({ title: 'Thank You Note' }),
      ]),
    );
  });

  it('Respects the limit parameter.', async () => {
    let result: { current: SearchResult[] };

    await act(async () => {
      const hook = renderHook(() =>
        useSearch({
          type: 'correspondences',
          term: 'Correspondence',
          limit: 1,
        }),
      );
      result = hook.result;
    });

    await waitFor(() => expect(result.current.length).toBe(1));
  });

  it('Logs error when fetch fails.', async () => {
    const error = new Error('Fetch failed');

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(error),
    );

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    renderHook(() => useSearch({ type: 'correspondences', term: 'test' }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load search data:',
        error,
      );
    });

    consoleErrorSpy.mockRestore();

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('data.') && url.endsWith('.json')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              correspondences: [
                {
                  id: 'c1',
                  title: 'First Correspondence',
                  recipient: {
                    firstName: 'Alice',
                    lastName: 'Smith',
                    fullName: 'Alice Smith',
                  },
                  reason: { category: 'TECHNOLOGY' },
                  letters: [{ title: 'Thank You Note' }],
                },
                {
                  id: 'c2',
                  title: 'Second Correspondence',
                  recipient: {
                    firstName: 'Bob',
                    lastName: 'Jones',
                    fullName: 'Bob Jones',
                  },
                  reason: { category: 'SCIENCE' },
                  letters: [{ title: 'Welcome Letter' }],
                },
              ],
            }),
        });
      }
      if (url.includes('search.') && url.endsWith('.json')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              correspondences: [
                { id: 'c1', title: 'First Correspondence' },
                { id: 'c2', title: 'Second Correspondence' },
              ],
              recipients: [
                {
                  id: 'r1',
                  firstName: 'Alice',
                  lastName: 'Smith',
                  fullName: 'Alice Smith',
                },
                {
                  id: 'r2',
                  firstName: 'Bob',
                  lastName: 'Jones',
                  fullName: 'Bob Jones',
                },
              ],
              letters: [
                { id: 'l1', title: 'Thank You Note' },
                { id: 'l2', title: 'Welcome Letter' },
              ],
            }),
        });
      }
      return Promise.reject(new Error('Unknown fetch URL'));
    });
  });
});
