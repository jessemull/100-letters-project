import CorrespondenceItem from './CorrespondenceItem';
import React from 'react';
import { CorrespondenceFactory } from '../factories';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

const mockCorrespondence = CorrespondenceFactory.build();

describe('CorrespondenceItem', () => {
  it('Renders title and recipient name.', () => {
    render(<CorrespondenceItem data={mockCorrespondence} />);
    expect(screen.getByText(mockCorrespondence.title)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockCorrespondence.recipient.firstName} ${mockCorrespondence.recipient.lastName}`,
      ),
    ).toBeInTheDocument();
  });

  it('Triggers onEdit when clicked.', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<CorrespondenceItem data={mockCorrespondence} />);
    const item = screen.getByRole('button');
    fireEvent.click(item);
    expect(consoleSpy).toHaveBeenCalledWith(mockCorrespondence);
    consoleSpy.mockRestore();
  });

  it('Triggers onEdit when Enter is pressed.', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<CorrespondenceItem data={mockCorrespondence} />);
    const item = screen.getByRole('button');
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(consoleSpy).toHaveBeenCalledWith(mockCorrespondence);
    consoleSpy.mockRestore();
  });

  it('Triggers onEdit when Space is pressed.', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<CorrespondenceItem data={mockCorrespondence} />);
    const item = screen.getByRole('button');
    fireEvent.keyDown(item, { key: ' ' });
    expect(consoleSpy).toHaveBeenCalledWith(mockCorrespondence);
    consoleSpy.mockRestore();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <CorrespondenceItem data={mockCorrespondence} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
