import { Factory } from 'fishery';
import { Letter, LetterMethod, LetterType } from '@ts-types/letter';
import { Status } from '@ts-types/correspondence';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export const LetterFactory = Factory.define<Letter>(() => ({
  correspondenceId: uuidv4(),
  createdAt: faker.date.past().toISOString(),
  description: faker.lorem.sentence(),
  imageURLs: [faker.image.url(), faker.image.url()],
  letterId: uuidv4(),
  method: faker.helpers.arrayElement([
    'TYPED',
    'HANDWRITTEN',
    'PRINTED',
    'DIGITAL',
    'OTHER',
  ]) as LetterMethod,
  status: faker.helpers.arrayElement([
    'PENDING',
    'SENT',
    'RECEIVED',
    'RESPONDED',
  ]) as Status,
  text: faker.lorem.paragraph(),
  title: faker.lorem.words(),
  type: faker.helpers.arrayElement([
    'MAIL',
    'EMAIL',
    'SMS',
    'OTHER',
  ]) as LetterType,
  updatedAt: faker.date.recent().toISOString(),
}));
