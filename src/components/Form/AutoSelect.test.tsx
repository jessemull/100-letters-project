import React from 'react';
import { AutoSelect } from '@components/Form';
import { axe } from 'jest-axe';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

const onChangeMock = jest.fn();

describe('AutoSelect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with required props only', () => {
    render(
      <AutoSelect
        id="test"
        value="banana"
        onChange={onChangeMock}
        options={options}
      />,
    );
    expect(screen.getByDisplayValue('Banana')).toBeInTheDocument();
  });

  it('renders a placeholder if provided', () => {
    render(
      <AutoSelect
        id="test"
        value=""
        onChange={onChangeMock}
        options={options}
        placeholder="Select a fruit"
      />,
    );
    expect(screen.getByPlaceholderText('Select a fruit')).toBeInTheDocument();
  });

  it('renders a label if provided', () => {
    render(
      <AutoSelect
        id="test"
        label="Choose a fruit"
        value=""
        onChange={onChangeMock}
        options={options}
      />,
    );
    expect(screen.getByText('Choose a fruit')).toBeInTheDocument();
  });

  it('renders single string error', () => {
    render(
      <AutoSelect
        id="test"
        value=""
        onChange={onChangeMock}
        options={options}
        errors="Something went wrong"
      />,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders multiple error strings', () => {
    const errors = ['Error one', 'Error two'];
    render(
      <AutoSelect
        id="test"
        value=""
        onChange={onChangeMock}
        options={options}
        errors={errors}
      />,
    );
    errors.forEach((error) =>
      expect(screen.getByText(error)).toBeInTheDocument(),
    );
  });

  it('does not render error list when errors is undefined', () => {
    render(
      <AutoSelect
        id="test"
        value=""
        onChange={onChangeMock}
        options={options}
      />,
    );
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('shows options on focus and hides them on blur', async () => {
    render(
      <AutoSelect
        id="test"
        value=""
        onChange={onChangeMock}
        options={options}
      />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();

    fireEvent.blur(input);
    await waitFor(() => expect(screen.queryByText('Apple')).toEqual(null));
  });

  it('filters options based on input value', () => {
    render(
      <AutoSelect
        id="test"
        value=""
        onChange={onChangeMock}
        options={options}
      />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Ap' } });

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });

  it('selects an option when clicked', () => {
    render(
      <AutoSelect
        id="test"
        value=""
        onChange={onChangeMock}
        options={options}
      />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.mouseDown(screen.getByText('Cherry'));

    expect(onChangeMock).toHaveBeenCalledWith('cherry');
    expect(input).toHaveValue('Cherry');
  });

  it('shows loading spinner when loading is true', () => {
    render(
      <AutoSelect
        id="test"
        value=""
        onChange={onChangeMock}
        options={options}
        loading
      />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('does not call onChange if clicked option is not found', () => {
    render(
      <AutoSelect id="test" value="" onChange={onChangeMock} options={[]} />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.mouseDown(input); // should not trigger onChange
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <AutoSelect
        id="test"
        value=""
        onChange={onChangeMock}
        options={options}
        placeholder="Pick a fruit"
        label="Fruits"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
