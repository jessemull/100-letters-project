import { Factory } from 'fishery';
import { Recipient } from '@/types';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export const RecipientFactory = Factory.define<Recipient>(() => ({
  address: {
    city: faker.location.city(),
    country: faker.location.country(),
    postalCode: faker.location.zipCode(),
    state: faker.location.state(),
    street: faker.location.streetAddress(),
  },
  createdAt: faker.date.past().toISOString(),
  description: faker.lorem.sentence(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  occupation: faker.person.jobTitle(),
  organization: faker.company.name(),
  recipientId: uuidv4(),
  updatedAt: faker.date.recent().toISOString(),
}));
