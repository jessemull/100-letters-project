export type SearchType = 'all' | 'letters' | 'recipients' | 'correspondences';

export interface SearchOptions {
  type: 'all' | 'correspondences' | 'recipients' | 'letters';
  term: string;
  limit?: number;
  isExactCategory?: boolean;
}

export type CorrespondenceSearchItem = {
  correspondenceId: string;
  reason: {
    category: string;
  };
  title: string;
};

export type RecipientSearchItem = {
  correspondenceId: string;
  firstName: string;
  lastName: string;
  fullName: string;
};

export type LetterSearchItem = {
  correspondenceId: string;
  letterId: string;
  title: string;
};

export type SearchResult =
  | CorrespondenceSearchItem
  | RecipientSearchItem
  | LetterSearchItem;
