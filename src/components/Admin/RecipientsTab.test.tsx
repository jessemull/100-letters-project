import React from 'react';
import { render, screen } from '@testing-library/react';
import RecipientsTab from './RecipientsTab'; // Adjust this path if needed
import { useSWRQuery } from '@hooks/useSWRQuery';
import { RecipientFactory } from '@factories/recipient';

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
