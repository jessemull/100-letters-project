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

export enum LetterMimeType {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  GIF = 'image/gif',
}

export enum View {
  ENVELOPE_FRONT = 'ENVELOPE_FRONT',
  ENVELOPE_BACK = 'ENVELOPE_BACK',
  LETTER_FRONT = 'LETTER_FRONT',
  LETTER_BACK = 'LETTER_BACK',
}

export type LetterImage = {
  caption?: string;
  dateUploaded?: string;
  id: string;
  mimeType?: LetterMimeType;
  sizeInBytes?: number;
  uploadedBy?: string;
  url: string;
  view: View;
};

export interface Letter {
  correspondenceId: string;
  description?: string;
  imageURLs: LetterImage[];
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
  imageURLs: LetterImage[];
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
  imageURLs: LetterImage[];
  letterId: string;
  method: LetterMethod;
  receivedAt?: string;
  sentAt?: string;
  status: Status;
  text: string;
  title: string;
  type: LetterType;
};

export type GetLettersResponse = {
  data: Letter[];
  lastEvaluatedKey: string;
};

export type GetLetterByIdResponse = {
  data: Letter;
};

export type LetterFormResponse = {
  data: Letter;
  message: string;
};

export type DeleteLetterParams = {
  letterId: string;
  correspondenceId?: string;
};

export type DeleteLetterResponse = {
  data: {
    letterId: string;
  };
  message: string;
};
