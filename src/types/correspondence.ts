import { Letter, LetterCreateInput, LetterUpdateInput } from './letter';
import {
  Address,
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
  createdAt?: string;
  letters: Letter[];
  recipient: Recipient;
  recipientId?: string;
  reason: Reason;
  status: Status;
  title: string;
  updatedAt?: string;
};

export type CorrespondenceUpdate = {
  correspondenceId?: string;
  createdAt?: string;
  letters: Letter[];
  recipient: {
    address: Address;
    description?: string;
    firstName: string;
    lastName: string;
    occupation?: string;
    organization?: string;
    recipientId?: string;
  };
  recipientId?: string;
  reason: Reason;
  status: Status;
  title: string;
  updatedAt?: string;
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

export type CorrespondenceResponse = {
  correspondence: Correspondence;
  letters: Letter[];
  recipient: Recipient;
};

export type GetCorrespondenceByIdResponse = {
  data: {
    correspondence: Correspondence;
    recipient: Recipient;
    letters: Letter[];
  };
};

export type CorrespondenceFormResponse = {
  data: Correspondence;
  message: string;
};

export type DeleteCorrespondenceResponse = {
  data: {
    correspondenceId: string;
    letterIds: string[];
    recipientId: string;
  };
  message: string;
};

export type CreateOrUpdateCorrespondenceInput = {
  correspondence: {
    correspondenceId?: string;
    reason: Reason;
    status: Status;
    title: string;
  };
  recipient: {
    address: Address;
    description?: string;
    firstName: string;
    lastName: string;
    occupation?: string;
    organization?: string;
    recipientId?: string;
  };
  letters: LetterUpdateInput[];
};

export type CorrespondencesMap = { [correspondenceId: string]: Correspondence };
