import { Correspondence, CorrespondencesMap } from '@ts-types/correspondence';
import {
  CorrespondenceContext,
  CorrespondenceProvider,
  useCorrespondence,
} from './index';
import { CorrespondenceFactory } from '@factories/correspondence';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

const mockCorrespondences: Correspondence[] =
  CorrespondenceFactory.buildList(2);

const mockCorrespondencesById = mockCorrespondences.reduce(
  (acc, correspondence) => {
    acc[correspondence.correspondenceId] = correspondence;
    return acc;
  },
  {} as CorrespondencesMap,
);

const mockDate = new Date().toISOString();

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
  it('Provides correct values to consumers', () => {
    render(
      <CorrespondenceProvider
        correspondences={mockCorrespondences}
        correspondencesById={mockCorrespondencesById}
        earliestSentAtDate={mockDate}
      >
        <TestComponent />
      </CorrespondenceProvider>,
    );
    expect(screen.getByTestId('correspondence-count')).toHaveTextContent(
      'Correspondences: 2',
    );
  });

  it('Uses default values when no props are passed', () => {
    render(
      <CorrespondenceProvider
        correspondences={[]}
        correspondencesById={mockCorrespondencesById}
        earliestSentAtDate={mockDate}
      >
        <TestComponent />
      </CorrespondenceProvider>,
    );

    expect(screen.getByTestId('correspondence-count')).toHaveTextContent(
      'Correspondences: 0',
    );
  });

  it('Provides default values', () => {
    expect(CorrespondenceContext).toBeDefined();
  });

  it('Has no accessibility errors.', async () => {
    const { container } = render(
      <CorrespondenceProvider
        correspondences={mockCorrespondences}
        correspondencesById={mockCorrespondencesById}
        earliestSentAtDate={mockDate}
      >
        <TestComponent />
      </CorrespondenceProvider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
