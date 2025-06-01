export type SearchType = 'all' | 'letters' | 'recipients' | 'correspondences';

export type SearchOptions = {
  type: SearchType;
  term: string;
  limit?: number;
};

export type CorrespondenceSearchItem = {
  correspondenceId: string;
  reason: {
    domain: string;
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
