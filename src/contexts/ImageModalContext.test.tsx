import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ImageModalContext,
  ImageModalProvider,
  useImageModal,
} from './ImageModalContext'; // adjust path as needed

const TestComponent = ({ alt }: { alt?: string }) => {
  const { showImage, hideImage } = useImageModal();

  return (
    <div>
      <button onClick={() => showImage('/test.jpg', alt)}>Show</button>
      <button onClick={hideImage}>Hide</button>
    </div>
  );
};

describe('ImageModalProvider', () => {
  it('does not render modal by default', () => {
    render(
      <ImageModalProvider>
        <TestComponent alt="A test image" />
      </ImageModalProvider>,
    );

    expect(screen.queryByAltText('A test image')).not.toBeInTheDocument();
  });

  it('shows modal with image and alt text when showImage is called', () => {
    render(
      <ImageModalProvider>
        <TestComponent alt="A test image" />
      </ImageModalProvider>,
    );

    fireEvent.click(screen.getByText('Show'));

    expect(screen.getByAltText('A test image')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('shows modal with image and default alt text when showImage is called', () => {
    render(
      <ImageModalProvider>
        <TestComponent />
      </ImageModalProvider>,
    );

    fireEvent.click(screen.getByText('Show'));

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('hides modal when hideImage is called', () => {
    render(
      <ImageModalProvider>
        <TestComponent alt="A test image" />
      </ImageModalProvider>,
    );

    fireEvent.click(screen.getByText('Show'));
    expect(screen.getByAltText('A test image')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hide'));
    expect(screen.queryByAltText('A test image')).not.toBeInTheDocument();
  });

  it('throws error when hook is used outside provider', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const BrokenComponent = () => {
      useImageModal(); // should throw
      return null;
    };

    expect(() => render(<BrokenComponent />)).toThrow(
      'useImageModal must be used within an ImageModalProvider',
    );

    consoleError.mockRestore();
  });

  it('Provides default values', () => {
    expect(ImageModalContext).toBeDefined();
  });
});
