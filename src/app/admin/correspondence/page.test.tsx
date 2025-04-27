import CorrespondencePage from './page';
import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@components/Admin/Correspondences/CorrespondenceForm', () => {
  const MockForm = () => <div data-testid="correspondence-form" />;
  MockForm.displayName = 'MockCorrespondenceForm';
  return MockForm;
});

jest.mock('../../page.layout', () => {
  const MockLayout = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-layout">{children}</div>
  );
  MockLayout.displayName = 'MockPageLayout';
  return MockLayout;
});

describe('CorrespondencePage', () => {
  it('Renders the page layout.', () => {
    render(<CorrespondencePage />);
    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
  });

  it('Renders the correspondence form.', async () => {
    render(<CorrespondencePage />);
    expect(screen.getByTestId('correspondence-form')).toBeInTheDocument();
  });
});
