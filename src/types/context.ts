import { CorrespondenceCard, CorrespondencesMap } from './correspondence';
import {
  CorrespondenceSearchItem,
  LetterSearchItem,
  RecipientSearchItem,
} from './search';

export type AuthContextType = {
  isLoggedIn: boolean;
  loading: boolean;
  signIn: (
    username: string,
    password: string,
  ) => Promise<{ isSignedIn: boolean }>;
  signOut: () => void;
  token: string | null;
  user: any | null;
};

export type CorrespondenceContextType = {
  correspondences: CorrespondenceCard[];
  correspondencesById: CorrespondencesMap;
  earliestSentAtDate: string;
};

export type DesktopMenuContextType = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

export type SearchContextType = {
  correspondences: CorrespondenceSearchItem[];
  recipients: RecipientSearchItem[];
  letters: LetterSearchItem[];
};
