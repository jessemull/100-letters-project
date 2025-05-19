import Feed from '@components/Feed/Feed';
import { axe } from 'jest-axe';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useSearch } from '@hooks/useSearch';

jest.mock('@hooks/useSearch', () => ({
  useSearch: jest.fn(),
}));

jest.mock('@components/Form', () => ({
  TextInput: ({ value, onChange, onIconEndClick, IconEnd }: any) => (
    <div>
      <input
        type="text"
        value={value}
        placeholder="Search for letters and people..."
        onChange={onChange}
        data-testid="search-input"
      />
      {IconEnd && (
        <button onClick={onIconEndClick} data-testid="clear-icon">
          clear
        </button>
      )}
    </div>
  ),
}));

jest.mock('@components/Feed', () => ({
  Splash: () => <div data-testid="splash">Splash Component</div>,
  Search: ({ term }: { term: string }) => (
    <div data-testid="search-results">Search results for: {term}</div>
  ),
}));

describe('Feed component', () => {
  beforeEach(() => {
    (useSearch as jest.Mock).mockImplementation(() => [
      { id: 1, type: 'person', name: 'Test Result' },
    ]);
    window.history.replaceState({}, '', '/');
  });

  it('Renders splash by default.', () => {
    render(<Feed />);
    expect(screen.getByTestId('splash')).toBeInTheDocument();
  });

  it('Renders search results when there is a search param in URL.', async () => {
    window.history.pushState({}, '', '/?search=test');

    await act(() => Promise.resolve()); // wait for useEffect
    render(<Feed />);
    expect(screen.getByTestId('search-results')).toHaveTextContent('test');
  });

  it('Updates term when typing in input.', () => {
    render(<Feed />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'new term' } });
    expect(input).toHaveValue('new term');
  });

  it('Shows clear icon when term is present and clears input on click.', () => {
    render(<Feed />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'something' } });
    expect(screen.getByTestId('clear-icon')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('clear-icon'));
    expect(input).toHaveValue('');
  });

  it('Pushes search param to URL when typing a new term.', () => {
    render(<Feed />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'hello' } });

    // Wait for useEffect to trigger the URL change
    expect(window.location.search).toBe('?search=hello');
    expect(screen.getByTestId('search-results')).toBeInTheDocument();
  });

  it('Removes search param from URL when clearing term.', () => {
    render(<Feed />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(window.location.search).toBe('?search=test');

    fireEvent.click(screen.getByTestId('clear-icon'));
    expect(window.location.search).toBe('');
  });

  it('Syncs term and showSearch on popstate back to splash.', () => {
    render(<Feed />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(screen.getByTestId('search-results')).toBeInTheDocument();

    window.history.pushState({}, '', '/');
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.getByTestId('search-results')).toBeInTheDocument();
  });

  it('Syncs term and showSearch on popstate to search view.', () => {
    render(<Feed />);
    window.history.pushState({}, '', '/?search=abc');

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(screen.getByTestId('search-results')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toHaveValue('abc');
  });

  it('Uses pushState the first time and replaceState afterwards when updating the URL.', () => {
    const pushSpy = jest.spyOn(window.history, 'pushState');
    const replaceSpy = jest.spyOn(window.history, 'replaceState');

    render(<Feed />);
    const input = screen.getByTestId('search-input');

    fireEvent.change(input, { target: { value: 'first' } });
    expect(pushSpy).toHaveBeenCalled();
    expect(replaceSpy).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: 'second' } });
    expect(replaceSpy).toHaveBeenCalled();

    pushSpy.mockRestore();
    replaceSpy.mockRestore();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<Feed />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
