import React from 'react';
import { CorrespondenceFactory } from '@factories/correspondence';
import { CorrespondenceItem } from '@components/Admin';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

const mockCorrespondence = CorrespondenceFactory.build();

describe('CorrespondenceItem Component', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('Renders the title and recipient name.', () => {
    render(
      <CorrespondenceItem
        data={mockCorrespondence}
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.getByText(mockCorrespondence.title)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockCorrespondence.recipient.firstName} ${mockCorrespondence.recipient.lastName}`,
      ),
    ).toBeInTheDocument();
  });

  it('Calls onEdit when edit button is clicked.', () => {
    const onEdit = jest.fn();
    render(
      <CorrespondenceItem
        data={mockCorrespondence}
        onDelete={() => {}}
        onEdit={onEdit}
      />,
    );
    fireEvent.click(screen.getByTestId('edit-button'));
    expect(onEdit).toHaveBeenCalled();
  });

  it('Calls onDelete when delete button is clicked.', () => {
    const onDelete = jest.fn();
    render(
      <CorrespondenceItem
        data={mockCorrespondence}
        onDelete={onDelete}
        onEdit={() => {}}
      />,
    );
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalled();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <CorrespondenceItem
        data={mockCorrespondence}
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
