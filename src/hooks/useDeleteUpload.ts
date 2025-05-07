'use client';

import { FileUploadResponse } from '@ts-types/uploads';
import { Letter, LetterFormResponse, LetterImage } from '@ts-types/letter';
import {
  correspondenceByIdLetterUpdate,
  correspondencesLetterUpdate,
  letterByIdUpdate,
  lettersUpdate,
} from '@util/cache';
import { useSWRMutation } from './useSWRMutation';
import { useState } from 'react';
import { formatLetterDates } from '@util/letter';

export interface UseDeleteUpload {
  letter: Letter;
  token: string | null;
}

export interface DeleteFile {
  imageId: string;
}

export function useDeleteUpload({ letter, token }: UseDeleteUpload) {
  const [error, setError] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate: deleteUpload } = useSWRMutation<Blob, FileUploadResponse>({
    method: 'DELETE',
    token,
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

  const deleteFile = async ({ imageId }: DeleteFile) => {
    setIsDeleting(true);

    try {
      const imageToDelete = letter.imageURLs.find(
        (image) => image.id === imageId,
      ) as LetterImage;

      await deleteUpload({
        path: `/uploads?fileKey=${imageToDelete.fileKey}`,
      });

      const formatted = formatLetterDates(letter);

      const imageURLs = formatted.imageURLs.filter(
        (image) => image.id !== imageToDelete.id,
      );

      const { message } = (await updateLetter({
        body: {
          ...formatted,
          imageURLs,
        },
      })) as LetterFormResponse;

      setIsDeleting(false);

      return {
        message,
        imageURLs,
      };
    } catch (error) {
      let message = 'File upload error!';

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }

      setError(message);
      setIsDeleting(false);
    }
  };

  return {
    error,
    isDeleting,
    deleteFile,
  };
}

export default UseDeleteUpload;
