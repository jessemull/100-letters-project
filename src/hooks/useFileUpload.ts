'use client';

import {
  FileUploadResponse,
  SignedURL,
  SignedURLResponse,
} from '@ts-types/uploads';
import {
  Letter,
  LetterFormResponse,
  LetterMimeType,
  View,
} from '@ts-types/letter';
import {
  correspondenceByIdLetterUpdate,
  correspondencesLetterUpdate,
  letterByIdUpdate,
  lettersUpdate,
} from '@util/cache';
import { useSWRMutation } from './useSWRMutation';
import { useState } from 'react';

export interface UseFileUpload {
  caption?: string;
  letter: Letter;
  token: string | null;
  view: View;
}

export function useFileUpload({ caption, letter, token, view }: UseFileUpload) {
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: getSignedURL } = useSWRMutation<SignedURL, SignedURLResponse>(
    {
      method: 'POST',
      path: '/uploads',
      token,
      onSuccess: () => {},
      onError: ({ error, status = '0' }) => {
        throw new Error(`${status}: ${error}`);
      },
    },
  );

  const { mutate: fileUpload } = useSWRMutation<Blob, FileUploadResponse>({
    method: 'PUT',
    path: '/uploads',
    onSuccess: () => {},
    onError: ({ error, status = '0' }) => {
      throw new Error(`${status}: ${error}`);
    },
  });

  const { mutate: updateLetter } = useSWRMutation<
    Partial<Letter>,
    LetterFormResponse
  >({
    cache: [
      { key: '/correspondence', onUpdate: correspondencesLetterUpdate },
      {
        key: `/correspondence/${letter.correspondenceId}`,
        onUpdate: correspondenceByIdLetterUpdate,
      },
      { key: '/letter', onUpdate: lettersUpdate },
      { key: `/letter/${letter.letterId}`, onUpdate: letterByIdUpdate },
    ],
    method: 'PUT',
    path: `/letter/${letter.letterId}`,
    token,
    onError: ({ error, status = '0' }) => {
      throw new Error(`${status}: ${error}`);
    },
  });

  const uploadFile = async ({ file }: { file: Blob }) => {
    setIsUploading(true);

    try {
      const signedUrlResponse = await getSignedURL({
        body: {
          correspondenceId: letter.correspondenceId,
          letterId: letter.letterId,
          mimeType: file.type as LetterMimeType,
          view,
        },
        headers: {
          'Content-Type': file.type,
        },
      });

      const {
        data: { imageURL, signedUrl, uuid },
      } = signedUrlResponse as SignedURLResponse;

      console.log(typeof file, file);

      await fileUpload({
        body: file,
        headers: {
          'Content-Type': file.type,
        },
        url: signedUrl,
      });

      const newImageURL = {
        caption,
        id: uuid,
        mimeType: file.type as LetterMimeType,
        sizeInBytes: file.size,
        url: imageURL,
        view,
      };

      const { message } = (await updateLetter({
        body: {
          ...letter,
          imageURLs: [...letter.imageURLs, newImageURL],
        },
      })) as LetterFormResponse;

      setIsUploading(false);

      return {
        message,
        imageURL: newImageURL,
      };
    } catch (error) {
      let message = 'File upload error!';

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }

      setError(message);
      setIsUploading(false);
    }
  };

  return {
    error,
    isUploading,
    uploadFile,
  };
}

export default useFileUpload;
