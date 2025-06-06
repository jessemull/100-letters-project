'use client';

import {
  FileUploadResponse,
  SignedURL,
  SignedURLResponse,
} from '@ts-types/uploads';
import { Letter, LetterFormResponse, LetterMimeType } from '@ts-types/letter';
import {
  correspondenceByIdLetterUpdate,
  correspondencesLetterUpdate,
  letterByIdUpdate,
  lettersUpdate,
} from '@util/cache';
import { formatLetterDates } from '@util/letter';
import { useSWRMutation } from './useSWRMutation';
import { useState } from 'react';
import { UseFileUpload } from '@ts-types/hooks';

export const useFileUpload = ({
  caption,
  letter,
  token,
  view,
}: UseFileUpload) => {
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
        data: {
          dateUploaded,
          fileKey,
          imageURL,
          signedUrl,
          uuid,
          thumbnailURL,
          uploadedBy,
        },
      } = signedUrlResponse as SignedURLResponse;

      await fileUpload({
        body: file,
        headers: {
          'Content-Type': file.type,
        },
        url: signedUrl,
      });

      const newImageURL = {
        caption: caption || undefined,
        dateUploaded,
        fileKey,
        id: uuid,
        mimeType: file.type as LetterMimeType,
        sizeInBytes: file.size,
        uploadedBy,
        url: imageURL,
        urlThumbnail: thumbnailURL,
        view,
      };

      const formatted = formatLetterDates(letter);

      const { message } = (await updateLetter({
        body: {
          ...formatted,
          imageURLs: [...letter.imageURLs, newImageURL],
        },
        params: {
          correspondenceId: formatted.correspondenceId as string,
          letterId: formatted.letterId,
        },
      })) as LetterFormResponse;

      setIsUploading(false);

      return {
        message,
        imageURL: newImageURL,
      };
    } catch (err) {
      let message = 'File upload error!';

      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'string') {
        message = err;
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
};
