import SearchSection from './SearchSection';
import { axe } from 'jest-axe';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

interface Item {
  id: string;
  name: string;
}

describe('SearchSection Component', () => {
  const title = 'Test Items';

  const allData: Item[] = Array.from({ length: 25 }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `Item ${i + 1}`,
  }));

  const results: Item[] = [
    { id: 'result-1', name: 'Result 1' },
    { id: 'result-2', name: 'Result 2' },
  ];

  const renderItem = (item: Item) => (
    <span data-testid="list-item">{item.name}</span>
  );

  const getHref = (item: Item) => `/items/${item.id}`;
  const getItemKey = (item: Item) => item.id;
  const setTerm = jest.fn();

  beforeEach(() => {
    setTerm.mockClear();
  });

  it('Renders with default open state and shows limited items.', () => {
    render(
      <SearchSection
        title={title}
        data={allData}
        getHref={getHref}
        getItemKey={getItemKey}
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
    expect(screen.getByText('Show more...')).toBeInTheDocument();
  });

  it('Expands to show more items when Show more... is clicked.', () => {
    render(
      <SearchSection
        title={title}
        data={allData}
        getHref={getHref}
        getItemKey={getItemKey}
        results={[]}
        renderItem={renderItem}
        setTerm={setTerm}
        term=""
      />,
    );

    fireEvent.click(screen.getByText('Show more...'));
    expect(screen.getAllByTestId('list-item')).toHaveLength(20);
  });

  it('Search input updates and resets shown items.', () => {
    render(
      <SearchSection
        title={title}
        data={allData}
        getHref={getHref}
        getItemKey={getItemKey}
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

  it('Toggles open/closed state.', async () => {
    render(
      <SearchSection
        title={title}
        data={allData}
        getHref={getHref}
        getItemKey={getItemKey}
        results={[]}
        renderItem={renderItem}
        setTerm={setTerm}
        term=""
      />,
    );

    fireEvent.click(screen.getByText(title));
    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText(`Search ${title.toLowerCase()}...`),
      ).not.toBeInTheDocument();
    });
  });

  it('Does not render search input or list when isOpen is false.', async () => {
    render(
      <SearchSection
        title={title}
        data={allData}
        getHref={getHref}
        getItemKey={getItemKey}
        results={[]}
        renderItem={renderItem}
        setTerm={setTerm}
        term=""
      />,
    );

    fireEvent.click(screen.getByText(title));

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText(`Search ${title.toLowerCase()}...`),
      ).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId('list-item')).not.toBeInTheDocument();
    expect(screen.queryByText('Show more...')).not.toBeInTheDocument();
  });

  it('Clear term when clear button is clicked.', () => {
    render(
      <SearchSection
        title={title}
        data={allData}
        getHref={getHref}
        getItemKey={getItemKey}
        results={results}
        renderItem={renderItem}
        setTerm={setTerm}
        term="something"
      />,
    );

    fireEvent.click(screen.getByLabelText(`Clear ${title} search`));

    expect(setTerm).toHaveBeenCalledWith('');
  });

  it('Renders result links and calls onNavigate when clicked.', () => {
    const onNavigate = jest.fn();

    render(
      <SearchSection
        title={title}
        data={allData}
        getHref={getHref}
        getItemKey={getItemKey}
        results={results}
        renderItem={renderItem}
        setTerm={setTerm}
        term=""
        onNavigate={onNavigate}
      />,
    );

    const firstLink = screen.getByRole('link', { name: 'Item 1' });
    expect(firstLink).toHaveAttribute('href', '/items/item-1');
    fireEvent.click(firstLink);

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(
      <SearchSection
        title={title}
        data={allData}
        getHref={getHref}
        getItemKey={getItemKey}
        results={[]}
        renderItem={renderItem}
        setTerm={setTerm}
        term=""
      />,
    );
    const resultsAxe = await axe(container);
    expect(resultsAxe).toHaveNoViolations();
  });
});
