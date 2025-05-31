import { Letter } from './letter';

export interface UseDeleteUpload {
  letter: Letter;
  token: string | null;
}

export interface DeleteFile {
  imageId: string;
}
