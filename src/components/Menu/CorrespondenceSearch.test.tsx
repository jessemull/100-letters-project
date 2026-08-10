import React from 'react';
import { CorrespondenceSearch } from '@components/Menu';
import { axe } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';

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

describe('CorrespondenceSearch Component', () => {
  it('Renders result links to the correspondence page.', () => {
    render(<CorrespondenceSearch />);

    expect(
      screen.getByRole('link', { name: 'Letter to Ada Lovelace' }),
    ).toHaveAttribute('href', '/correspondence?correspondenceId=abc123');
  });

  it('Calls on click callback when an item is clicked.', () => {
    const onClick = jest.fn();

    render(<CorrespondenceSearch onClick={onClick} />);

    fireEvent.click(screen.getByText('Letter to Ada Lovelace'));
    expect(onClick).toHaveBeenCalled();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<CorrespondenceSearch />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
