'use client';

import {
  Correspondence,
  CorrespondenceFormResponse,
  CorrespondenceUpdate,
  CreateOrUpdateCorrespondenceInput,
  GetCorrespondenceByIdResponse,
  Impact,
  Status,
} from '@ts-types/correspondence';
import {
  Button,
  Progress,
  Select,
  TextArea,
  TextInput,
  showToast,
} from '@components/Form';
import { required } from '@util/validators';
import { useAuth } from '@contexts/AuthProvider';
import { useEffect } from 'react';
import { useForm } from '@hooks/useForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';

const impactOptions = [
  { label: 'Low', value: Impact.LOW },
  { label: 'Medium', value: Impact.MEDIUM },
  { label: 'High', value: Impact.HIGH },
];

const statusOptions = [
  { label: 'Completed', value: Status.COMPLETED },
  { label: 'Pending', value: Status.PENDING },
  { label: 'Responded', value: Status.RESPONDED },
  { label: 'Unsent', value: Status.UNSENT },
];

const initial: CorrespondenceUpdate = {
  correspondenceId: '',
  letters: [],
  recipient: {
    address: {
      city: '',
      country: '',
      postalCode: '',
      state: '',
      street: '',
    },
    description: '',
    firstName: '',
    lastName: '',
    occupation: '',
    organization: '',
    recipientId: '',
  },
  recipientId: '',
  reason: {
    description: '',
    domain: '',
    impact: Impact.HIGH,
  },
  status: Status.UNSENT,
  title: '',
};

const validators = {
  reason: {
    description: [required('Description required')],
    domain: [required('Domain required')],
    impact: [required('Impact required')],
  },
  recipient: {
    address: {
      city: [required('City required')],
      country: [required('Country required')],
      postalCode: [required('Postal code required')],
      state: [required('State required')],
      street: [required('Street required')],
    },
    description: [required('Description required')],
    firstName: [required('First name required')],
    lastName: [required('Last name required')],
    occupation: [required('Occupation required')],
    organization: [required('Organization required')],
  },
  status: [required('Status required')],
  title: [required('Title required')],
};

const CorrespondenceForm = () => {
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
      initial,
      validators,
    });

  const { mutate, isLoading: isUpdating } = useSWRMutation<
    Partial<CreateOrUpdateCorrespondenceInput>,
    CorrespondenceFormResponse
  >({
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
    <Progress color="white" size={16} />
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
            options={statusOptions}
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
            options={impactOptions}
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
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-between gap-4 pt-6">
        <Button id="cancel" onClick={handleCancel} value="Cancel" />
        <Button
          disabled={!isDirty || Object.keys(errors).length > 0}
          id="submit"
          loading={isUpdating}
          onClick={handleSubmit}
          value={correspondenceId ? 'Update' : 'Create'}
        />
      </div>
    </div>
  );
};

export default CorrespondenceForm;
