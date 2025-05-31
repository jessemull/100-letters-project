import Image from 'next/image';
import React from 'react';
import { Card } from '@components/Feed';
import { Correspondence } from '@ts-types/correspondence';
import { axe } from 'jest-axe';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock('@components/Admin/Letters', () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <Image
      src={src}
      alt={alt}
      width={100}
      height={100}
      data-testid="card-image"
    />
  ),
}));

const mockCorrespondence = {
  correspondenceId: 'abc123',
  title: 'Letter to Alan Turing',
  recipient: {
    firstName: 'Alan',
    lastName: 'Turing',
    address: {},
  },
  reason: {
    description: 'For contributions to computer science.',
  },
  letters: [
    {
      letterId: 'letter1',
      title: 'First Letter',
      dateSent: '2025-01-01',
      imageURLs: [
        {
          urlThumbnail: '/thumbnail.jpg',
        },
      ],
    },
  ],
} as unknown as Correspondence;

describe('Card Commponent', () => {
  it('Renders the title, recipient, and reason.', () => {
    render(<Card correspondence={mockCorrespondence} />);
    expect(screen.getByText('Letter to Alan Turing')).toBeInTheDocument();
    expect(screen.getByText('Turing, Alan')).toBeInTheDocument();
    expect(
      screen.getByText('For contributions to computer science.'),
    ).toBeInTheDocument();
  });

  it('Uses the first image thumbnail URL as the image src.', () => {
    render(<Card correspondence={mockCorrespondence} />);
    const img = screen.getByTestId('card-image') as HTMLImageElement;
    expect(img.alt).toBe('First Letter');
  });

  it('Uses the fallback image and alt text if image is missing.', () => {
    const modifiedCorrespondence = {
      ...mockCorrespondence,
      letters: [],
    };
    render(<Card correspondence={modifiedCorrespondence} />);
    const img = screen.getByTestId('card-image') as HTMLImageElement;
    expect(img.alt).toBe('Letter Image');
  });

  it('Accepts and passes loading and priority props to the Image component.', () => {
    render(
      <Card correspondence={mockCorrespondence} loading="lazy" priority />,
    );
    const img = screen.getByTestId('card-image');
    expect(img).toBeInTheDocument();
  });

  it('Has the correct outer class for layout and hover styling.', () => {
    const { container } = render(<Card correspondence={mockCorrespondence} />);
    const cardDiv = container.querySelector('div');
    expect(cardDiv?.className).toMatch(/rounded-xl/);
    expect(cardDiv?.className).toMatch(/hover:scale/);
  });

  it('Fires router.push when Enter or Space is pressed.', () => {
    const pushMock = jest.fn();
    (require('next/navigation').useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    render(<Card correspondence={mockCorrespondence} />);
    const card = screen.getByRole('button');

    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(pushMock).toHaveBeenCalledWith(
      '/correspondence?correspondenceId=abc123',
    );

    pushMock.mockClear();
    fireEvent.keyDown(card, { key: ' ', code: 'Space', charCode: 32 });
    expect(pushMock).toHaveBeenCalledWith(
      '/correspondence?correspondenceId=abc123',
    );
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<Card correspondence={mockCorrespondence} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
