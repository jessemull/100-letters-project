import React from 'react';
import { RecipientSearch } from '@components/Menu';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

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

const MockSearchSection = ({ data, onItemClick, renderItem }: any) => (
  <div>
    {data.map((item: any) => (
      <div
        key={item.correspondenceId}
        role="button"
        tabIndex={0}
        onClick={() => onItemClick(item)}
        onKeyDown={() => onItemClick(item)}
      >
        {renderItem(item)}
      </div>
    ))}
  </div>
);

MockSearchSection.displayName = 'MockSearchSection';

jest.mock('@components/Menu/SearchSection', () => ({
  __esModule: true,
  default: (props: any) => <MockSearchSection {...props} />,
}));

describe('RecipientSearch', () => {
  it('Calls router.push with correct query when a recipient is clicked.', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<RecipientSearch />);

    const item = screen.getByText('Lovelace, Ada');
    fireEvent.click(item);

    expect(pushMock).toHaveBeenCalledWith(
      '/correspondence?correspondenceId=abc123',
    );
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<RecipientSearch />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
