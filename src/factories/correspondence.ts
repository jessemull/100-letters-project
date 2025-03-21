import { Correspondence, Impact, Letter, Status } from '@/types';
import { Factory } from 'fishery';
import { LetterFactory } from './letter';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { RecipientFactory } from './recipient';

interface CorrespondenceFactoryArgs {
  sent?: Letter[];
  received?: Letter[];
}

export const CorrespondenceFactory = Factory.define<
  Correspondence,
  CorrespondenceFactoryArgs
>(() => ({
  correspondenceId: uuidv4(),
  createdAt: faker.date.past().toISOString(),
  letters: LetterFactory.buildList(Math.floor(Math.random() * 3) + 1),
  recipientId: uuidv4(),
  reason: {
    description: faker.lorem.sentence(),
    domain: faker.person.jobArea(),
    impact: faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH']) as Impact,
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
