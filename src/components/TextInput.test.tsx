import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from './TextInput';
import { Eye, EyeOff } from 'lucide-react';

describe('TextInput Component', () => {
  const handleChangeMock = jest.fn();
  const handleIconStartClickMock = jest.fn();
  const handleIconEndClickMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
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

  it('renders without icons if no IconStart or IconEnd is provided', () => {
    render(
      <TextInput
        id="username"
        onChange={handleChangeMock}
        placeholder="Enter your username"
        type="text"
        value="testuser"
      />,
    );

    // Ensure no icons are rendered
    expect(screen.queryByTestId('password-text-input-icon-start')).toBeNull();
    expect(screen.queryByTestId('password-text-input-icon-end')).toBeNull();
  });

  it('triggers onIconStartClick when IconStart is clicked', () => {
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

    // Simulate icon click
    fireEvent.click(iconStart);

    // Check if the click handler was called
    expect(handleIconStartClickMock).toHaveBeenCalledTimes(1);
  });

  it('triggers onIconEndClick when IconEnd is clicked', () => {
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

    // Simulate icon click
    fireEvent.click(iconEnd);

    // Check if the click handler was called
    expect(handleIconEndClickMock).toHaveBeenCalledTimes(1);
  });

  it('renders errors correctly when errors prop is passed', () => {
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

    // Check if errors are displayed
    const errorList = screen.getByRole('list');
    expect(errorList).toBeInTheDocument();
    expect(screen.getByText('Invalid username')).toBeInTheDocument();
    expect(screen.getByText('Username too short')).toBeInTheDocument();
  });

  it('does not render error list when no errors are passed', () => {
    render(
      <TextInput
        id="username"
        onChange={handleChangeMock}
        placeholder="Enter your username"
        type="text"
        value="testuser"
      />,
    );

    // Ensure no errors are rendered
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('renders errors correctly when a single error string is passed', () => {
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

    // Check if the error is displayed
    expect(screen.getByText('Invalid username')).toBeInTheDocument();
  });

  it('applies correct padding classes when IconStart or IconEnd are provided', () => {
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

    // Check if padding classes are applied for the icons
    expect(inputElement).toHaveClass('pl-12');
    expect(inputElement).toHaveClass('pr-12');
  });
});
