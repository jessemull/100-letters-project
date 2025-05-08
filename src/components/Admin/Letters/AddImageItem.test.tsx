import AddImageItem from '@components/Admin/Letters/AddImageItem';
import React from 'react';
import { View } from '@ts-types/letter';
import { fireEvent, render, screen } from '@testing-library/react';

describe('AddImageItem', () => {
  const defaultProps = {
    caption: 'Test caption',
    disableUploadButton: false,
    file: new File(['test'], 'test-image.jpg', { type: 'image/jpeg' }),
    onSelectImage: jest.fn(),
    resetAddNewImage: jest.fn(),
    setCaption: jest.fn(),
    setView: jest.fn(),
    uploadImage: jest.fn(),
    view: 'front' as View,
    viewOptions: [
      { label: 'Front', value: 'front' as View },
      { label: 'Back', value: 'back' as View },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders all fields correctly.', () => {
    render(<AddImageItem {...defaultProps} />);

    expect(screen.getByText('Add New Image')).toBeInTheDocument();
    expect(screen.getByLabelText('Caption')).toHaveValue('Test caption');
    expect(screen.getByLabelText('View')).toHaveValue('front');
    expect(screen.getByText('Select Image +')).toBeInTheDocument();
    expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Upload Image +' }),
    ).toBeInTheDocument();
  });

  it('Handles caption change.', () => {
    render(<AddImageItem {...defaultProps} />);
    const captionInput = screen.getByLabelText('Caption');
    fireEvent.change(captionInput, { target: { value: 'New caption' } });
    expect(defaultProps.setCaption).toHaveBeenCalledWith('New caption');
  });

  it('Handles view selection change.', () => {
    render(<AddImageItem {...defaultProps} />);
    const select = screen.getByLabelText('View');
    fireEvent.change(select, { target: { value: 'back' } });
    expect(defaultProps.setView).toHaveBeenCalledWith('back');
  });

  it('Handles file selection.', () => {
    render(<AddImageItem {...defaultProps} />);
    const fileInput = screen.getByLabelText('Select Image +');
    const input =
      screen.getByTestId('file-input') ||
      screen.getByLabelText('Select Image +').closest('label')?.nextSibling;
    if (input) {
      fireEvent.change(input, {
        target: {
          files: [new File(['test'], 'new-image.png', { type: 'image/png' })],
        },
      });
      expect(defaultProps.onSelectImage).toHaveBeenCalled();
    } else {
      throw new Error('File input not found');
    }
  });

  it('Calls uploadImage on button click.', () => {
    render(<AddImageItem {...defaultProps} />);
    const uploadButton = screen.getByRole('button', { name: 'Upload Image +' });
    fireEvent.click(uploadButton);
    expect(defaultProps.uploadImage).toHaveBeenCalled();
  });

  it('Calls resetAddNewImage on X icon click.', () => {
    render(<AddImageItem {...defaultProps} />);
    const closeButton = screen.getByTestId('add-image-close-icon');
    fireEvent.click(closeButton);
    expect(defaultProps.resetAddNewImage).toHaveBeenCalled();
  });

  it('Chows placeholder when file is null.', () => {
    render(<AddImageItem {...{ ...defaultProps, file: null }} />);
    expect(screen.getByText('Select an image file...')).toBeInTheDocument();
  });

  it('Disables upload button when disableUploadButton is true.', () => {
    render(
      <AddImageItem {...{ ...defaultProps, disableUploadButton: true }} />,
    );
    expect(
      screen.getByRole('button', { name: 'Upload Image +' }),
    ).toBeDisabled();
  });
});
