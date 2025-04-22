import { ConfirmationModal } from '@components/Form';
import { axe } from 'jest-axe';
import { act, render, screen } from '@testing-library/react';

describe('ConfirmationModal Component', () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  it('Renders with default title when no title is provided', async () => {
    await act(() => {
      render(
        <ConfirmationModal
          isOpen={true}
          onClose={onCloseMock}
          onConfirm={onConfirmMock}
        />,
      );
    });

    act(() => {
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });
  });

  it('Has no accessibility violations', async () => {
    await act(async () => {
      const { container } = render(
        <ConfirmationModal
          isOpen={true}
          onClose={onCloseMock}
          onConfirm={onConfirmMock}
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
