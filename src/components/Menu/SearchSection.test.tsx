import SearchSection from './SearchSection';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

interface Item {
  name: string;
}

describe('SearchSection Component', () => {
  const title = 'Test Items';

  const allData: Item[] = Array.from({ length: 25 }, (_, i) => ({
    name: `Item ${i + 1}`,
  }));

  const results: Item[] = [{ name: 'Result 1' }, { name: 'Result 2' }];

  const renderItem = (item: Item) => (
    <span data-testid="list-item">{item.name}</span>
  );

  const setTerm = jest.fn();

  beforeEach(() => {
    setTerm.mockClear();
  });

  it('Renders with default open state and shows limited items.', () => {
    render(
      <SearchSection
        title={title}
        data={allData}
        onItemClick={jest.fn()}
        results={[]}
        renderItem={renderItem}
        setTerm={setTerm}
        term=""
      />,
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(`Search ${title.toLowerCase()}...`),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('list-item')).toHaveLength(10);
    expect(screen.getByText('Show More')).toBeInTheDocument();
  });

  it('Expands to show more items when Show More is clicked.', () => {
    render(
      <SearchSection
        title={title}
        data={allData}
        onItemClick={jest.fn()}
        results={[]}
        renderItem={renderItem}
        setTerm={setTerm}
        term=""
      />,
    );

    fireEvent.click(screen.getByText('Show More'));
    expect(screen.getAllByTestId('list-item')).toHaveLength(20);
  });

  it('Search input updates and resets shown items.', () => {
    render(
      <SearchSection
        title={title}
        data={allData}
        onItemClick={jest.fn()}
        results={results}
        renderItem={renderItem}
        setTerm={setTerm}
        term="search"
      />,
    );

    const input = screen.getByPlaceholderText(
      `Search ${title.toLowerCase()}...`,
    );
    fireEvent.change(input, { target: { value: 'new term' } });
    expect(setTerm).toHaveBeenCalledWith('new term');
  });

  it('Toggles open/closed state.', () => {
    render(
      <SearchSection
        title={title}
        data={allData}
        onItemClick={jest.fn()}
        results={[]}
        renderItem={renderItem}
        setTerm={setTerm}
        term=""
      />,
    );

    fireEvent.click(screen.getByText(title));
    expect(
      screen.queryByPlaceholderText(`Search ${title.toLowerCase()}...`),
    ).not.toBeInTheDocument();
  });

  it('Does not render search input or list when isOpen is false.', () => {
    render(
      <SearchSection
        title={title}
        data={allData}
        onItemClick={jest.fn()}
        results={[]}
        renderItem={renderItem}
        setTerm={setTerm}
        term=""
      />,
    );

    fireEvent.click(screen.getByText(title));

    expect(
      screen.queryByPlaceholderText(`Search ${title.toLowerCase()}...`),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('list-item')).not.toBeInTheDocument();
    expect(screen.queryByText('Show More')).not.toBeInTheDocument();
  });

  it('Clear term when clear button is clicked.', () => {
    render(
      <SearchSection
        title={title}
        data={allData}
        onItemClick={jest.fn()}
        results={results}
        renderItem={renderItem}
        setTerm={setTerm}
        term="something"
      />,
    );

    const buttons = screen.getAllByRole('button');
    const clearBtn = buttons.find((btn) => btn.textContent === '');

    fireEvent.click(clearBtn as HTMLElement);

    expect(setTerm).toHaveBeenCalledWith('');
  });

  it('Calls onItemClick when an item is clicked.', () => {
    const onItemClick = jest.fn();

    render(
      <SearchSection
        title={title}
        data={allData}
        results={results}
        renderItem={renderItem}
        setTerm={setTerm}
        term=""
        onItemClick={onItemClick}
      />,
    );

    const itemButtons = screen.getAllByRole('button', { name: /Item \d+/i });
    fireEvent.click(itemButtons[0]);

    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledWith(allData[0]);
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <SearchSection
        title={title}
        data={allData}
        onItemClick={jest.fn()}
        results={[]}
        renderItem={renderItem}
        setTerm={setTerm}
        term=""
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
