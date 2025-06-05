import {
  CorrespondenceContext,
  CorrespondenceProvider,
  useCorrespondence,
} from '@contexts/CorrespondenceProvider';
import { axe } from 'jest-axe';
import { render, screen, act } from '@testing-library/react';
import React from 'react';

jest.mock('@public/data/bootstrap.json', () => ({
  correspondences: [
    {
      id: '1',
      title: 'Intro Letter',
      recipient: {
        firstName: 'Alice',
        lastName: 'Smith',
        fullName: 'Alice Smith',
      },
    },
    {
      id: '2',
      title: 'Second Letter',
      recipient: {
        firstName: 'Bob',
        lastName: 'Jones',
        fullName: 'Bob Jones',
      },
    },
    {
      id: '3',
      title: 'Third Letter',
      recipient: {
        firstName: 'Carol',
        lastName: 'White',
        fullName: 'Carol White',
      },
    },
  ],
}));

const TestComponent = () => {
  const { correspondences, loading } = useCorrespondence();
  return (
    <div>
      <div data-testid="correspondence-count">
        Correspondences: {correspondences.length}
      </div>
      <div data-testid="loading">{loading ? 'Loading' : 'Loaded'}</div>
    </div>
  );
};

describe('CorrespondenceContext', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        correspondences: [
          {
            id: '1',
            title: 'Intro Letter',
            recipient: {
              firstName: 'Alice',
              lastName: 'Smith',
              fullName: 'Alice Smith',
            },
          },
          {
            id: '2',
            title: 'Second Letter',
            recipient: {
              firstName: 'Bob',
              lastName: 'Jones',
              fullName: 'Bob Jones',
            },
          },
          {
            id: '3',
            title: 'Third Letter',
            recipient: {
              firstName: 'Carol',
              lastName: 'White',
              fullName: 'Carol White',
            },
          },
        ],
        correspondencesById: {
          '5': { id: '5', title: 'New Letter' },
        },
      }),
    });
  });

  it('Provides correct values to consumers', async () => {
    await act(async () => {
      render(
        <CorrespondenceProvider>
          <TestComponent />
        </CorrespondenceProvider>,
      );
    });

    expect(screen.getByTestId('correspondence-count')).toHaveTextContent(
      'Correspondences: 3',
    );
  });

  it('Uses default values when no props are passed', async () => {
    await act(async () => {
      render(
        <CorrespondenceProvider>
          <TestComponent />
        </CorrespondenceProvider>,
      );
    });

    expect(screen.getByTestId('correspondence-count')).toHaveTextContent(
      'Correspondences: 3',
    );
  });

  it('Provides default values', () => {
    expect(CorrespondenceContext).toBeDefined();
  });

  it('Has no accessibility errors.', async () => {
    let container: HTMLElement;

    await act(async () => {
      const result = render(
        <CorrespondenceProvider>
          <TestComponent />
        </CorrespondenceProvider>,
      );
      container = result.container;
    });

    const results = await axe(container!);
    expect(results).toHaveNoViolations();
  });

  it('Handles default fallback values for fetch', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        correspondences: undefined,
        correspondencesById: undefined,
      }),
    });

    jest.mock('@public/data/bootstrap.json', () => ({
      correspondences: [],
    }));

    await act(async () => {
      render(
        <CorrespondenceProvider>
          <TestComponent />
        </CorrespondenceProvider>,
      );
    });

    expect(screen.getByTestId('correspondence-count')).toHaveTextContent(
      'Correspondences: 3',
    );
  });

  it('Logs error when fetch fails', async () => {
    const mockError = new Error('Network error');
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

    jest.mock('@public/data/bootstrap.json', () => ({
      correspondences: [],
    }));

    await act(async () => {
      render(
        <CorrespondenceProvider>
          <TestComponent />
        </CorrespondenceProvider>,
      );
    });

    expect(console.error).toHaveBeenCalledWith(
      'Failed to load correspondence data: ',
      mockError,
    );

    (console.error as jest.Mock).mockRestore();
  });
});
