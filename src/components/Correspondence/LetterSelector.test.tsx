import { Letter } from '@ts-types/letter';
import { LetterSelector } from '@components/Correspondence';
import { Status } from '@ts-types/correspondence';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

describe('LetterSelector Component', () => {
  const mockOnSelect = jest.fn();

  const letters: Letter[] = [
    {
      letterId: '1',
      title: 'First Letter',
      sentAt: '2023-01-01',
      description: 'Desc 1',
      text: 'Text 1',
      status: Status.SENT,
    },
    {
      letterId: '2',
      title: 'Second Letter',
      receivedAt: '2023-02-01',
      description: 'Desc 2',
      text: 'Text 2',
      status: Status.RECEIVED,
    },
    {
      letterId: '3',
      title: 'Third Letter',
      description: 'Desc 3',
      text: 'Text 3',
      status: Status.UNSENT,
    },
  ] as unknown as Letter[];

  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn();
    Element.prototype.scrollTo = jest.fn(); // ← Add this line
  });

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('Renders header and all letter dates correctly.', () => {
    render(
      <LetterSelector letters={letters} selected={1} onSelect={mockOnSelect} />,
    );

    expect(
      screen.getByRole('heading', { name: /letters/i }),
    ).toBeInTheDocument();

    const sentDate = new Date('2023-01-01').toLocaleDateString('en-US');
    const receivedDate = new Date('2023-02-01').toLocaleDateString('en-US');

    expect(screen.getByText(sentDate)).toBeInTheDocument(); // sentAt
    expect(screen.getByText(receivedDate)).toBeInTheDocument(); // receivedAt
    expect(screen.getByText('No Date')).toBeInTheDocument(); // neither
  });

  it('Highlights the selected letter.', () => {
    render(
      <LetterSelector letters={letters} selected={1} onSelect={mockOnSelect} />,
    );

    const receivedDate = new Date('2023-02-01').toLocaleDateString('en-US');

    const selectedBtn = screen.getByText(receivedDate);
    expect(selectedBtn).toHaveClass('font-semibold');
  });

  it('Calls onSelect when a letter is clicked.', () => {
    render(
      <LetterSelector letters={letters} selected={0} onSelect={mockOnSelect} />,
    );

    const receivedDate = new Date('2023-02-01').toLocaleDateString('en-US');

    const secondButton = screen.getByText(receivedDate);
    fireEvent.click(secondButton);
    expect(mockOnSelect).toHaveBeenCalledWith(1);
  });

  it('Navigates up with the up arrow button.', () => {
    render(
      <LetterSelector letters={letters} selected={1} onSelect={mockOnSelect} />,
    );

    const upButton = screen.getAllByRole('button')[0]; // First button is the up arrow
    fireEvent.click(upButton);
    expect(mockOnSelect).toHaveBeenCalledWith(0);
  });

  it('Does not go below 0 when at top.', () => {
    render(
      <LetterSelector letters={letters} selected={0} onSelect={mockOnSelect} />,
    );

    const upButton = screen.getAllByRole('button')[0];
    fireEvent.click(upButton);
    expect(mockOnSelect).toHaveBeenCalledWith(0);
  });

  it('Navigates down with the down arrow button.', () => {
    render(
      <LetterSelector letters={letters} selected={1} onSelect={mockOnSelect} />,
    );

    const downButton = screen.getAllByRole('button').at(-1)!;
    fireEvent.click(downButton);
    expect(mockOnSelect).toHaveBeenCalledWith(2);
  });

  it('Does not go past max index.', () => {
    render(
      <LetterSelector letters={letters} selected={2} onSelect={mockOnSelect} />,
    );

    const downButton = screen.getAllByRole('button').at(-1)!;
    fireEvent.click(downButton);
    expect(mockOnSelect).toHaveBeenCalledWith(2);
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <LetterSelector letters={letters} selected={1} onSelect={mockOnSelect} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
