import { Factory } from 'fishery';
import {
  Letter,
  LetterImage,
  LetterMethod,
  LetterMimeType,
  LetterType,
  View,
} from '@ts-types/letter';
import { Status } from '@ts-types/correspondence';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export const LetterImageFactory = Factory.define<LetterImage>(() => ({
  id: uuidv4(),
  url: faker.image.url(),
  view: faker.helpers.arrayElement([
    View.ENVELOPE_FRONT,
    View.ENVELOPE_BACK,
    View.LETTER_FRONT,
    View.LETTER_BACK,
  ]),
  caption: faker.lorem.sentence(),
  dateUploaded: faker.date.past().toISOString(),
  mimeType: faker.helpers.arrayElement([
    LetterMimeType.JPEG,
    LetterMimeType.PNG,
    LetterMimeType.WEBP,
    LetterMimeType.GIF,
  ]),
  sizeInBytes: faker.number.int({ min: 50000, max: 5000000 }), // ~50KB–5MB
  uploadedBy: faker.internet.email(),
}));

export const LetterFactory = Factory.define<Letter>(() => ({
  correspondenceId: uuidv4(),
  createdAt: faker.date.past().toISOString(),
  description: faker.lorem.sentence(),
  imageURLs: LetterImageFactory.buildList(2),
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
