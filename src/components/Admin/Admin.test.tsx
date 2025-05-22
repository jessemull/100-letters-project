import * as useDataHook from '@hooks/useSWRQuery';
import React from 'react';
import { Admin } from '@components/Admin';
import { LetterFactory } from '@factories/letter';
import { axe } from 'jest-axe';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '@contexts/AuthProvider';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

jest.mock('@contexts/AuthProvider');

jest.mock('@util/debounce', () => ({
  debounce: (fn: Function) => {
    return fn;
  },
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@hooks/useSWRQuery');

const mockPush = jest.fn();
const mockReplace = jest.fn();

const renderWithAuth = (overrides = {}) => {
  (useAuth as jest.Mock).mockReturnValue({
    isLoggedIn: true,
    loading: false,
    token: 'mock-token',
    ...overrides,
  });

  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
    replace: mockReplace,
  });

  (useSearchParams as jest.Mock).mockReturnValue({
    get: () => null,
  });

  (usePathname as jest.Mock).mockReturnValue('/admin');
};

describe('Admin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Has no accessibility violations.', async () => {
    renderWithAuth();

    (useDataHook.useSWRQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
    });

    const { container } = render(<Admin />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Renders correspondence tab with mock data.', async () => {
    renderWithAuth();

    (useDataHook.useSWRQuery as jest.Mock).mockReturnValue({
      data: { data: [{ correspondenceId: 1, title: 'Test Correspondence' }] },
      isLoading: false,
    });

    render(<Admin />);

    expect(await screen.findByText('Test Correspondence')).toBeInTheDocument();
  });

  it('Switches to Letters tab and renders letter data.', async () => {
    renderWithAuth();

    const letterData = LetterFactory.build();

    (useDataHook.useSWRQuery as jest.Mock).mockReturnValue({
      data: { data: [letterData] },
      isLoading: false,
    });

    render(<Admin />);

    fireEvent.click(screen.getByRole('tab', { name: 'Letters' }));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/admin?tab=letters');
    });

    expect(await screen.findByText(letterData.title)).toBeInTheDocument();
  });

  it('Renders empty state if no data in tab.', async () => {
    renderWithAuth();

    (useDataHook.useSWRQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
    });

    render(<Admin />);

    expect(await screen.findByText('No results found.')).toBeInTheDocument();
  });

  it('Filters list when search input is used.', async () => {
    renderWithAuth();

    (useDataHook.useSWRQuery as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: 1, title: 'Alpha Correspondence' },
          { id: 2, title: 'Beta Correspondence' },
        ],
      },
      isLoading: false,
    });

    render(<Admin />);

    const input = screen.getByTestId('text-input');
    fireEvent.change(input, { target: { value: 'Alpha' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Alpha')).toBeInTheDocument();
    });
  });

  it('Shows loading spinner when fetching data.', () => {
    renderWithAuth();

    (useDataHook.useSWRQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<Admin />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Switches tabs using the mobile select element.', async () => {
    renderWithAuth();

    const letterData = LetterFactory.build({ title: 'Mobile Test Letter' });

    (useDataHook.useSWRQuery as jest.Mock).mockReturnValue({
      data: { data: [letterData] },
      isLoading: false,
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<Admin />);

    const select = screen.getByLabelText('Select a section');
    fireEvent.change(select, { target: { value: '1' } });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/admin?tab=letters');
    });

    expect(await screen.findByText('Mobile Test Letter')).toBeInTheDocument();
  });

  it('Navigates to correct create route when "Create New" is clicked.', async () => {
    renderWithAuth();

    (useDataHook.useSWRQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
    });

    render(<Admin />);

    const createButton = screen.getByRole('button', { name: 'Create New' });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/correspondence');
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Recipients' }));
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/admin?tab=recipients');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create New' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/recipient');
    });
  });
  it('Calls setSearch via debounce when user types in search input.', async () => {
    renderWithAuth();

    (useDataHook.useSWRQuery as jest.Mock).mockReturnValue({
      data: {
        data: [
          { id: 1, title: 'Alpha Correspondence' },
          { id: 2, title: 'Beta Correspondence' },
        ],
      },
      isLoading: false,
    });

    render(<Admin />);

    const input = screen.getByTestId('text-input');
    fireEvent.change(input, { target: { value: 'Beta' } });

    await waitFor(
      () => {
        expect(screen.getByText('Beta Correspondence')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });
});
