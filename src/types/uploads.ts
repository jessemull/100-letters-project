import { LetterMimeType, View } from './letter';

export type SignedURL = {
  correspondenceId: string;
  letterId: string;
  mimeType: LetterMimeType;
  view: View;
};

export type SignedURLResponse = {
  data: {
    correspondenceId: string;
    imageURL: string;
    letterId: string;
    mimeType: LetterMimeType;
    signedUrl: string;
    uuid: string;
    view: View;
  };
  message: string;
};

export type FileUploadResponse = {};
