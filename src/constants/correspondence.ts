import { CorrespondenceUpdate, Impact, Status } from '@ts-types/correspondence';
import { required } from '@util/validators';

export const correspondenceImpactOptions = [
  { label: 'Low', value: Impact.LOW },
  { label: 'Medium', value: Impact.MEDIUM },
  { label: 'High', value: Impact.HIGH },
];

export const correspondenceStatusOptions = [
  { label: 'Completed', value: Status.COMPLETED },
  { label: 'Pending', value: Status.PENDING },
  { label: 'Responded', value: Status.RESPONDED },
  { label: 'Unsent', value: Status.UNSENT },
];

export const initialCorrespondenceValues: CorrespondenceUpdate = {
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

export const correspondenceValidators = {
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
