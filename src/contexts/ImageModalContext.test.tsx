import React from 'react';
import {
  ImageModalContext,
  ImageModalProvider,
  useImageModal,
} from './ImageModalContext';
import { render, screen, fireEvent } from '@testing-library/react';

const TestComponent = ({ alt }: { alt?: string }) => {
  const { showImage, hideImage } = useImageModal();

  return (
    <div>
      <button onClick={() => showImage('/test.jpg', alt)}>Show</button>
      <button onClick={hideImage}>Hide</button>
    </div>
  );
};

describe('ImageModalProvider Component', () => {
  it('does not render modal by default', () => {
    render(
      <ImageModalProvider>
        <TestComponent alt="A test image" />
      </ImageModalProvider>,
    );

    expect(screen.queryByAltText('A test image')).not.toBeInTheDocument();
  });

  it('Shows modal with image and alt text when showImage is called.', () => {
    render(
      <ImageModalProvider>
        <TestComponent alt="A test image" />
      </ImageModalProvider>,
    );

    fireEvent.click(screen.getByText('Show'));

    expect(screen.getByAltText('A test image')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('Shows modal with image and default alt text when showImage is called.', () => {
    render(
      <ImageModalProvider>
        <TestComponent />
      </ImageModalProvider>,
    );

    fireEvent.click(screen.getByText('Show'));

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('Hides modal when hideImage is called.', () => {
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

  it('Throws error when hook is used outside provider.', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const BrokenComponent = () => {
      useImageModal();
      return null;
    };

    expect(() => render(<BrokenComponent />)).toThrow(
      'useImageModal must be used within an ImageModalProvider',
    );

    consoleError.mockRestore();
  });

  it('Provides default values.', () => {
    expect(ImageModalContext).toBeDefined();
  });
});
