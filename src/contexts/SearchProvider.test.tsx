import {
  SearchContext,
  SearchProvider,
  useSearchData,
} from '@contexts/SearchProvider';
import { render } from '@testing-library/react';

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
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn().mockRejectedValueOnce(mockError);

    await render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>,
    );

    expect(console.error).toHaveBeenCalledWith(
      'Failed to load search.json:',
      mockError,
    );

    (console.error as jest.Mock).mockRestore();
  });
});
