import LettersTab from './LettersTab';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSWRQuery } from '@hooks/useSWRQuery';

jest.mock('@hooks/useSWRQuery');

describe('LettersTab', () => {
  it('Displays the Progress component when loading.', () => {
    (useSWRQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<LettersTab token="mock-token" />);

    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });
});
