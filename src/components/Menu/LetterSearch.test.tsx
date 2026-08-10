import React from 'react';
import { LetterSearch } from '@components/Menu';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

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

const MockSearchSection = ({ data, getHref, onNavigate, renderItem }: any) => (
  <div>
    {data.map((item: any) => (
      <a
        key={item.letterId}
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

describe('LetterSearch Component', () => {
  it('Renders result links to the correspondence page.', () => {
    render(<LetterSearch />);

    expect(
      screen.getByRole('link', { name: 'Letter from Alan Turing' }),
    ).toHaveAttribute(
      'href',
      '/correspondence?correspondenceId=xyz789&letterId=lmn456',
    );
  });

  it('Calls on click callback when an item is clicked.', () => {
    const onClick = jest.fn();

    render(<LetterSearch onClick={onClick} />);

    fireEvent.click(screen.getByText('Letter from Alan Turing'));
    expect(onClick).toHaveBeenCalled();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<LetterSearch />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
