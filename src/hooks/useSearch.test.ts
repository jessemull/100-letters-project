import { renderHook } from '@testing-library/react';
import { useSearch } from '@hooks/useSearch';

jest.mock('@public/search.json', () => ({
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
  it('Returns empty array if search term is blank.', () => {
    const { result } = renderHook(() =>
      useSearch({ type: 'correspondences', term: '  ' }),
    );
    expect(result.current).toEqual([]);
  });

  it('Returns correspondence search results.', () => {
    const { result } = renderHook(() =>
      useSearch({ type: 'correspondences', term: 'First' }),
    );

    expect(result.current).toEqual([
      expect.objectContaining({ title: 'First Correspondence' }),
    ]);
  });

  it('Returns recipient search results (matches fullName).', () => {
    const { result } = renderHook(() =>
      useSearch({ type: 'recipients', term: 'Alice' }),
    );

    expect(result.current).toEqual([
      expect.objectContaining({ fullName: 'Alice Smith' }),
    ]);
  });

  it('Returns letter search results.', () => {
    const { result } = renderHook(() =>
      useSearch({ type: 'letters', term: 'Thank' }),
    );

    expect(result.current).toEqual([
      expect.objectContaining({ title: 'Thank You Note' }),
    ]);
  });

  it('Respects the limit parameter.', () => {
    const { result } = renderHook(() =>
      useSearch({ type: 'correspondences', term: 'Correspondence', limit: 1 }),
    );

    expect(result.current.length).toBe(1);
  });
});
