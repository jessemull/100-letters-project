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
    /** Matches API `uploads` response (`api.yaml` / uploads handler). */
    thumbnailUrl: string;
    uploadedBy: string;
    uuid: string;
    view: View;
  };
  message: string;
};

export type FileUploadResponse = {};
