import { CorrespondenceCard } from '@ts-types/correspondence';
import { RecipientDetails } from '@components/Correspondence';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

const resizeWindow = (width: number) => {
  (window.innerWidth as number) = width;
  window.dispatchEvent(new Event('resize'));
};

describe('RecipientDetails Component', () => {
  const correspondence = {
    correspondenceId: 'abc123',
    title: 'Letter to Marie Curie',
    reason: {
      category: 'SCIENCE',
      description: 'Her pioneering work in radioactivity inspired me.',
    },
    recipient: {
      firstName: 'Marie',
      lastName: 'Curie',
      fullName: 'Marie Curie',
      occupation: 'Physicist and Chemist',
      organization: 'Sorbonne University',
      description:
        'First woman to win a Nobel Prize and the only person to win in two scientific fields.',
    },
  } as unknown as CorrespondenceCard;

  beforeEach(() => {
    resizeWindow(1024);
  });

  it('Renders all recipient details.', () => {
    render(<RecipientDetails correspondence={correspondence} />);
    expect(
      screen.getByRole('heading', { name: /Marie Curie/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Marie Curie/)).toBeInTheDocument();
    expect(screen.getByText(/Physicist and Chemist/)).toBeInTheDocument();
    expect(screen.getByText(/Sorbonne University/)).toBeInTheDocument();
    expect(
      screen.getByText(
        /First woman to win a Nobel Prize and the only person to win in two scientific fields/i,
      ),
    ).toBeInTheDocument();
  });

  it('Applies dynamicHeight styles when > 0 on desktop.', () => {
    const dynamicHeight = 300;
    const { container } = render(
      <RecipientDetails
        correspondence={correspondence}
        dynamicHeight={dynamicHeight}
      />,
    );

    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveStyle({
      height: `${dynamicHeight}px`,
      maxHeight: `${dynamicHeight}px`,
      overflow: 'hidden',
    });
  });

  it('Renders "Other" category label when category is missing or unknown.', () => {
    const modified = {
      ...correspondence,
      reason: {
        ...correspondence.reason,
        category: 'NON_EXISTENT_CATEGORY',
      },
    };
    render(<RecipientDetails correspondence={modified} />);
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('Applies scrollable container classes when isDesktop and dynamicHeight are truthy.', () => {
    const dynamicHeight = 400;
    const { container } = render(
      <RecipientDetails
        correspondence={correspondence}
        dynamicHeight={dynamicHeight}
      />,
    );

    const scrollableDiv = container.querySelector(
      '.md\\:flex-1.md\\:min-h-0.md\\:overflow-y-auto.md\\:pr-2',
    );

    expect(scrollableDiv).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <RecipientDetails correspondence={correspondence} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
