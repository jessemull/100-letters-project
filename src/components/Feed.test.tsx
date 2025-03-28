import Feed from './Feed';
import { CorrespondenceContext } from '../contexts';
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';

describe('Feed Component', () => {
  it('Has no accessibility errors.', async () => {
    const { container } = render(<Feed />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
