export type SearchType = 'letters' | 'recipients' | 'correspondences';

export type SearchOptions = {
  type: SearchType;
  term: string;
  limit?: number;
};

export type CorrespondenceSearchItem = {
  correspondenceId: string;
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
  title: string;
};

export type SearchResult =
  | CorrespondenceSearchItem
  | RecipientSearchItem
  | LetterSearchItem;
