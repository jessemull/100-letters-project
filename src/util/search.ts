import { Category } from '@ts-types/correspondence';
import { categoryDisplayNameMap } from '@constants/search';

export const getCategoryEnum = (displayName: string): Category | null => {
  return categoryDisplayNameMap[displayName] || null;
};
