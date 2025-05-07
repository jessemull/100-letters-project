'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  GetLetterByIdResponse,
  Letter,
  LetterFormResponse,
  LetterType,
  LetterMethod,
  View,
} from '@ts-types/letter';
import {
  Correspondence,
  GetCorrespondenceByIdResponse,
  GetCorrespondencesResponse,
  Status,
} from '@ts-types/correspondence';
import {
  AutoSelect,
  Button,
  ConfirmationModal,
  Progress,
  Select,
  TextArea,
  TextInput,
  showToast,
} from '@components/Form';
import { required } from '@util/validators';
import { toDateTimeLocal } from '@util/date-time';
import { useAuth } from '@contexts/AuthProvider';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useForm } from '@hooks/useForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';
import {
  correspondenceByIdLetterUpdate,
  correspondencesLetterUpdate,
  letterByIdUpdate,
  lettersUpdate,
} from '@util/cache';
import useFileUpload from '@hooks/useFileUpload';
import ImageItem from './ImageItem';
import AddImageItem from './AddImageItem';
import { useDeleteUpload } from '@hooks/useDeleteUpload';
import { formatLetterDates } from '@util/letter';

const methodOptions = [
  { label: 'Digital', value: LetterMethod.DIGITAL },
  { label: 'Handwritten', value: LetterMethod.HANDWRITTEN },
  { label: 'Printed', value: LetterMethod.PRINTED },
  { label: 'Typed', value: LetterMethod.TYPED },
  { label: 'Other', value: LetterMethod.OTHER },
];

const typeOptions = [
  { label: 'Email', value: LetterType.EMAIL },
  { label: 'Mail', value: LetterType.MAIL },
  { label: 'SMS', value: LetterType.SMS },
  { label: 'Other', value: LetterType.OTHER },
];

const statusOptions = [
  { label: 'Pending', value: Status.PENDING },
  { label: 'Responded', value: Status.RESPONDED },
  { label: 'Sent', value: Status.SENT },
  { label: 'Received', value: Status.RECEIVED },
];

const viewOptions = [
  { label: 'Letter Front', value: View.LETTER_FRONT },
  { label: 'Letter Back', value: View.LETTER_BACK },
  { label: 'Envelope Front', value: View.ENVELOPE_FRONT },
  { label: 'Envelope Back', value: View.ENVELOPE_BACK },
  { label: 'Other', value: View.OTHER },
];

const initial: Letter = {
  correspondenceId: '',
  description: '',
  imageURLs: [],
  letterId: '',
  method: LetterMethod.HANDWRITTEN,
  receivedAt: '',
  sentAt: '',
  status: Status.PENDING,
  text: '',
  title: '',
  type: LetterType.MAIL,
};

const validators = {
  correspondenceId: [required('Correspondence ID required')],
  method: [required('Method required')],
  status: [required('Status required')],
  text: [required('Text required')],
  title: [required('Title required')],
  type: [required('Type required')],
};

const LetterForm = () => {
  const [caption, setCaption] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [imageId, setImageId] = useState<string>('');
  const [isAddingImage, setIsAddingImage] = useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [view, setView] = useState(View.LETTER_FRONT);

  const router = useRouter();
  const searchParams = useSearchParams();
  const correspondenceId = searchParams.get('correspondenceId');
  const letterId = searchParams.get('letterId');

  const { loading: authenticating, token } = useAuth();

  const {
    data: { data } = {},
    error,
    isLoading,
  } = useSWRQuery<GetLetterByIdResponse>({
    config: { shouldRetryOnError: false },
    path: letterId ? `/letter/${letterId}` : null,
    token,
  });

  const {
    data: correspondencesData,
    error: correspondencesError,
    isLoading: correspondencesLoading,
  } = useSWRQuery<GetCorrespondencesResponse>({
    config: { shouldRetryOnError: false },
    path: '/correspondence?limit=500',
    skip: letterId === null && correspondenceId !== null,
    token,
  });

  const {
    data: singleCorrespondence = {
      data: { correspondence: { correspondenceId: '' } },
    },
    error: singleCorrespondenceError,
    isLoading: singleCorrespondenceIsLoading,
  } = useSWRQuery<GetCorrespondenceByIdResponse>({
    config: { shouldRetryOnError: false },
    path: `/correspondence/${data?.correspondenceId || correspondenceId}`,
    skip: !data?.correspondenceId && !correspondenceId,
    token,
  });

  const correspondenceMap = useMemo(() => {
    if (!correspondencesData?.data) return {};
    return Object.fromEntries(
      correspondencesData.data.map((correspondence) => [
        correspondence.correspondenceId,
        correspondence,
      ]),
    );
  }, [correspondencesData]);

  const correspondenceOptions = useMemo(() => {
    if (!correspondencesData?.data) return [];
    return correspondencesData.data
      .map(
        ({
          correspondenceId,
          recipient = { lastName: 'No Last Name', firstName: 'No First Name' },
          title = 'No Title',
        }) => ({
          label: `${recipient?.lastName}, ${recipient?.firstName} - ${
            title && title.length > 20 ? `${title.slice(0, 20)}...` : title
          }`.trim(),
          value: correspondenceId,
        }),
      )
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [correspondencesData]);

  const { errors, isDirty, onSubmit, updateField, values, setValues } =
    useForm<Letter>({
      initial,
      validators,
    });

  const {
    error: fileUploadError,
    uploadFile,
    isUploading,
  } = useFileUpload({
    caption,
    letter: values,
    token,
    view,
  });

  const {
    error: deleteUploadError,
    deleteFile,
    isDeleting,
  } = useDeleteUpload({
    letter: values,
    token,
  });

  const { mutate, isLoading: isUpdating } = useSWRMutation<
    Partial<Letter>,
    LetterFormResponse
  >({
    cache: [
      { key: '/correspondence', onUpdate: correspondencesLetterUpdate },
      {
        key: `/correspondence/${values.correspondenceId}`,
        onUpdate: correspondenceByIdLetterUpdate,
      },
      { key: '/letter', onUpdate: lettersUpdate },
      { key: `/letter/${letterId}`, onUpdate: letterByIdUpdate },
    ],
    method: letterId ? 'PUT' : 'POST',
    path: letterId ? `/letter/${letterId}` : `/letter`,
    token,
    onError: ({ error, status = '0' }) => {
      showToast({
        message: error
          ? `Error ${status}: ${error}`
          : 'An error occurred during data update.',
        type: 'error',
      });
    },
    onSuccess: () => router.back(),
  });

  const resetAddNewImage = () => {
    setCaption('');
    setFile(null);
    setIsAddingImage(false);
    setView(View.LETTER_FRONT);
  };

  const onSelectImage = ({
    target: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const onDeleteImage = (imageId: string) => {
    setImageId(imageId);
    setIsConfirmationModalOpen(true);
  };

  const onConfirmDelete = async () => {
    setIsConfirmationModalOpen(false);
    const response = await deleteFile({ imageId });
    if (response?.imageURLs) {
      updateField('imageURLs', response.imageURLs);
    }
    setImageId('');
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const uploadImage = async () => {
    if (file && view) {
      const response = await uploadFile({ file });
      if (response?.message) {
        showToast({ message: response?.message, type: 'success' });
      }
      if (response?.imageURL) {
        updateField('imageURLs', [...values.imageURLs, response.imageURL]);
      }
      resetAddNewImage();
    }
  };

  const handleSubmit = () => {
    onSubmit(async () => {
      const formatted = formatLetterDates(values);
      await mutate({
        body: formatted,
        params: {
          correspondenceId: correspondenceId as string,
          letterId: formatted.letterId,
        },
      });
    });
  };

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    if (letterId && data?.letterId && values.letterId === '') {
      const formatted = { ...data };

      if (formatted.sentAt) {
        formatted.sentAt = toDateTimeLocal(formatted.sentAt);
      }

      if (formatted.receivedAt) {
        formatted.receivedAt = toDateTimeLocal(formatted.receivedAt);
      }

      setValues(formatted);
    }
  }, [letterId, data, values.letterId, setValues]);

  useEffect(() => {
    if (error || correspondencesError || singleCorrespondenceError) {
      showToast({
        message:
          (error || correspondencesError || singleCorrespondenceError).info
            ?.message || 'An error occurred while fetching data.',
        type: 'error',
      });
    }
  }, [error, correspondencesError, singleCorrespondenceError]);

  useEffect(() => {
    if (
      !letterId &&
      singleCorrespondence?.data?.correspondence?.correspondenceId &&
      values.correspondenceId === ''
    ) {
      updateField(
        'correspondenceId',
        singleCorrespondence?.data?.correspondence?.correspondenceId,
      );
    }
  }, [letterId, singleCorrespondence, values.correspondenceId, updateField]);

  useEffect(() => {
    if (fileUploadError) {
      showToast({ type: 'error', message: fileUploadError });
    }
  }, [fileUploadError]);

  const correspondenceLabel = useMemo(() => {
    const correspondence =
      !letterId && !correspondenceId
        ? correspondenceMap[values.correspondenceId]
        : (singleCorrespondence?.data
            ?.correspondence as unknown as Correspondence);

    const recipient = correspondence?.recipient || {
      lastName: 'No Last Name',
      firstName: 'No First Name',
    };
    const title = correspondence?.title || 'No Title';

    return `${recipient.lastName}, ${recipient.firstName} - ${title}`.trim();
  }, [
    correspondenceMap,
    letterId,
    correspondenceId,
    singleCorrespondence,
    values.correspondenceId,
  ]);

  const disableUploadButton = useMemo(() => {
    return !Boolean(file) || !Boolean(view);
  }, [file, view]);

  return isLoading || authenticating || singleCorrespondenceIsLoading ? (
    <Progress color="white" size={16} />
  ) : (
    <>
      <div className="p-6 md:p-12 w-full max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-white">Letter Form</h1>
          {values.correspondenceId && (
            <h3 className="text-white text-lg">{correspondenceLabel}</h3>
          )}
        </div>
        <h2 className="text-xl font-semibold text-white">Letter Info</h2>
        {!letterId &&
          (!values.correspondenceId || correspondenceOptions.length > 1) && (
            <AutoSelect
              errors={errors.correspondenceId}
              id="correspondenceId"
              label="Correspondence ID"
              loading={correspondencesLoading}
              options={correspondenceOptions}
              onChange={(value) => updateField('correspondenceId', value)}
              placeholder="Correspondence ID"
              value={values.correspondenceId}
            />
          )}
        <TextInput
          errors={errors.title}
          id="title"
          label="Title"
          onChange={({ target: { value } }) => updateField('title', value)}
          placeholder="Title"
          type="text"
          value={values.title}
        />
        <TextArea
          id="description"
          label="Description"
          onChange={({ target: { value } }) =>
            updateField('description', value)
          }
          placeholder="Short description"
          value={values.description || ''}
        />
        <TextArea
          errors={errors.text}
          id="text"
          label="Letter Text"
          onChange={({ target: { value } }) => updateField('text', value)}
          placeholder="Letter text..."
          value={values.text || ''}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            errors={errors.type}
            id="type"
            label="Type"
            onChange={({ target: { value } }) =>
              updateField('type', value as LetterType)
            }
            options={typeOptions}
            placeholder="Type"
            value={values.type}
          />
          <Select
            errors={errors.method}
            id="method"
            label="Method"
            onChange={({ target: { value } }) =>
              updateField('method', value as LetterMethod)
            }
            options={methodOptions}
            placeholder="Method"
            value={values.method}
          />
          <Select
            errors={errors.status}
            id="status"
            label="Status"
            onChange={({ target: { value } }) =>
              updateField('status', value as Status)
            }
            options={statusOptions}
            placeholder="Status"
            value={values.status}
          />
          <DatePicker
            customInput={
              <TextInput
                id="sentAt"
                label="Sent At"
                placeholder="Sent At"
                type="text"
                value={values.sentAt as string}
              />
            }
            name="sentAt"
            dateFormat="Pp"
            onChange={(date) => updateField('sentAt', date?.toISOString())}
            placeholderText="Sent At"
            selected={values.sentAt ? new Date(values.sentAt) : null}
            showTimeSelect
            timeCaption="Time"
            timeIntervals={15}
          />
          <DatePicker
            customInput={
              <TextInput
                id="receivedAt"
                label="Received At"
                placeholder="Received At"
                type="text"
                value={values.receivedAt as string}
              />
            }
            name="receivedAt"
            dateFormat="Pp"
            onChange={(date) => updateField('receivedAt', date?.toISOString())}
            selected={values.receivedAt ? new Date(values.receivedAt) : null}
            showTimeSelect
            placeholderText="Received At"
            timeCaption="Time"
            timeIntervals={15}
          />
        </div>
        {letterId && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Images</h2>
            {!isUploading &&
              !isDeleting &&
              values.imageURLs.map((image) => (
                <ImageItem
                  data={image}
                  key={image?.id}
                  deleteImage={onDeleteImage}
                />
              ))}
            {isUploading || isDeleting ? (
              <div className="w-full flex items-center justify-center">
                <Progress color="white" size={12} />
              </div>
            ) : (
              <div>
                {isAddingImage ? (
                  <AddImageItem
                    caption={caption}
                    disableUploadButton={disableUploadButton}
                    file={file}
                    onSelectImage={onSelectImage}
                    resetAddNewImage={resetAddNewImage}
                    setCaption={setCaption}
                    setView={setView}
                    uploadImage={uploadImage}
                    view={view}
                    viewOptions={viewOptions}
                  />
                ) : (
                  <Button
                    id="add-image"
                    onClick={() => setIsAddingImage(true)}
                    value="Add Image +"
                  />
                )}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col-reverse md:flex-row justify-between gap-4 pt-6">
          <Button id="cancel" onClick={handleCancel} value="Cancel" />
          <Button
            disabled={!isDirty || Object.keys(errors).length > 0}
            id="submit"
            loading={isUpdating}
            onClick={handleSubmit}
            value={letterId ? 'Update' : 'Create'}
          />
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={onConfirmDelete}
        title="Delete Letter"
      />
    </>
  );
};

export default LetterForm;
