import CorrespondenceItem from './CorrespondenceItem';
import React from 'react';
import { CorrespondenceFactory } from '../factories';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

const mockCorrespondence = CorrespondenceFactory.build();

describe('CorrespondenceItem', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('Renders the title and recipient name.', () => {
    render(<CorrespondenceItem data={mockCorrespondence} />);
    expect(screen.getByText(mockCorrespondence.title)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockCorrespondence.recipient.firstName} ${mockCorrespondence.recipient.lastName}`,
      ),
    ).toBeInTheDocument();
  });

  it('Calls onEdit when edit button is clicked.', () => {
    render(<CorrespondenceItem data={mockCorrespondence} />);
    fireEvent.click(screen.getByTestId('edit-button'));
    expect(consoleSpy).toHaveBeenCalledWith('onEdit', mockCorrespondence);
  });

  it('Calls onDelete when delete button is clicked.', () => {
    render(<CorrespondenceItem data={mockCorrespondence} />);
    const deleteButtons = screen.getAllByLabelText('Edit');
    fireEvent.click(deleteButtons[1]);
    expect(consoleSpy).toHaveBeenCalledWith('onDelete', mockCorrespondence);
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <CorrespondenceItem data={mockCorrespondence} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
