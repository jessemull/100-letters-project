import RecipientItem from './RecipientItem';
import React from 'react';
import { RecipientFactory } from '../factories';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

const mockRecipient = RecipientFactory.build();

describe('RecipientItem', () => {
  it('Renders full name and organization.', () => {
    render(<RecipientItem data={mockRecipient} />);
    expect(
      screen.getByText(`${mockRecipient.firstName} ${mockRecipient.lastName}`),
    ).toBeInTheDocument();

    if (mockRecipient.organization) {
      expect(screen.getByText(mockRecipient.organization)).toBeInTheDocument();
    }
  });

  it('Triggers onClick when clicked.', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<RecipientItem data={mockRecipient} />);
    const item = screen.getByRole('button');
    fireEvent.click(item);
    expect(consoleSpy).toHaveBeenCalledWith(mockRecipient);
    consoleSpy.mockRestore();
  });

  it('Triggers onClick when Enter is pressed.', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<RecipientItem data={mockRecipient} />);
    const item = screen.getByRole('button');
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(consoleSpy).toHaveBeenCalledWith(mockRecipient);
    consoleSpy.mockRestore();
  });

  it('Triggers onClick when Space is pressed.', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<RecipientItem data={mockRecipient} />);
    const item = screen.getByRole('button');
    fireEvent.keyDown(item, { key: ' ' });
    expect(consoleSpy).toHaveBeenCalledWith(mockRecipient);
    consoleSpy.mockRestore();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<RecipientItem data={mockRecipient} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
