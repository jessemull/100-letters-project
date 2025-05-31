import React from 'react';
import { LetterFactory } from '@factories/letter';
import { LetterItem } from '@components/Admin';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

const mockLetter = LetterFactory.build();

describe('LetterItem Component', () => {
  it('Renders the title and a truncated version of the letter text.', () => {
    render(
      <LetterItem data={mockLetter} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );

    expect(screen.getByText(mockLetter.title)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockLetter.text.slice(0, 25)}...`),
    ).toBeInTheDocument();
  });

  it('Calls onEdit with the letterId when the edit button is clicked.', () => {
    const onEditMock = jest.fn();
    render(
      <LetterItem data={mockLetter} onEdit={onEditMock} onDelete={jest.fn()} />,
    );

    fireEvent.click(screen.getByTestId('edit-button'));
    expect(onEditMock).toHaveBeenCalledWith(mockLetter.letterId);
  });

  it('Calls onDelete with the letterId when the delete button is clicked.', () => {
    const onDeleteMock = jest.fn();
    render(
      <LetterItem
        data={mockLetter}
        onEdit={jest.fn()}
        onDelete={onDeleteMock}
      />,
    );

    fireEvent.click(screen.getByTestId('delete-button'));
    expect(onDeleteMock).toHaveBeenCalledWith(
      mockLetter.letterId,
      mockLetter.correspondenceId,
    );
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <LetterItem data={mockLetter} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
