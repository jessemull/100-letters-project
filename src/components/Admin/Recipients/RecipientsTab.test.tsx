import React from 'react';
import { RecipientFactory } from '@factories/recipient';
import { RecipientsTab } from '@components/Admin';
import { render, screen } from '@testing-library/react';
import { useSWRQuery } from '@hooks/useSWRQuery';

jest.mock('@hooks/useSWRQuery');

const mockRecipient = RecipientFactory.build();

describe('RecipientsTab', () => {
  it('Shows the Progress component when loading.', () => {
    (useSWRQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<RecipientsTab token="test-token" />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('Renders a list of recipients when data is available.', () => {
    (useSWRQuery as jest.Mock).mockReturnValue({
      data: { data: [mockRecipient] },
      isLoading: false,
    });

    render(<RecipientsTab token="test-token" />);

    expect(
      screen.getByText(`${mockRecipient.firstName} ${mockRecipient.lastName}`),
    ).toBeInTheDocument();

    if (mockRecipient.organization) {
      expect(screen.getByText(mockRecipient.organization)).toBeInTheDocument();
    }
  });

  it('Renders an empty state message when no recipients are found.', () => {
    (useSWRQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
    });

    render(<RecipientsTab token="test-token" />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });
});
