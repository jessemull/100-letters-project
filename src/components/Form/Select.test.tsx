import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Select } from '@components/Form';

const handleChangeMock = jest.fn();
const handleIconStartClick = jest.fn();
const handleIconEndClick = jest.fn();

const options = [
  { label: 'Option One', value: 'one' },
  { label: 'Option Two', value: 'two' },
];

const IconMock = ({ ...props }: any) => <svg {...props} />;

describe('Select', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders correctly with required props only.', () => {
    render(
      <Select
        id="example"
        value="one"
        onChange={handleChangeMock}
        options={options}
      />,
    );

    expect(screen.getByTestId('select-input')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Option One')).toBeInTheDocument();
  });

  it('Renders a placeholder if provided.', () => {
    render(
      <Select
        id="example"
        value=""
        onChange={handleChangeMock}
        options={options}
        placeholder="Select an option"
      />,
    );

    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('Calls onChange when a new option is selected.', () => {
    render(
      <Select
        id="example"
        value=""
        onChange={handleChangeMock}
        options={options}
        placeholder="Select an option"
      />,
    );

    const select = screen.getByTestId('select-input');
    fireEvent.change(select, { target: { value: 'one' } });

    expect(handleChangeMock).toHaveBeenCalledTimes(1);
  });

  it('Renders a label if provided.', () => {
    render(
      <Select
        id="example"
        value=""
        onChange={handleChangeMock}
        options={options}
        label="My Select"
      />,
    );

    expect(screen.getByText('My Select')).toBeInTheDocument();
  });

  it('Renders a single error string.', () => {
    render(
      <Select
        id="example"
        value=""
        onChange={handleChangeMock}
        options={options}
        errors="This field is required"
      />,
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('Renders multiple error strings.', () => {
    const errorMessages = ['Error 1', 'Error 2'];
    render(
      <Select
        id="example"
        value=""
        onChange={handleChangeMock}
        options={options}
        errors={errorMessages}
      />,
    );

    errorMessages.forEach((error) => {
      expect(screen.getByText(error)).toBeInTheDocument();
    });

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('Does not render errors when none are passed.', () => {
    render(
      <Select
        id="example"
        value=""
        onChange={handleChangeMock}
        options={options}
      />,
    );

    expect(screen.queryByRole('list')).toBeNull();
  });

  it('Renders and handles start and end icons.', () => {
    render(
      <Select
        id="example"
        value=""
        onChange={handleChangeMock}
        options={options}
        IconStart={IconMock}
        IconEnd={IconMock}
        onIconStartClick={handleIconStartClick}
        onIconEndClick={handleIconEndClick}
      />,
    );

    const iconStart = screen.getByTestId('example-select-icon-start');
    const iconEnd = screen.getByTestId('example-select-icon-end');

    fireEvent.click(iconStart);
    fireEvent.click(iconEnd);

    expect(iconStart).toBeInTheDocument();
    expect(iconEnd).toBeInTheDocument();
    expect(handleIconStartClick).toHaveBeenCalledTimes(1);
    expect(handleIconEndClick).toHaveBeenCalledTimes(1);
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <Select
        id="example"
        value=""
        onChange={handleChangeMock}
        options={options}
        placeholder="Select"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Applies correct padding when only IconStart is provided', () => {
    render(
      <Select
        id="start-only"
        value=""
        onChange={handleChangeMock}
        options={options}
        IconStart={IconMock}
      />,
    );

    const select = screen.getByTestId('select-input');
    expect(select.className).toMatch(/pl-12 pr-4/);
  });

  it('Applies correct padding when only IconEnd is provided', () => {
    render(
      <Select
        id="end-only"
        value=""
        onChange={handleChangeMock}
        options={options}
        IconEnd={IconMock}
      />,
    );

    const select = screen.getByTestId('select-input');
    expect(select.className).toMatch(/pl-4 pr-12/);
  });
});
