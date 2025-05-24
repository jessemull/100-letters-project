import React from 'react';
import { CorrespondenceSearch } from '@components/Menu';
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
      title: 'Letter to Ada Lovelace',
    },
  ],
}));

jest.mock('@contexts/SearchProvider', () => ({
  useSearchData: () => ({
    correspondences: [
      {
        correspondenceId: 'abc123',
        title: 'Letter to Ada Lovelace',
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

describe('CorrespondenceSearch Component', () => {
  it('Calls router.push when an item is clicked.', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<CorrespondenceSearch />);

    const item = screen.getByText('Letter to Ada Lovelace');
    fireEvent.click(item);

    expect(pushMock).toHaveBeenCalledWith(
      '/correspondence?correspondenceId=abc123',
    );
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<CorrespondenceSearch />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
