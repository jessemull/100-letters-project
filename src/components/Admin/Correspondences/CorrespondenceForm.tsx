'use client';

import {
  Button,
  ConfirmationModal,
  Progress,
  Select,
  TextArea,
  TextInput,
  showToast,
} from '@components/Form';
import {
  CorrespondenceFormResponse,
  CorrespondenceUpdate,
  CreateOrUpdateCorrespondenceInput,
  GetCorrespondenceByIdResponse,
  Impact,
  Status,
} from '@ts-types/correspondence';
import { DeleteLetterParams, DeleteLetterResponse } from '@ts-types/letter';
import { LetterItem } from '../Letters';
import { useAuth } from '@contexts/AuthProvider';
import { useEffect, useState } from 'react';
import { useForm } from '@hooks/useForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';
import {
  correspondenceByIdDeleteUpdate,
  correspondenceByIdUpdate,
  correspondencesDeleteUpdate,
  correspondencesUpdate,
  letterByIdDeleteUpdate,
  lettersDeleteUpdate,
  recipientByIdCorrespondenceUpdate,
  recipientsCorrespondenceUpdate,
} from '@util/cache';
import {
  correspondenceImpactOptions,
  correspondenceStatusOptions,
  correspondenceValidators,
  initialCorrespondenceValues,
} from '@constants/correspondence';

const CorrespondenceForm = () => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [letterId, setLetterId] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const correspondenceId = searchParams.get('correspondenceId');
  const { loading: authenticating, token } = useAuth();

  const {
    data: { data } = {},
    error,
    isLoading,
  } = useSWRQuery<GetCorrespondenceByIdResponse>({
    config: { shouldRetryOnError: false },
    path: correspondenceId ? `/correspondence/${correspondenceId}` : null,
    token,
  });

  const { errors, isDirty, onSubmit, updateField, values, setValues } =
    useForm<CorrespondenceUpdate>({
      initial: initialCorrespondenceValues,
      validators: correspondenceValidators,
    });

  const { isLoading: isDeleting, mutate: deleteLetter } = useSWRMutation<
    {},
    DeleteLetterResponse,
    DeleteLetterParams
  >({
    cache: [
      { key: '/correspondence', onUpdate: correspondencesDeleteUpdate },
      {
        key: `/correspondence/${correspondenceId}`,
        onUpdate: correspondenceByIdDeleteUpdate,
      },
      { key: '/letter', onUpdate: lettersDeleteUpdate },
      { key: `/letter/${letterId}`, onUpdate: letterByIdDeleteUpdate },
    ],
    method: 'DELETE',
    token,
    onSuccess: () => {
      showToast({
        message: 'Letter deleted successfully!',
        type: 'success',
      });
    },
    onError: ({ error }) => {
      showToast({
        message: error,
        type: 'error',
      });
    },
  });

  const { mutate, isLoading: isUpdating } = useSWRMutation<
    Partial<CreateOrUpdateCorrespondenceInput>,
    CorrespondenceFormResponse
  >({
    cache: [
      { key: '/correspondence', onUpdate: correspondencesUpdate },
      {
        key: `/correspondence/${correspondenceId}`,
        onUpdate: correspondenceByIdUpdate,
      },
      { key: '/recipient', onUpdate: recipientsCorrespondenceUpdate },
      {
        key: `/recipient/${values.recipientId}`,
        onUpdate: recipientByIdCorrespondenceUpdate,
      },
    ],
    method: correspondenceId ? 'PUT' : 'POST',
    path: correspondenceId
      ? `/correspondence/${correspondenceId}`
      : `/correspondence`,
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

  const onAddLetter = () => {
    router.push(`/admin/letter?correspondenceId=${correspondenceId}`);
  };

  const onEdit = (id: string) => {
    router.push(`/admin/letter?letterId=${id}`);
  };

  const onDelete = (id: string) => {
    setLetterId(id);
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const onConfirmDelete = () => {
    closeConfirmationModal();
    deleteLetter({
      path: `/letter/${letterId}`,
      params: { correspondenceId: correspondenceId as string, letterId },
    });
  };

  const handleSubmit = () => {
    onSubmit(async () => {
      const { letters, recipient, ...correspondence } = { ...values };

      if (!correspondence?.correspondenceId) {
        delete correspondence['correspondenceId'];
        delete correspondence['recipientId'];
        delete recipient['recipientId'];
      }

      await mutate({ body: { correspondence, letters, recipient } });
    });
  };

  const handleCancel = () => {
    router.back();
  };

  // Set values on initial render after fetching the corresondence data.

  useEffect(() => {
    if (
      correspondenceId &&
      data?.correspondence?.correspondenceId &&
      values.correspondenceId === ''
    ) {
      const { correspondence, recipient, letters } = data;
      setValues({ ...correspondence, recipient, letters });
    }
  }, [correspondenceId, data, values.correspondenceId, setValues]);

  // Set values on SWR cache update when adding or removing letters so the letters are added and removed in the form.

  useEffect(() => {
    if (data && data.letters.length !== values.letters.length) {
      const { correspondence, recipient, letters } = data;
      setValues({ ...correspondence, recipient, letters });
    }
  }, [data, setValues, values.letters.length]);

  useEffect(() => {
    if (error) {
      showToast({
        message:
          error.info?.message || 'An error occurred while fetching data.',
        type: 'error',
      });
    }
  }, [error]);

  return isLoading || authenticating ? (
    <div className="pt-32 lg:pt-64 flex items-center justify-center">
      <Progress color="white" size={16} />
    </div>
  ) : (
    <div className="p-6 md:p-12 w-full max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">
          Correspondence Form
        </h1>
        <div className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold text-white">Correspondence</h2>
          <TextInput
            errors={errors.title}
            id="title"
            label="Title"
            onChange={({ target: { value } }) => updateField('title', value)}
            placeholder="Title"
            value={values.title}
            type="text"
          />
          <Select
            errors={errors.status}
            id="status"
            label="Status"
            onChange={({ target: { value } }) =>
              updateField('status', value as Status)
            }
            options={correspondenceStatusOptions}
            value={values.status}
          />
        </div>
        <div className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold text-white">Reason</h2>
          <TextInput
            errors={errors['reason.domain']}
            id="domain"
            label="Domain"
            onChange={({ target: { value } }) =>
              updateField('reason.domain', value)
            }
            placeholder="Domain"
            value={values.reason.domain}
            type="text"
          />
          <Select
            errors={errors['reason.impact']}
            id="impact"
            label="Impact"
            onChange={({ target: { value } }) =>
              updateField('reason.impact', value as Impact)
            }
            options={correspondenceImpactOptions}
            value={values.reason.impact}
          />
          <TextArea
            errors={errors['reason.description']}
            id="reason-description"
            label="Description"
            onChange={({ target: { value } }) =>
              updateField('reason.description', value)
            }
            placeholder="Reason for writing"
            value={values.reason.description}
          />
        </div>
        <div className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold text-white">Recipient</h2>
          <TextInput
            errors={errors['recipient.firstName']}
            id="firstName"
            label="First Name"
            onChange={({ target: { value } }) =>
              updateField('recipient.firstName', value)
            }
            placeholder="First Name"
            value={values.recipient.firstName}
            type="text"
          />
          <TextInput
            errors={errors['recipient.lastName']}
            id="lastName"
            label="Last Name"
            onChange={({ target: { value } }) =>
              updateField('recipient.lastName', value)
            }
            placeholder="Last Name"
            value={values.recipient.lastName}
            type="text"
          />
          <TextInput
            errors={errors['recipient.organization']}
            id="organization"
            label="Organization"
            onChange={({ target: { value } }) =>
              updateField('recipient.organization', value)
            }
            placeholder="Organization"
            value={values.recipient.organization || ''}
            type="text"
          />
          <TextInput
            errors={errors['recipient.occupation']}
            id="occupation"
            label="Occupation"
            onChange={({ target: { value } }) =>
              updateField('recipient.occupation', value)
            }
            placeholder="Occupation"
            value={values.recipient.occupation || ''}
            type="text"
          />
          <TextArea
            errors={errors['recipient.description']}
            id="description"
            label="Description"
            onChange={({ target: { value } }) =>
              updateField('recipient.description', value)
            }
            placeholder="Description"
            value={values.recipient.description || ''}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextInput
              errors={errors['recipient.address.street']}
              id="street"
              label="Street"
              onChange={({ target: { value } }) =>
                updateField('recipient.address.street', value)
              }
              placeholder="Street"
              value={values.recipient.address.street}
              type="text"
            />
            <TextInput
              errors={errors['recipient.address.city']}
              id="city"
              label="City"
              onChange={({ target: { value } }) =>
                updateField('recipient.address.city', value)
              }
              placeholder="City"
              value={values.recipient.address.city}
              type="text"
            />
            <TextInput
              errors={errors['recipient.address.state']}
              id="state"
              label="State"
              onChange={({ target: { value } }) =>
                updateField('recipient.address.state', value)
              }
              placeholder="State"
              value={values.recipient.address.state}
              type="text"
            />
            <TextInput
              errors={errors['recipient.address.postalCode']}
              id="postalCode"
              label="Postal Code"
              onChange={({ target: { value } }) =>
                updateField('recipient.address.postalCode', value)
              }
              placeholder="Postal Code"
              value={values.recipient.address.postalCode}
              type="text"
            />
            <TextInput
              errors={errors['recipient.address.country']}
              id="country"
              label="Country"
              onChange={({ target: { value } }) =>
                updateField('recipient.address.country', value)
              }
              placeholder="Country"
              value={values.recipient.address.country}
              type="text"
            />
          </div>
        </div>
        {correspondenceId && (
          <div className="space-y-4 pt-6">
            <h2 className="text-xl font-semibold text-white">Letters</h2>
            <div className="flex justify-center flex-col space-y-4">
              {isDeleting ? (
                <div className="w-full flex justify-center items-center min-h-[200px]">
                  <Progress color="white" size={16} />
                </div>
              ) : (
                values.letters.map((letter) => (
                  <LetterItem
                    key={letter?.letterId}
                    data={letter}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
              <div className="lg:self-center pt-1 lg:w-1/2">
                <Button
                  id="add-letter"
                  onClick={onAddLetter}
                  value="Add Letter +"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-between gap-4 pt-6">
        <Button id="cancel" onClick={handleCancel} value="Cancel" />
        <Button
          disabled={
            !isDirty ||
            Object.keys(errors).length > 0 ||
            isLoading ||
            isDeleting
          }
          id="submit"
          loading={isUpdating}
          onClick={handleSubmit}
          value={correspondenceId ? 'Update' : 'Create'}
        />
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={onConfirmDelete}
        title="Delete Letter"
      />
    </div>
  );
};

export default CorrespondenceForm;
