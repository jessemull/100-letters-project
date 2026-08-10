import { getCategoryEnum } from './search';
import { Category } from '@ts-types/correspondence';

describe('search utils', () => {
  it('maps display names to category enums', () => {
    expect(getCategoryEnum('Literature')).toBe(Category.LITERATURE);
    expect(getCategoryEnum('Unknown Category')).toBeNull();
  });
});
