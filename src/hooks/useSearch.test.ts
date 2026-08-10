import { SearchResult } from '@ts-types/search';
import { UseSearchState, useSearch } from '@hooks/useSearch';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';

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
  it('Returns empty results if search term is blank.', async () => {
    const { result } = renderHook(() =>
      useSearch({ type: 'correspondences', term: '  ' }),
    );

    await waitFor(() => {
      expect(result.current.results).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  it('Returns empty results when fuse is undefined for given type.', async () => {
    let result: { current: UseSearchState };

    await act(async () => {
      const hook = renderHook(() =>
        useSearch({ type: 'unknown' as any, term: 'anything' }),
      );
      result = hook.result;
    });

    await waitFor(() => {
      expect(result.current.results).toEqual([]);
    });
  });

  it('Returns correspondence search results.', async () => {
    let result: { current: UseSearchState };

    await act(async () => {
      const hook = renderHook(() =>
        useSearch({ type: 'correspondences', term: 'First' }),
      );
      result = hook.result;
    });

    await waitFor(() =>
      expect(result.current.results).toEqual([
        expect.objectContaining({ title: 'First Correspondence' }),
      ]),
    );
  });

  it('Returns recipient search results (matches fullName).', async () => {
    let result: { current: UseSearchState };

    await act(async () => {
      const hook = renderHook(() =>
        useSearch({ type: 'recipients', term: 'Alice' }),
      );
      result = hook.result;
    });

    await waitFor(() =>
      expect(result.current.results).toEqual([
        expect.objectContaining({ fullName: 'Alice Smith' }),
      ]),
    );
  });

  it('Returns letter search results.', async () => {
    let result: { current: UseSearchState };

    await act(async () => {
      const hook = renderHook(() =>
        useSearch({ type: 'letters', term: 'Thank' }),
      );
      result = hook.result;
    });

    await waitFor(() =>
      expect(result.current.results).toEqual([
        expect.objectContaining({ title: 'Thank You Note' }),
      ]),
    );
  });

  it('Respects the limit parameter.', async () => {
    let result: { current: UseSearchState };

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

    await waitFor(() => expect(result.current.results.length).toBe(1));
  });

  it('Surfaces an error when fetch fails.', async () => {
    const error = new Error('Fetch failed');

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(error),
    );

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { result } = renderHook(() =>
      useSearch({ type: 'correspondences', term: 'test' }),
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load search data:',
        error,
      );
      expect(result.current.error).toBe('Failed to load search data.');
      expect(result.current.results).toEqual([]);
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

  it('Surfaces an error when a response is not ok.', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      }),
    );

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { result } = renderHook(() =>
      useSearch({ type: 'correspondences', term: 'test' }),
    );

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load search data.');
      expect(result.current.results).toEqual([] as SearchResult[]);
    });

    consoleErrorSpy.mockRestore();
  });

  it('Surfaces an error when the search index response is not ok.', async () => {
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
              ],
            }),
        });
      }

      if (url.includes('search.') && url.endsWith('.json')) {
        return Promise.resolve({
          ok: false,
          status: 503,
          json: () => Promise.resolve({}),
        });
      }

      return Promise.reject(new Error('Unknown fetch URL'));
    });

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { result } = renderHook(() =>
      useSearch({ type: 'all', term: 'test' }),
    );

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load search data.');
      expect(result.current.loading).toBe(false);
      expect(result.current.results).toEqual([]);
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

  it('Filters by exact category when isExactCategory is set.', async () => {
    let result: { current: UseSearchState };

    await act(async () => {
      const hook = renderHook(() =>
        useSearch({
          type: 'all',
          term: 'Technology',
          isExactCategory: true,
        }),
      );
      result = hook.result;
    });

    await waitFor(() => {
      expect(result.current.results).toEqual([
        expect.objectContaining({
          title: 'First Correspondence',
          reason: expect.objectContaining({ category: 'TECHNOLOGY' }),
        }),
      ]);
    });
  });
});
