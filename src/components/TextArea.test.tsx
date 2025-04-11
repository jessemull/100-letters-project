import TextArea from './TextArea';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

describe('TextArea', () => {
  const handleChangeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders correctly with all required props.', () => {
    render(
      <TextArea
        id="message"
        value="Hello, world!"
        onChange={handleChangeMock}
        placeholder="Write your message"
      />,
    );

    const textareaElement = screen.getByPlaceholderText('Write your message');
    expect(textareaElement).toBeInTheDocument();
    expect(textareaElement).toHaveValue('Hello, world!');
  });

  it('Calls onChange when the user types.', () => {
    render(
      <TextArea
        id="message"
        value=""
        onChange={handleChangeMock}
        placeholder="Write your message"
      />,
    );

    const textareaElement = screen.getByPlaceholderText('Write your message');
    fireEvent.change(textareaElement, { target: { value: 'New input' } });

    expect(handleChangeMock).toHaveBeenCalledTimes(1);
  });

  it('Renders a single error string.', () => {
    render(
      <TextArea
        id="message"
        value=""
        onChange={handleChangeMock}
        placeholder="Write your message"
        errors="This field is required"
      />,
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('Renders multiple error strings.', () => {
    const errorMessages = ['Error one', 'Error two'];

    render(
      <TextArea
        id="message"
        value=""
        onChange={handleChangeMock}
        placeholder="Write your message"
        errors={errorMessages}
      />,
    );

    errorMessages.forEach((error) => {
      expect(screen.getByText(error)).toBeInTheDocument();
    });

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('Does not render errors when no errors are passed.', () => {
    render(
      <TextArea
        id="message"
        value=""
        onChange={handleChangeMock}
        placeholder="Write your message"
      />,
    );

    expect(screen.queryByRole('list')).toBeNull();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <TextArea
        id="message"
        value=""
        onChange={handleChangeMock}
        placeholder="Write your message"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
