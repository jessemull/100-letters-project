import {
  SearchContext,
  SearchProvider,
  useSearchData,
} from '@contexts/SearchProvider';
import { render } from '@testing-library/react';

// Mock bootstrap.json with dataVersion for tests
jest.mock('@public/data/bootstrap.json', () => ({
  default: {
    dataVersion: 1234567890,
    totalCorrespondences: 2,
    earliestSentAtDate: '2023-01-01T00:00:00Z',
  },
}));

const TestComponent = () => {
  const { loading } = useSearchData();
  return <div data-testid="loading">{loading ? 'Loading' : 'Done'}</div>;
};

describe('SearchProvider', () => {
  it('SearchProvider is defined.', () => {
    expect(SearchContext).toBeDefined();
  });

  it('Logs an error when fetch fails.', async () => {
    const mockError = new Error('Fetch failed');
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Override the global fetch mock to reject
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(mockError);

    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>,
    );

    // Wait a bit for the async operation to complete
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to load search data:',
      mockError,
    );

    // Restore original mocks
    consoleErrorSpy.mockRestore();
    global.fetch = originalFetch;
  });
});
