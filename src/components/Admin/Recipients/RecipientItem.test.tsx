import React from 'react';
import RecipientItem from './RecipientItem';
import { RecipientFactory } from '@factories/recipient';
import { render, screen, fireEvent } from '@testing-library/react';

describe('RecipientItem', () => {
  const mockRecipient = RecipientFactory.build();

  const onEditMock = jest.fn();
  const onDeleteMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders recipient name and organization', () => {
    render(
      <RecipientItem
        data={mockRecipient}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />,
    );

    expect(
      screen.getByText(`${mockRecipient.firstName} ${mockRecipient.lastName}`),
    ).toBeInTheDocument();
  });

  it('calls onEdit with correct recipientId when edit button is clicked', () => {
    render(
      <RecipientItem
        data={mockRecipient}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />,
    );

    fireEvent.click(screen.getByTestId('edit-button'));
    expect(onEditMock).toHaveBeenCalledWith(mockRecipient.recipientId);
    expect(onEditMock).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete with correct recipientId when delete button is clicked', () => {
    render(
      <RecipientItem
        data={mockRecipient}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />,
    );

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    expect(onDeleteMock).toHaveBeenCalledWith(mockRecipient.recipientId);
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  it('has a card container with expected styling', () => {
    render(
      <RecipientItem
        data={mockRecipient}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />,
    );

    const container = screen.getByTestId('card-edit-button');
    expect(container).toHaveClass('p-4');
    expect(container).toHaveClass('cursor-pointer');
  });
});
