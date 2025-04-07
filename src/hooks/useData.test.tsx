import * as fetchWithAuthModule from '../util/fetchWithAuth';
import React from 'react';
import { Letter } from 'src/types';
import { render, waitFor } from '@testing-library/react';
import { useData } from './useData';

jest.mock('../util/fetchWithAuth');

const mockLetters = [{ letterId: '1' }, { letterId: '2' }] as Letter[];

const TestComponent = ({
  token,
  skip = false,
}: {
  token: string | null;
  skip?: boolean;
}) => {
  const { data, loading, error } = useData({
    token,
    route: '/letters',
    skip,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map((letter) => (
        <div key={letter.letterId} data-testid="letter">
          {letter.title}
        </div>
      ))}
    </div>
  );
};

const TestComponentWithKey = ({
  token,
  lastEvaluatedKey,
}: {
  token: string;
  lastEvaluatedKey?: string;
}) => {
  useData({
    token,
    route: '/letters',
    lastEvaluatedKey,
  });

  return null;
};

describe('useData', () => {
  const mockUseFetch = fetchWithAuthModule.fetchWithAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays data when token is provided', async () => {
    mockUseFetch.mockResolvedValue({ data: mockLetters });

    const { getAllByTestId } = render(<TestComponent token="mock-token" />);

    await waitFor(() => {
      expect(getAllByTestId('letter')).toHaveLength(mockLetters.length);
    });
  });

  it('does not fetch if token is missing', async () => {
    render(<TestComponent token={null} />);
    expect(mockUseFetch).not.toHaveBeenCalled();
  });

  it('does not fetch if skip is true', async () => {
    render(<TestComponent token="mock-token" skip={true} />);
    expect(mockUseFetch).not.toHaveBeenCalled();
  });

  it('shows error on fetch failure', async () => {
    mockUseFetch.mockRejectedValue(new Error('Fetch failed'));

    const { findByText } = render(<TestComponent token="mock-token" />);
    expect(await findByText(/Fetch failed/)).toBeInTheDocument();
  });

  it('Adds lastEvaluatedKey to request URL if provided.', async () => {
    mockUseFetch.mockResolvedValue({ data: mockLetters });

    const lastEvaluatedKey = 'abc123';

    render(
      <TestComponentWithKey
        token="mock-token"
        lastEvaluatedKey={lastEvaluatedKey}
      />,
    );

    await waitFor(() => {
      expect(mockUseFetch).toHaveBeenCalledTimes(1);
    });

    const calledWith = mockUseFetch.mock.calls[0][0];
    const url = new URL(calledWith.url);

    expect(url.origin + url.pathname).toBe(
      'https://api-dev.onehundredletters.com/letters',
    );
    expect(url.searchParams.get('lastEvaluatedKey')).toBe(lastEvaluatedKey);
    expect(url.searchParams.get('limit')).toBe('25');
  });
});
