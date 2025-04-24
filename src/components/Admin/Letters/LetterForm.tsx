'use client';

import {
  GetLetterByIdResponse,
  Letter,
  LetterFormResponse,
  LetterType,
  LetterMethod,
} from '@ts-types/letter';
import { GetCorrespondencesResponse, Status } from '@ts-types/correspondence';
import {
  TextInput,
  Button,
  TextArea,
  Select,
  Progress,
  AutoSelect,
} from '@components/Form';
import { required } from '@util/validators';
import { useAuth } from '@contexts/AuthProvider';
import { useForm } from '@hooks/useForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';
import { toDateTimeLocal, toUTCTime } from '@util/date-time';
import { useMemo } from 'react';

const methodOptions = [
  { label: 'Email', value: LetterMethod.DIGITAL },
  { label: 'Handwritten', value: LetterMethod.HANDWRITTEN },
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
  { label: 'Unsent', value: Status.UNSENT },
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const letterId = searchParams.get('letterId');

  const { loading: authenticating, token } = useAuth();

  const { data: { data } = {}, isLoading } = useSWRQuery<GetLetterByIdResponse>(
    {
      path: letterId ? `/letter/${letterId}` : null,
      token,
    },
  );

  const { data: correspondencesData, isLoading: correspondencesLoading } =
    useSWRQuery<GetCorrespondencesResponse>({
      path: '/correspondence?limit=100',
      skip: Boolean(letterId),
      token,
    });

  const correspondenceOptions = useMemo(() => {
    if (!correspondencesData?.data) return [];
    return correspondencesData.data
      .map(({ correspondenceId, recipient = {} }) => ({
        label: `${recipient?.lastName}, ${recipient?.firstName}`,
        value: correspondenceId,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [correspondencesData]);

  const { errors, isDirty, onSubmit, updateField, values, setValues } =
    useForm<Letter>({
      initial,
      validators,
    });

  const { mutate, isLoading: isUpdating } = useSWRMutation<
    Partial<Letter>,
    LetterFormResponse
  >({
    method: letterId ? 'PUT' : 'POST',
    path: letterId ? `/letter/${letterId}` : `/letter`,
    token,
    onSuccess: () => router.back(),
  });

  const handleSubmit = () => {
    onSubmit(async () => {
      const formatted = { ...values };

      if (formatted.sentAt) {
        formatted.sentAt = toUTCTime(formatted.sentAt);
      } else {
        delete formatted.sentAt;
      }

      if (formatted.receivedAt) {
        formatted.receivedAt = toUTCTime(formatted.receivedAt);
      } else {
        delete formatted.receivedAt;
      }

      await mutate({ body: formatted });
    });
  };

  const handleCancel = () => {
    router.back();
  };

  if (!isLoading && letterId && data?.letterId && values.letterId === '') {
    const formatted = { ...data };

    if (formatted.sentAt) {
      formatted.sentAt = toDateTimeLocal(formatted.sentAt);
    }

    if (formatted.receivedAt) {
      formatted.receivedAt = toDateTimeLocal(formatted.receivedAt);
    }

    setValues(formatted);
  }

  return isLoading || authenticating ? (
    <Progress color="white" size={16} />
  ) : (
    <div className="p-6 md:p-12 w-full max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold text-white">Letter Form</h1>
      {!letterId && (
        <AutoSelect
          errors={errors.correspondenceId}
          id="correspondenceId"
          label="Correspondence ID"
          loading={correspondencesLoading}
          options={correspondenceOptions || []}
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
        onChange={({ target: { value } }) => updateField('description', value)}
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
        <TextInput
          id="sentAt"
          label="Sent At"
          onChange={({ target: { value } }) => updateField('sentAt', value)}
          placeholder="Sent At"
          type="datetime-local"
          value={values.sentAt || ''}
        />
        <TextInput
          id="receivedAt"
          label="Received At"
          onChange={({ target: { value } }) => updateField('receivedAt', value)}
          placeholder="Received At"
          type="datetime-local"
          value={values.receivedAt || ''}
        />
      </div>
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
  );
};

export default LetterForm;
