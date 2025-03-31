import TextInput from './TextInput';
import { Eye, EyeOff } from 'lucide-react';
import { render, screen, fireEvent } from '@testing-library/react';

describe('TextInput Component', () => {
  const handleChangeMock = jest.fn();
  const handleIconStartClickMock = jest.fn();
  const handleIconEndClickMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders correctly with all props.', () => {
    render(
      <TextInput
        IconStart={Eye}
        IconEnd={EyeOff}
        id="username"
        onChange={handleChangeMock}
        placeholder="Enter your username"
        type="text"
        value="testuser"
      />,
    );

    // Check if the input element exists
    const inputElement = screen.getByPlaceholderText('Enter your username');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('testuser');

    // Check if the icons are rendered
    const iconStart = screen.getByTestId('password-text-input-icon-start');
    const iconEnd = screen.getByTestId('password-text-input-icon-end');
    expect(iconStart).toBeInTheDocument();
    expect(iconEnd).toBeInTheDocument();
  });

  it('Renders without icons if no IconStart or IconEnd is provided.', () => {
    render(
      <TextInput
        id="username"
        onChange={handleChangeMock}
        placeholder="Enter your username"
        type="text"
        value="testuser"
      />,
    );

    expect(screen.queryByTestId('password-text-input-icon-start')).toBeNull();
    expect(screen.queryByTestId('password-text-input-icon-end')).toBeNull();
  });

  it('Triggers onIconStartClick when IconStart is clicked.', () => {
    render(
      <TextInput
        IconStart={Eye}
        id="password"
        onChange={handleChangeMock}
        placeholder="Enter your password"
        type="password"
        value="password123"
        onIconStartClick={handleIconStartClickMock}
      />,
    );

    const iconStart = screen.getByTestId('password-text-input-icon-start');

    fireEvent.click(iconStart);

    expect(handleIconStartClickMock).toHaveBeenCalledTimes(1);
  });

  it('Triggers onIconEndClick when IconEnd is clicked.', () => {
    render(
      <TextInput
        IconEnd={EyeOff}
        id="password"
        onChange={handleChangeMock}
        placeholder="Enter your password"
        type="password"
        value="password123"
        onIconEndClick={handleIconEndClickMock}
      />,
    );

    const iconEnd = screen.getByTestId('password-text-input-icon-end');

    fireEvent.click(iconEnd);

    expect(handleIconEndClickMock).toHaveBeenCalledTimes(1);
  });

  it('Renders errors correctly when errors prop is passed.', () => {
    render(
      <TextInput
        id="username"
        onChange={handleChangeMock}
        placeholder="Enter your username"
        type="text"
        value="testuser"
        errors={['Invalid username', 'Username too short']}
      />,
    );

    const errorList = screen.getByRole('list');
    expect(errorList).toBeInTheDocument();
    expect(screen.getByText('Invalid username')).toBeInTheDocument();
    expect(screen.getByText('Username too short')).toBeInTheDocument();
  });

  it('Does not render error list when no errors are passed.', () => {
    render(
      <TextInput
        id="username"
        onChange={handleChangeMock}
        placeholder="Enter your username"
        type="text"
        value="testuser"
      />,
    );

    expect(screen.queryByRole('list')).toBeNull();
  });

  it('Renders errors correctly when a single error string is passed.', () => {
    render(
      <TextInput
        id="username"
        onChange={handleChangeMock}
        placeholder="Enter your username"
        type="text"
        value="testuser"
        errors="Invalid username"
      />,
    );

    expect(screen.getByText('Invalid username')).toBeInTheDocument();
  });

  it('Applies correct padding classes when IconStart or IconEnd are provided.', () => {
    render(
      <TextInput
        IconStart={Eye}
        IconEnd={EyeOff}
        id="username"
        onChange={handleChangeMock}
        placeholder="Enter your username"
        type="text"
        value="testuser"
      />,
    );

    const inputElement = screen.getByPlaceholderText('Enter your username');

    expect(inputElement).toHaveClass('pl-12');
    expect(inputElement).toHaveClass('pr-12');
  });
});
