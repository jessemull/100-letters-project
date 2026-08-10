import React from 'react';
import { RecipientSearch } from '@components/Menu';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@hooks/useSearch', () => ({
  useSearch: () => [
    {
      correspondenceId: 'abc123',
      firstName: 'Ada',
      lastName: 'Lovelace',
    },
  ],
}));

jest.mock('@contexts/SearchProvider', () => ({
  useSearchData: () => ({
    recipients: [
      {
        correspondenceId: 'abc123',
        firstName: 'Ada',
        lastName: 'Lovelace',
      },
    ],
  }),
}));

const MockSearchSection = ({ data, getHref, onNavigate, renderItem }: any) => (
  <div>
    {data.map((item: any) => (
      <a
        key={item.correspondenceId}
        href={getHref(item)}
        onClick={() => onNavigate?.()}
      >
        {renderItem(item)}
      </a>
    ))}
  </div>
);

MockSearchSection.displayName = 'MockSearchSection';

jest.mock('@components/Menu/SearchSection', () => ({
  __esModule: true,
  default: (props: any) => <MockSearchSection {...props} />,
}));

describe('RecipientSearch Component', () => {
  it('Renders result links to the correspondence page.', () => {
    render(<RecipientSearch />);

    expect(screen.getByRole('link', { name: 'Lovelace, Ada' })).toHaveAttribute(
      'href',
      '/correspondence?correspondenceId=abc123',
    );
  });

  it('Calls on click callback when an item is clicked.', () => {
    const onClick = jest.fn();

    render(<RecipientSearch onClick={onClick} />);

    fireEvent.click(screen.getByText('Lovelace, Ada'));
    expect(onClick).toHaveBeenCalled();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<RecipientSearch />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
