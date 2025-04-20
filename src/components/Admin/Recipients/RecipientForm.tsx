'use client';

import {
  Recipient,
  GetRecipientByIdResponse,
  RecipientFormResponse,
} from '@ts-types/recipients';
import { TextInput, Button, TextArea, Progress } from '@components/Form';
import { required } from '@util/validators';
import { useAuth } from '@contexts/AuthProvider';
import { useForm } from '@hooks/useForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSWRMutation } from '@hooks/useSWRMutation';
import { useSWRQuery } from '@hooks/useSWRQuery';

const initial: Recipient = {
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
};

const validators = {
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
};

const RecipientForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipientId = searchParams.get('recipientId');

  const { loading: authenticating, token } = useAuth();

  const { data: { data } = {}, isLoading } =
    useSWRQuery<GetRecipientByIdResponse>(
      recipientId ? `/recipient/${recipientId}` : null,
      token,
    );

  const { errors, isDirty, onSubmit, updateField, values, setValues } =
    useForm<Recipient>({
      initial,
      validators,
    });

  const { mutate, isLoading: isUpdating } = useSWRMutation<
    Partial<Recipient>,
    RecipientFormResponse
  >({
    method: recipientId ? 'PUT' : 'POST',
    path: recipientId ? `/recipient/${recipientId}` : `/recipient`,
    token,
    onSuccess: () => router.back(),
  });

  const handleSubmit = () => {
    onSubmit(async () => {
      await mutate({ body: values });
    });
  };

  const handleCancel = () => {
    router.back();
  };

  if (
    !isLoading &&
    recipientId &&
    data?.recipientId &&
    values.recipientId === ''
  ) {
    setValues(data);
  }

  return isLoading || authenticating ? (
    <Progress color="white" size={16} />
  ) : (
    <div className="p-6 md:p-12 w-full max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold text-white">Recipient Form</h1>
      <h2 className="text-xl font-medium text-white pt-4">
        Personal Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          id="firstName"
          label="First Name"
          value={values.firstName}
          placeholder="First Name"
          errors={errors.firstName}
          onChange={({ target: { value } }) => updateField('firstName', value)}
          type="text"
        />
        <TextInput
          id="lastName"
          label="Last Name"
          value={values.lastName}
          placeholder="Last Name"
          errors={errors.lastName}
          onChange={({ target: { value } }) => updateField('lastName', value)}
          type="text"
        />
        <TextInput
          id="organization"
          label="Organization"
          value={values.organization || ''}
          placeholder="Organization"
          onChange={({ target: { value } }) =>
            updateField('organization', value)
          }
          type="text"
        />
        <TextInput
          id="occupation"
          label="Occupation"
          value={values.occupation || ''}
          placeholder="Occupation"
          onChange={({ target: { value } }) => updateField('occupation', value)}
          type="text"
        />
      </div>
      <TextArea
        id="description"
        label="Description"
        value={values.description || ''}
        placeholder="Description"
        onChange={({ target: { value } }) => updateField('description', value)}
      />
      <h2 className="text-xl font-medium text-white pt-4">Address</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          id="street"
          label="Street"
          value={values.address.street}
          placeholder="Street"
          errors={errors['address.street']}
          onChange={({ target: { value } }) =>
            updateField('address.street', value)
          }
          type="text"
        />
        <TextInput
          id="city"
          value={values.address.city}
          label="City"
          placeholder="City"
          errors={errors['address.city']}
          onChange={({ target: { value } }) =>
            updateField('address.city', value)
          }
          type="text"
        />
        <TextInput
          id="state"
          value={values.address.state}
          placeholder="State"
          label="State"
          errors={errors['address.state']}
          onChange={({ target: { value } }) =>
            updateField('address.state', value)
          }
          type="text"
        />
        <TextInput
          id="postalCode"
          value={values.address.postalCode}
          placeholder="Postal Code"
          errors={errors['address.postalCode']}
          label="Postal Code"
          onChange={({ target: { value } }) =>
            updateField('address.postalCode', value)
          }
          type="text"
        />
        <TextInput
          id="country"
          value={values.address.country}
          placeholder="Country"
          label="Country"
          errors={errors['address.country']}
          onChange={({ target: { value } }) =>
            updateField('address.country', value)
          }
          type="text"
        />
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-between gap-4 pt-6">
        <Button id="cancel" onClick={handleCancel} value="Cancel" />
        <Button
          id="submit"
          onClick={handleSubmit}
          loading={isUpdating}
          disabled={!isDirty || Object.keys(errors).length > 0}
          value={recipientId ? 'Update' : 'Create'}
        />
      </div>
    </div>
  );
};

export default RecipientForm;
