import { Correspondence, Letter } from '@/types';
import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { LetterFactory } from './letters';

interface CorrespondenceFactoryArgs {
  sent?: Letter[];
  received?: Letter[];
}

export const CorrespondenceFactory = Factory.define<
  Correspondence,
  CorrespondenceFactoryArgs
>(({ transientParams }) => ({
  id: faker.string.uuid(),
  letters: {
    received: transientParams.received ?? LetterFactory.buildList(1),
    sent: transientParams.sent ?? LetterFactory.buildList(1),
  },
  recipient: faker.person.fullName(),
  title: faker.lorem.sentence(),
}));
