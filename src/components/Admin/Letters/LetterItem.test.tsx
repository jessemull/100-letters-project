import React from 'react';
import { LetterFactory } from '@factories/letter';
import { LetterItem } from '@components/Admin';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

const mockLetter = LetterFactory.build();
const editHref = `/admin/letter?letterId=${mockLetter.letterId}`;

describe('LetterItem Component', () => {
  it('Renders the title and a truncated version of the letter text.', () => {
    render(
      <LetterItem data={mockLetter} editHref={editHref} onDelete={jest.fn()} />,
    );

    expect(screen.getByText(mockLetter.title)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockLetter.text.slice(0, 25)}...`),
    ).toBeInTheDocument();
  });

  it('Links the edit control to the letter edit route.', () => {
    render(
      <LetterItem data={mockLetter} editHref={editHref} onDelete={jest.fn()} />,
    );

    expect(screen.getByTestId('edit-button')).toHaveAttribute('href', editHref);
  });

  it('Calls onDelete with the letterId when the delete button is clicked.', () => {
    const onDeleteMock = jest.fn();
    render(
      <LetterItem
        data={mockLetter}
        editHref={editHref}
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
      <LetterItem data={mockLetter} editHref={editHref} onDelete={jest.fn()} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
