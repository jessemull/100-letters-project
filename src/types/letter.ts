import { Status } from './correspondence';

export enum LetterMethod {
  TYPED = 'TYPED',
  HANDWRITTEN = 'HANDWRITTEN',
  PRINTED = 'PRINTED',
  DIGITAL = 'DIGITAL',
  OTHER = 'OTHER',
}

export enum LetterType {
  MAIL = 'MAIL',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  OTHER = 'OTHER',
}

export interface Letter {
  correspondenceId: string;
  description?: string;
  imageURLs: string[];
  letterId: string;
  method: LetterMethod;
  receivedAt?: string;
  sentAt?: string;
  status: Status;
  text: string;
  title: string;
  type: LetterType;
}

export type LetterCreateInput = {
  correspondenceId: string;
  description?: string;
  imageURLs: string[];
  method: LetterMethod;
  receivedAt?: string;
  sentAt?: string;
  status: Status;
  text: string;
  title: string;
  type: LetterType;
};

export type LetterUpdateInput = {
  description?: string;
  imageURLs: string[];
  letterId: string;
  method: LetterMethod;
  receivedAt?: string;
  sentAt?: string;
  status: Status;
  text: string;
  title: string;
  type: LetterType;
};

export interface GetLettersResponse {
  data: Letter[];
  lastEvaluatedKey: string;
}
