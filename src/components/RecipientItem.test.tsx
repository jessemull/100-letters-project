import RecipientItem from './RecipientItem';
import React from 'react';
import { RecipientFactory } from '../factories';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

const mockRecipient = RecipientFactory.build();

describe('RecipientItem', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('Renders the recipient full name and organization.', () => {
    render(<RecipientItem data={mockRecipient} />);
    expect(
      screen.getByText(`${mockRecipient.firstName} ${mockRecipient.lastName}`),
    ).toBeInTheDocument();

    if (mockRecipient.organization) {
      expect(screen.getByText(mockRecipient.organization)).toBeInTheDocument();
    }
  });

  it('Calls onEdit when edit button is clicked.', () => {
    render(<RecipientItem data={mockRecipient} />);
    fireEvent.click(screen.getByTestId('edit-button'));
    expect(consoleSpy).toHaveBeenCalledWith('onEdit', mockRecipient);
  });

  it('Calls onDelete when delete button is clicked.', () => {
    render(<RecipientItem data={mockRecipient} />);
    const deleteButtons = screen.getAllByLabelText('Edit');
    fireEvent.click(deleteButtons[1]);
    expect(consoleSpy).toHaveBeenCalledWith('onDelete', mockRecipient);
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<RecipientItem data={mockRecipient} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
