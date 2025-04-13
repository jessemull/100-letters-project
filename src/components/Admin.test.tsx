import * as useDataHook from '../hooks/useSWRQuery';
import Admin from './Admin';
import React from 'react';
import { axe } from 'jest-axe';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LetterFactory } from '../factories';
import { useAuth } from '../contexts/AuthProvider';
import { useRouter } from 'next/navigation';

jest.mock('../contexts/AuthProvider');
jest.mock('next/navigation');
jest.mock('../hooks/useSWRQuery');

const mockPush = jest.fn();

const renderWithAuth = (overrides = {}) => {
  (useAuth as jest.Mock).mockReturnValue({
    isLoggedIn: true,
    loading: false,
    token: 'mock-token',
    ...overrides,
  });

  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });
};

const mockuseSWRQuery = useDataHook.useSWRQuery as jest.Mock;

describe('Admin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Redirects to /403 if user is not logged in and not authenticating.', async () => {
    renderWithAuth({ isLoggedIn: false, loading: false });

    mockuseSWRQuery.mockReturnValue({ data: [], isLoading: true });

    render(<Admin />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/forbidden');
    });
  });

  it('Has no accessibility violations.', async () => {
    renderWithAuth();

    mockuseSWRQuery.mockReturnValue({ data: { data: [] }, isLoading: false });

    const { container } = render(<Admin />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Renders correspondence tab with mock data.', async () => {
    renderWithAuth();

    mockuseSWRQuery
      .mockReturnValueOnce({
        data: { data: [{ id: 1, title: 'Test Correspondence' }] },
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: { data: [] },
        isLoading: false,
      })
      .mockReturnValueOnce({
        data: { data: [] },
        isLoading: false,
      });

    render(<Admin />);

    expect(await screen.findByText('Test Correspondence')).toBeInTheDocument();
  });

  it('Switches to Letters tab and renders letter data.', async () => {
    renderWithAuth();

    const letterData = LetterFactory.build();

    mockuseSWRQuery.mockReturnValue({
      data: { data: [letterData] },
      isLoading: false,
    });

    render(<Admin />);

    const lettersTab = screen.getByRole('tab', { name: 'Letters' });
    fireEvent.click(lettersTab);

    expect(await screen.findByText(letterData.title)).toBeInTheDocument();
  });

  it('Renders empty state if no data in tab.', async () => {
    renderWithAuth();

    mockuseSWRQuery.mockReturnValue({ data: { data: [] }, isLoading: false });

    render(<Admin />);

    expect(await screen.findByText('No results found.')).toBeInTheDocument();
  });

  it('Filters list when search input is used.', async () => {
    renderWithAuth();

    mockuseSWRQuery.mockReturnValue({
      data: {
        data: [
          { id: 1, title: 'Alpha Correspondence' },
          { id: 2, title: 'Beta Correspondence' },
        ],
      },
      isLoading: false,
    });

    render(<Admin />);

    const input = screen.getByTestId('admin-search');

    fireEvent.change(input, { target: { value: 'Alpha' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Alpha')).toBeInTheDocument();
    });
  });

  it('Shows loading spinner when fetching data.', () => {
    renderWithAuth();

    mockuseSWRQuery.mockReturnValue({ data: null, isLoading: true });

    render(<Admin />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Switches tabs using the mobile select element.', async () => {
    renderWithAuth();

    const letterData = LetterFactory.build({ title: 'Mobile Test Letter' });

    mockuseSWRQuery.mockReturnValue({
      data: { data: [letterData] },
      isLoading: false,
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<Admin />);

    expect(await screen.getByLabelText('Select a section')).toBeInTheDocument();

    const select = screen.getByLabelText('Select a section');

    fireEvent.change(select, { target: { value: '1' } });

    expect(await screen.findByText('Mobile Test Letter')).toBeInTheDocument();
  });
});
