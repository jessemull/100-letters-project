import LazyRecaptcha from './LazyRecaptcha';
import { axe } from 'jest-axe';
import { render, screen } from '@testing-library/react';

jest.mock('next/dynamic', () => {
  return () => {
    const Mock = () => <div data-testid="lazy-recaptcha">recaptcha</div>;
    Mock.displayName = 'LazyRecaptchaMock';
    return Mock;
  };
});

describe('LazyRecaptcha', () => {
  it('Renders the dynamically imported recaptcha wrapper.', () => {
    render(<LazyRecaptcha sitekey="test-site-key" />);
    expect(screen.getByTestId('lazy-recaptcha')).toBeInTheDocument();
  });

  it('Has no accessibility violations.', async () => {
    const { container } = render(<LazyRecaptcha sitekey="test-site-key" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
