import React from 'react';
import RecipientItem from './RecipientItem';
import { RecipientFactory } from '@factories/recipient';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

describe('RecipientItem Commponent', () => {
  const mockRecipient = RecipientFactory.build();
  const editHref = `/admin/recipient?recipientId=${mockRecipient.recipientId}`;
  const onDeleteMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders recipient name and organization.', () => {
    render(
      <RecipientItem
        data={mockRecipient}
        editHref={editHref}
        onDelete={onDeleteMock}
      />,
    );

    expect(
      screen.getByText(`${mockRecipient.lastName}, ${mockRecipient.firstName}`),
    ).toBeInTheDocument();
  });

  it('Links the edit control to the recipient edit route.', () => {
    render(
      <RecipientItem
        data={mockRecipient}
        editHref={editHref}
        onDelete={onDeleteMock}
      />,
    );

    expect(screen.getByTestId('edit-button')).toHaveAttribute('href', editHref);
  });

  it('Calls onDelete with correct recipientId when delete button is clicked.', () => {
    render(
      <RecipientItem
        data={mockRecipient}
        editHref={editHref}
        onDelete={onDeleteMock}
      />,
    );

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    expect(onDeleteMock).toHaveBeenCalledWith(mockRecipient.recipientId);
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  it('Has a card container with expected styling.', () => {
    render(
      <RecipientItem
        data={mockRecipient}
        editHref={editHref}
        onDelete={onDeleteMock}
      />,
    );

    const container = screen.getByTestId('card-edit-button');
    expect(container).toHaveClass('p-4');
    expect(container).not.toHaveClass('cursor-pointer');
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <RecipientItem
        data={mockRecipient}
        editHref={editHref}
        onDelete={onDeleteMock}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
