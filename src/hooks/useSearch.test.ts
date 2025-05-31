import { SearchResult } from '@ts-types/search';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useSearch } from '@hooks/useSearch';

jest.mock('@public/data/data.json', () => ({
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
        domain: 'example.com',
      },
      letters: [
        {
          title: 'Welcome Letter',
        },
      ],
    },
  ],
}));

jest.mock('@public/data/search.json', () => ({
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
    { id: 'r2', firstName: 'Bob', lastName: 'Jones', fullName: 'Bob Jones' },
  ],
  letters: [
    { id: 'l1', title: 'Welcome Letter' },
    { id: 'l2', title: 'Thank You Note' },
  ],
}));

describe('useSearch', () => {
  it('Returns empty array if search term is blank.', async () => {
    const { result } = renderHook(() =>
      useSearch({ type: 'correspondences', term: '  ' }),
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it('Returns empty array when fuse is undefined for given type', async () => {
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
});
