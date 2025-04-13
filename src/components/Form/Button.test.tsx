import { Button } from '@components/Form';
import { axe } from 'jest-axe';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Button Component', () => {
  it('Renders the button with text value.', () => {
    render(<Button id="submit" value="Submit" onClick={jest.fn()} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveValue('Submit');
  });

  it('Renders the button with loading state.', () => {
    render(
      <Button id="submit" value="Submit" loading={true} onClick={jest.fn()} />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveValue('');
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Does not allow click when button is disabled.', () => {
    const onClick = jest.fn();
    render(
      <Button id="submit" value="Submit" disabled={true} onClick={onClick} />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('Does not allow click when button is loading.', () => {
    const onClick = jest.fn();
    render(
      <Button id="submit" value="Submit" loading={true} onClick={onClick} />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('Calls onClick when button is enabled.', () => {
    const onClick = jest.fn();
    render(
      <Button
        id="submit"
        value="Submit"
        disabled={false}
        loading={false}
        onClick={onClick}
      />,
    );

    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Applies correct aria attributes based on loading true state.', () => {
    render(
      <Button id="submit" value="Submit" loading={true} onClick={jest.fn()} />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-label', 'Submitting...');
  });

  it('Applies correct aria attributes based on loading false state.', () => {
    render(
      <Button id="submit" value="Submit" loading={false} onClick={jest.fn()} />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'false');
    expect(button).toHaveAttribute('aria-label', 'Submit');
  });

  it('Applies correct styles when disabled.', () => {
    render(
      <Button id="submit" value="Submit" disabled={true} onClick={jest.fn()} />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-500 cursor-not-allowed');
  });

  it('Applies correct styles when not disabled.', () => {
    render(
      <Button
        id="submit"
        value="Submit"
        disabled={false}
        onClick={jest.fn()}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'bg-[#111827] hover:bg-[#293E6A] cursor-pointer',
    );
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <Button
        id="submit"
        value="Submit"
        disabled={false}
        onClick={jest.fn()}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
