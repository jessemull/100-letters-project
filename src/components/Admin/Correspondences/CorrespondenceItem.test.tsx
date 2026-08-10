import React from 'react';
import { CorrespondenceFactory } from '@factories/correspondence';
import { CorrespondenceItem } from '@components/Admin';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

const mockCorrespondence = CorrespondenceFactory.build();
const editHref = `/admin/correspondence?correspondenceId=${mockCorrespondence.correspondenceId}`;

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
        editHref={editHref}
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

  it('Links the edit control to the correspondence edit route.', () => {
    render(
      <CorrespondenceItem
        data={mockCorrespondence}
        editHref={editHref}
        onDelete={() => {}}
      />,
    );
    expect(screen.getByTestId('edit-button')).toHaveAttribute('href', editHref);
  });

  it('Calls onDelete when delete button is clicked.', () => {
    const onDelete = jest.fn();
    render(
      <CorrespondenceItem
        data={mockCorrespondence}
        editHref={editHref}
        onDelete={onDelete}
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
        editHref={editHref}
        onDelete={() => {}}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
