import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Feed from '@components/Feed/Feed';
import { useSearch } from '@hooks/useSearch';
import { axe } from 'jest-axe';

jest.mock('@hooks/useSearch', () => ({
  useSearch: jest.fn(),
}));

jest.mock('@components/Feed', () => ({
  Search: ({ term }: any) => <div data-testid="search">Search for {term}</div>,
  Splash: () => <div data-testid="splash">Splash</div>,
}));

jest.mock('@components/Form', () => ({
  TextInput: ({ value, onChange, onIconEndClick, IconEnd }: any) => (
    <div>
      <input
        data-testid="text-input"
        value={value}
        onChange={onChange}
        placeholder="Search for letters and people..."
      />
      {IconEnd && (
        <button data-testid="icon-end" onClick={onIconEndClick}>
          X
        </button>
      )}
    </div>
  ),
}));

describe('Feed component', () => {
  const mockResults = [{ title: 'Result 1' }, { title: 'Result 2' }];
  let pushStateSpy: jest.SpyInstance;

  beforeEach(() => {
    (useSearch as jest.Mock).mockReturnValue(mockResults);
    pushStateSpy = jest.spyOn(window.history, 'pushState');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders Splash by default.', () => {
    render(<Feed />);
    expect(screen.getByTestId('splash')).toBeInTheDocument();
  });

  it('Shows Search when term is typed and history is pushed.', () => {
    render(<Feed />);
    const input = screen.getByTestId('text-input');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByTestId('search')).toHaveTextContent('test');
    expect(pushStateSpy).toHaveBeenCalledWith({ search: true }, '');
  });

  it('Clearing term still shows Search component.', () => {
    render(<Feed />);
    const input = screen.getByTestId('text-input');

    fireEvent.change(input, { target: { value: 'test' } });
    expect(screen.getByTestId('search')).toBeInTheDocument();

    const iconEnd = screen.getByTestId('icon-end');
    fireEvent.click(iconEnd);

    expect(screen.getByTestId('search')).toBeInTheDocument();
  });

  it('Renders IconEnd (X) when term is present and clicking it clears the input.', () => {
    render(<Feed />);
    const input = screen.getByTestId('text-input');

    fireEvent.change(input, { target: { value: 'x' } });
    expect(screen.getByTestId('icon-end')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('icon-end'));
    expect(input).toHaveValue('');
  });

  it('Handles back button to return to Splash and reset term.', () => {
    render(<Feed />);
    const input = screen.getByTestId('text-input');

    fireEvent.change(input, { target: { value: 'hello' } });
    expect(screen.getByTestId('search')).toBeInTheDocument();

    fireEvent.popState(window);
    expect(screen.getByTestId('splash')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<Feed />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
