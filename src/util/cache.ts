import {
  CorrespondenceLetterParams,
  CorrespondenceParams,
  GetCorrespondenceByIdResponse,
  GetCorrespondencesResponse,
} from '@ts-types/correspondence';
import { GetLettersResponse } from '@ts-types/letter';
import { GetRecipientsResponse, RecipientParams } from '@ts-types/recipients';

export const onLetterUpdate = ({
  prev,
  params,
}: {
  prev: unknown;
  params?: CorrespondenceLetterParams;
}) => {
  const next = prev as GetLettersResponse;

  if (!next) return prev;

  return {
    data: next.data.filter((letter) => letter.letterId !== params?.letterId),
    lastEvaluatedKey: next.lastEvaluatedKey,
  };
};

export const onCorrespondenceUpdate = ({
  prev,
  params,
}: {
  prev: unknown;
  params?: CorrespondenceParams;
}) => {
  const next = prev as GetCorrespondencesResponse;

  if (!next) return prev;

  return {
    data: next.data.filter(
      (correspondence) =>
        correspondence.correspondenceId !== params?.correspondenceId,
    ),
    lastEvaluatedKey: next.lastEvaluatedKey,
  };
};

export const onCorrespondenceLetterUpdate = ({
  prev,
  params,
}: {
  prev: unknown;
  params?: CorrespondenceLetterParams;
}) => {
  const next = prev as GetCorrespondenceByIdResponse;

  if (!next) return prev;

  const updatedLetters = next.data.letters.filter(
    (letter) => letter.letterId !== params?.letterId,
  );

  return {
    ...next,
    data: {
      ...next.data,
      letters: updatedLetters,
    },
  };
};

export const onRecipientUpdate = ({
  prev,
  params,
}: {
  prev: unknown;
  params?: RecipientParams;
}) => {
  const next = prev as GetRecipientsResponse;

  if (!next) return prev;

  return {
    data: next.data.filter(
      (recipient) => recipient.recipientId !== params?.recipientId,
    ),
    lastEvaluatedKey: next.lastEvaluatedKey,
  };
};
