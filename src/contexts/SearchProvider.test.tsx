import {
  SearchContext,
  SearchProvider,
  useSearchData,
} from '@contexts/SearchProvider';
import { act, render, screen } from '@testing-library/react';

jest.mock('@public/data/bootstrap.json', () => ({
  default: {
    dataVersion: 1234567890,
    totalCorrespondences: 2,
    earliestSentAtDate: '2023-01-01T00:00:00Z',
  },
}));

const TestComponent = () => {
  const { error, loading } = useSearchData();
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Done'}</div>
      <div data-testid="error">{error ?? 'none'}</div>
    </div>
  );
};

describe('SearchProvider', () => {
  it('SearchProvider is defined.', () => {
    expect(SearchContext).toBeDefined();
  });

  it('Exposes an error state when fetch fails.', async () => {
    const mockError = new Error('Fetch failed');
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(mockError);

    await act(async () => {
      render(
        <SearchProvider>
          <TestComponent />
        </SearchProvider>,
      );
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to load search data:',
      mockError,
    );
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Failed to load search data.',
    );
    expect(screen.getByTestId('loading')).toHaveTextContent('Done');

    consoleErrorSpy.mockRestore();
    global.fetch = originalFetch;
  });
});
