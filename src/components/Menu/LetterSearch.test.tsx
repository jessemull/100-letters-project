import React from 'react';
import { LetterSearch } from '@components/Menu';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@hooks/useSearch', () => ({
  useSearch: () => [
    {
      correspondenceId: 'xyz789',
      letterId: 'lmn456',
      title: 'Letter from Alan Turing',
    },
  ],
}));

jest.mock('@contexts/SearchProvider', () => ({
  useSearchData: () => ({
    letters: [
      {
        correspondenceId: 'xyz789',
        letterId: 'lmn456',
        title: 'Letter from Alan Turing',
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

describe('LetterSearch Component', () => {
  it('Calls router.push with correct query when an item is clicked.', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<LetterSearch />);

    const item = screen.getByText('Letter from Alan Turing');
    fireEvent.click(item);

    expect(pushMock).toHaveBeenCalledWith(
      '/correspondence?correspondenceId=xyz789&letterId=lmn456',
    );
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<LetterSearch />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
