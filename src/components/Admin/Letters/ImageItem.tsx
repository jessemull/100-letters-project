'use client';

import Image from './Image';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Progress,
  Select,
  TextInput,
  showToast,
} from '@components/Form';
import { Fullscreen, PenSquare, Trash2 } from 'lucide-react';
import {
  Letter,
  LetterFormResponse,
  LetterImage,
  View,
} from '@ts-types/letter';
import {
  correspondenceByIdLetterUpdate,
  correspondencesLetterUpdate,
  letterByIdUpdate,
  lettersUpdate,
} from '@util/cache';
import { formatLetterDates } from '@util/letter';
import { useAuth } from '@contexts/AuthProvider';
import { useImageModal } from '@contexts/ImageModalContext';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { viewOptions } from './LetterForm';

interface Props {
  data: LetterImage;
  deleteImage: (imageId: string) => void;
  letter: Letter;
  onUpdateImage: (imageURLs: LetterImage[]) => void;
}

const viewToLabel = {
  [View.LETTER_FRONT]: 'Letter Front',
  [View.LETTER_BACK]: 'Letter Back',
  [View.ENVELOPE_FRONT]: 'Envelope Front',
  [View.ENVELOPE_BACK]: 'Envelope Back',
  [View.OTHER]: 'Other',
};

const ImageItem = ({ data, deleteImage, letter, onUpdateImage }: Props) => {
  const [caption, setCaption] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [view, setView] = useState<View>(View.LETTER_FRONT);

  const { showImage } = useImageModal();
  const { token } = useAuth();

  const { mutate, isLoading } = useSWRMutation<
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
      { key: `/letter/${letter?.letterId}`, onUpdate: letterByIdUpdate },
    ],
    method: 'PUT',
    path: `/letter/${letter?.letterId}`,
    token,
    onError: ({ error, status = '0' }) => {
      showToast({
        message: error
          ? `Error ${status}: ${error}`
          : 'An error occurred during data update.',
        type: 'error',
      });
      if (data.caption) {
        setCaption(data.caption);
      }
      if (data.view) {
        setView(data.view);
      }
    },
    onSuccess: ({ response }) => {
      showToast({
        message: 'Successfully updated letter!',
        type: 'success',
      });
      setIsOpen(false);
      onUpdateImage(response.data.imageURLs);
    },
  });

  const onSubmit = async () => {
    const updated = {
      ...letter,
      imageURLs: letter.imageURLs.map((image) =>
        image.id === data.id ? { ...image, caption, view } : image,
      ),
    };

    const formatted = formatLetterDates(updated);

    await mutate({
      body: formatted,
      params: {
        correspondenceId: formatted.correspondenceId as string,
        letterId: formatted.letterId,
      },
    });
  };

  useEffect(() => {
    if (data.caption) {
      setCaption(data.caption);
    }
  }, [data.caption]);

  useEffect(() => {
    if (data.view) {
      setView(data.view);
    }
  }, [data.view]);

  return (
    <div
      data-testid="card-edit-button"
      className="relative p-4 bg-white/10 border border-white rounded-xl transition-transform transform hover:scale-[1.01] cursor-pointer"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Progress size={16} color="white" />
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <div className="w-20 h-20 relative rounded-md overflow-hidden mr-4 flex-shrink-0 border border-white/20">
              <Image
                alt={data.caption || 'Letter Image'}
                className="object-cover"
                fill
                sizes="80px"
                src={data?.urlThumbnail}
              />
            </div>
            <div className="flex-1 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg text-white">
                  {viewToLabel[data?.view]}
                </h3>
                <p className="text-sm text-gray-300">
                  {data?.caption
                    ? `${data.caption.length > 25 ? `${data.caption.slice(0, 25)}...` : data.caption}`
                    : 'No Caption'}
                </p>
              </div>
              <div className="space-y-2 flex flex-col items-center justify-center">
                <button
                  data-testid="full-screen-button"
                  className="text-white hover:text-gray-400"
                  aria-label="Full Screen"
                >
                  <Fullscreen
                    data-testid="full-screen-button-icon"
                    className="w-6 h-6"
                    onClick={() => showImage(data.url, 'No Image')}
                  />
                </button>
                <button
                  data-testid="edit-button"
                  className="text-white hover:text-gray-400"
                  aria-label="Edit"
                >
                  <PenSquare
                    data-testid="edit-button-icon"
                    className="w-6 h-6"
                    onClick={() => setIsOpen(!isOpen)}
                  />
                </button>
                <button
                  data-testid="delete-button"
                  className="text-white hover:text-gray-400"
                  aria-label="Delete"
                  onClick={() => deleteImage(data.id)}
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          {isOpen && (
            <div className="flex flex-col pt-4 space-y-4">
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <TextInput
                  id="caption"
                  label="Caption"
                  onChange={({ target: { value } }) => setCaption(value)}
                  placeholder="Caption"
                  type="text"
                  value={caption}
                />
                <div className="w-full md:w-1/2">
                  <Select
                    id="viewSelect"
                    label="View"
                    onChange={({ target: { value } }) => setView(value as View)}
                    options={viewOptions}
                    placeholder="Choose a view"
                    value={view}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/4 pt-2">
                <Button
                  id="update-image"
                  onClick={onSubmit}
                  value="Update Image"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageItem;
