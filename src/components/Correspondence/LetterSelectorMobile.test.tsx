import LetterSelectorMobile from '@components/Correspondence/LetterSelectorMobile';
import React from 'react';
import { Letter } from '@ts-types/letter';
import { Status } from '@ts-types/correspondence';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

describe('LetterSelectorMobile Component', () => {
  const mockOnSelect = jest.fn();

  const letters: Letter[] = [
    {
      letterId: '1',
      title: 'Letter One',
      sentAt: '2024-01-01',
      text: 'Text 1',
      description: 'Description 1',
      status: Status.SENT,
    },
    {
      letterId: '2',
      title: 'Letter Two',
      receivedAt: '2024-02-02',
      text: 'Text 2',
      description: 'Description 2',
      status: Status.RECEIVED,
    },
    {
      letterId: '3',
      title: 'Letter Three',
      text: 'Text 3',
      description: 'Description 3',
      status: Status.UNSENT,
    },
  ] as unknown as Letter[];

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('Renders the heading and Select component with correct options.', () => {
    render(
      <LetterSelectorMobile
        letters={letters}
        selected={1}
        onSelect={mockOnSelect}
      />,
    );

    expect(
      screen.getByRole('heading', { name: /letters/i }),
    ).toBeInTheDocument();

    const sentDate = new Date('2024-01-01').toLocaleDateString();
    const receivedDate = new Date('2024-02-02').toLocaleDateString();

    expect(screen.getByText(sentDate)).toBeInTheDocument();
    expect(screen.getByText(receivedDate)).toBeInTheDocument();
    expect(screen.getByText('No Date')).toBeInTheDocument();
  });

  it('Calls onSelect with correct index when user selects a different letter.', () => {
    render(
      <LetterSelectorMobile
        letters={letters}
        selected={0}
        onSelect={mockOnSelect}
      />,
    );

    const selectElement = screen.getByLabelText(/select a letter/i);
    fireEvent.change(selectElement, { target: { value: '2' } });

    expect(mockOnSelect).toHaveBeenCalledWith(2);
  });

  it('Handles initial selection correctly.', () => {
    render(
      <LetterSelectorMobile
        letters={letters}
        selected={0}
        onSelect={mockOnSelect}
      />,
    );
    const selectElement = screen.getByLabelText(
      /select a letter/i,
    ) as HTMLSelectElement;
    expect(selectElement.value).toBe('0');
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <LetterSelectorMobile
        letters={letters}
        selected={1}
        onSelect={mockOnSelect}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
