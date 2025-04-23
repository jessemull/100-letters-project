import React from 'react';
import { LetterFactory } from '@factories/letter';
import { LetterItem } from '@components/Admin';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

const mockLetter = LetterFactory.build();

describe('LetterItem', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('Renders the title and a truncated version of the letter text.', () => {
    render(<LetterItem data={mockLetter} />);
    expect(screen.getByText(mockLetter.title)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockLetter.text.slice(0, 25)}...`),
    ).toBeInTheDocument();
  });

  it('Calls onEdit when edit button is clicked.', () => {
    render(<LetterItem data={mockLetter} />);
    fireEvent.click(screen.getByTestId('edit-button'));
    expect(consoleSpy).toHaveBeenCalledWith('onEdit', mockLetter);
  });

  it('Calls onDelete when delete button is clicked.', () => {
    render(<LetterItem data={mockLetter} />);
    const deleteButton = screen.getByLabelText('Delete');
    fireEvent.click(deleteButton);
    expect(consoleSpy).toHaveBeenCalledWith('onDelete', mockLetter);
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<LetterItem data={mockLetter} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
