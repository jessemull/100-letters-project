import {
  CorrespondenceContext,
  CorrespondenceProvider,
  useCorrespondence,
} from './index';
import { axe } from 'jest-axe';
import { render, screen, act } from '@testing-library/react';

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
  const { correspondences } = useCorrespondence();
  return (
    <div>
      <div data-testid="correspondence-count">
        Correspondences: {correspondences.length}
      </div>
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
          '1': { id: '1', title: 'Intro Letter' },
          '2': { id: '2', title: 'Second Letter' },
          '3': { id: '3', title: 'Third Letter' },
          '4': { id: '4', title: 'Fourth Letter' },
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
});
