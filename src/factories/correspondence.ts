import { Category, Correspondence, Status } from '@ts-types/correspondence';
import { Factory } from 'fishery';
import { LetterFactory } from './letter';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { RecipientFactory } from '@factories/recipient';

export const CorrespondenceFactory = Factory.define<Correspondence>(() => ({
  correspondenceId: uuidv4(),
  createdAt: faker.date.past().toISOString(),
  letters: LetterFactory.buildList(Math.floor(Math.random() * 3) + 1),
  recipientId: uuidv4(),
  reason: {
    category: faker.helpers.arrayElement([
      'COMEDY',
      'ENTERTAINMENT',
      'FAMILY',
      'FOOD',
      'FRIENDS',
      'JOURNALISM',
      'LITERATURE',
      'MENTORS',
      'MUSIC',
      'SCIENCE',
      'SPORTS',
      'TECHNOLOGY',
    ]) as Category,
    description: faker.lorem.sentence(),
  },
  recipient: RecipientFactory.build(),
  status: faker.helpers.arrayElement([
    'PENDING',
    'RESPONDED',
    'UNSENT',
    'COMPLETED',
  ]) as Status,
  title: faker.lorem.words(),
  updatedAt: faker.date.recent().toISOString(),
}));
