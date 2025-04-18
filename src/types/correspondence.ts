import { Letter, LetterCreateInput, LetterUpdateInput } from './letter';
import {
  Recipient,
  RecipientCreateInput,
  RecipientUpdateInput,
} from './recipients';

export enum Impact {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export type Reason = {
  description: string;
  domain: string;
  impact: Impact;
};

export enum Status {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  RESPONDED = 'RESPONDED',
  SENT = 'SENT',
  UNSENT = 'UNSENT',
}

export type Correspondence = {
  correspondenceId: string;
  createdAt: string;
  letters: Letter[];
  recipient: Recipient;
  recipientId: string;
  reason: Reason;
  status: Status;
  title: string;
  updatedAt: string;
};

export type CorrespondenceCreateInput = {
  correspondence: {
    reason: Reason;
    status: Status;
    title: string;
  };
  recipient: RecipientCreateInput;
  letters: LetterCreateInput[];
};

export type CorrespondenceUpdateInput = {
  correspondence: {
    correspondenceId: string;
    reason: Reason;
    status: Status;
    title: string;
  };
  recipient: RecipientUpdateInput;
  letters: LetterUpdateInput[];
};

export type GetCorrespondencesResponse = {
  data: Correspondence[];
  lastEvaluatedKey: string;
};
