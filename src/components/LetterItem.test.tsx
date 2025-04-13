import LetterItem from './LetterItem';
import React from 'react';
import { LetterFactory } from '../factories';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

const mockLetter = LetterFactory.build();

describe('LetterItem', () => {
  it('Renders title and text snippet.', () => {
    render(<LetterItem data={mockLetter} />);
    expect(screen.getByText(mockLetter.title)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockLetter.text.slice(0, 100)}...`),
    ).toBeInTheDocument();
  });

  it('Triggers onEdit when clicked.', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<LetterItem data={mockLetter} />);
    const item = screen.getByRole('button');
    fireEvent.click(item);
    expect(consoleSpy).toHaveBeenCalledWith(mockLetter);
    consoleSpy.mockRestore();
  });

  it('Triggers onEdit when Enter is pressed.', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<LetterItem data={mockLetter} />);
    const item = screen.getByRole('button');
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(consoleSpy).toHaveBeenCalledWith(mockLetter);
    consoleSpy.mockRestore();
  });

  it('Triggers onEdit when Space is pressed.', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<LetterItem data={mockLetter} />);
    const item = screen.getByRole('button');
    fireEvent.keyDown(item, { key: ' ' });
    expect(consoleSpy).toHaveBeenCalledWith(mockLetter);
    consoleSpy.mockRestore();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<LetterItem data={mockLetter} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
