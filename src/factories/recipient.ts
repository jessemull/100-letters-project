import { Factory } from 'fishery';
import { Recipient } from '@ts-types/recipients';
import { faker } from '@faker-js/faker';
const uuidv4 = () => crypto.randomUUID();

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
