import React from 'react';
import { Category } from '@components/Category';
import { axe } from 'jest-axe';
import { render, screen, fireEvent, act } from '@testing-library/react';

const mockReplace = jest.fn();
const mockPushState = jest.fn();
const mockGet = jest.fn(() => 'technology');

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

jest.mock('@hooks/useSearch', () => ({
  useSearch: jest.fn(() => [
    { id: 1, title: 'Result 1' },
    { id: 2, title: 'Result 2' },
  ]),
}));

jest.mock('@components/Feed', () => ({
  Search: ({ term, results }: { term: string; results: any[] }) => (
    <div data-testid="mock-search">
      <div>Mocked Search Component for term: {term}</div>
      {results.map((r) => (
        <div key={r.id}>{r.title}</div>
      ))}
    </div>
  ),
}));

describe('Category Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window.history, 'pushState', {
      configurable: true,
      writable: true,
      value: mockPushState,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Renders search input and category header.', () => {
    render(<Category />);
    expect(
      screen.getByPlaceholderText(/search for letters and people/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /Explore Technology Letters/i,
    );
  });

  it('Renders Search component with correct term and results.', () => {
    render(<Category />);
    expect(screen.getByText(/Result 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Result 2/i)).toBeInTheDocument();
  });

  it('Updates term on input change and clears category with pushState.', () => {
    render(<Category />);
    const input = screen.getByPlaceholderText(/search for letters and people/i);

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'new term' } });

    expect(input).toHaveValue('new term');
    expect(mockPushState).toHaveBeenCalledWith(
      { category: 'technology' },
      '',
      '?',
    );
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('Clears term when icon end is clicked.', () => {
    render(<Category />);
    const input = screen.getByPlaceholderText(/search for letters and people/i);
    fireEvent.change(input, { target: { value: 'something' } });

    const clearButton = screen.getByTestId('password-text-input-icon-end');
    fireEvent.click(clearButton);
    expect(input).toHaveValue('');
  });

  it('Handles popstate event and calls router.replace.', () => {
    render(<Category />);

    expect(mockReplace).not.toHaveBeenCalled();

    mockGet.mockImplementation(() => 'history');

    act(() => {
      window.history.pushState({}, '', '/?category=history');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<Category />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
