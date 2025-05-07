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
    dateUploaded: string;
    fileKey: string;
    imageURL: string;
    letterId: string;
    mimeType: LetterMimeType;
    signedUrl: string;
    thumbnailURL: string;
    uploadedBy: string;
    uuid: string;
    view: View;
  };
  message: string;
};

export type FileUploadResponse = {};
