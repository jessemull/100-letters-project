import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { Letter, LetterMedium, LetterStatus } from '@/types';

export const LetterFactory = Factory.define<Letter>(() => ({
  date: faker.date.past().toISOString(),
  id: faker.string.uuid(),
  medium: faker.helpers.arrayElement([
    LetterMedium.EMAIL,
    LetterMedium.PHYSICAL_MAIL,
    LetterMedium.HOMING_PIGEON,
    LetterMedium.OTHER,
  ]),
  recipient: faker.person.fullName(),
  sender: faker.person.fullName(),
  status: faker.helpers.arrayElement([
    LetterStatus.PENDING,
    LetterStatus.RESPONDED,
    LetterStatus.UNSENT,
  ]),
  text: faker.lorem.paragraph(),
  title: faker.lorem.sentence(),
}));
