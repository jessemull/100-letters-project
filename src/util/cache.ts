import {
  CorrespondenceFormResponse,
  DeleteCorrespondenceResponse,
  GetCorrespondenceByIdResponse,
  GetCorrespondencesResponse,
} from '@ts-types/correspondence';
import {
  DeleteLetterParams,
  DeleteLetterResponse,
  GetLetterByIdResponse,
  GetLettersResponse,
  LetterFormResponse,
} from '@ts-types/letter';
import {
  DeleteRecipientResponse,
  GetRecipientByIdResponse,
  GetRecipientsResponse,
  RecipientFormResponse,
} from '@ts-types/recipients';

export const lettersUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: LetterFormResponse;
}): GetLettersResponse | null => {
  const data = response?.data;
  const prev = previous as GetLettersResponse;

  if (!data) return prev;
  if (!prev) return null;

  const next = prev?.data.map((letter) =>
    letter.letterId === data.letterId ? data : letter,
  );

  return {
    ...prev,
    data: next,
  };
};

export const letterByIdUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: LetterFormResponse;
}): GetLetterByIdResponse | null => {
  const data = response?.data;
  const prev = previous as GetLetterByIdResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data,
  };
};

export const correspondencesLetterUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: LetterFormResponse;
}): GetCorrespondencesResponse | null => {
  const data = response?.data;
  const prev = previous as GetCorrespondencesResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data: prev.data.map((correspondence) =>
      correspondence.correspondenceId === data.correspondenceId
        ? {
            ...correspondence,
            letters: correspondence.letters.map((letter) =>
              letter.letterId === data.letterId ? data : letter,
            ),
          }
        : correspondence,
    ),
  };
};

export const correspondenceByIdLetterUpdate = ({
  prev: previous,
  response,
}: {
  key: string;
  prev: unknown;
  response?: LetterFormResponse;
}): GetCorrespondenceByIdResponse | null => {
  const data = response?.data;
  const prev = previous as GetCorrespondenceByIdResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data: {
      ...prev.data,
      letters: prev.data.letters.map((letter) =>
        letter.letterId === data.letterId ? data : letter,
      ),
    },
  };
};

export const lettersDeleteUpdate = ({
  prev: previous,
  response,
}: {
  key: string;
  prev: unknown;
  response?: DeleteLetterResponse;
}): GetLettersResponse | null => {
  const data = response?.data;
  const prev = previous as GetLettersResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data: prev.data.filter((letter) => letter.letterId !== data.letterId),
  };
};

export const letterByIdDeleteUpdate = () => {
  return null;
};

export const correspondencesDeleteUpdate = ({
  params,
  prev: previous,
  response,
}: {
  params?: DeleteLetterParams;
  prev: unknown;
  response?: DeleteLetterResponse;
}): GetCorrespondencesResponse | null => {
  const data = response?.data;
  const prev = previous as GetCorrespondencesResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data: prev.data.map((correspondence) =>
      correspondence.correspondenceId === params?.correspondenceId
        ? {
            ...correspondence,
            letters: correspondence.letters.filter(
              (letter) => letter.letterId !== data.letterId,
            ),
          }
        : correspondence,
    ),
  };
};

export const correspondenceByIdDeleteUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: DeleteLetterResponse;
}): GetCorrespondenceByIdResponse | null => {
  const data = response?.data;
  const prev = previous as GetCorrespondenceByIdResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data: {
      ...prev.data,
      letters: prev.data.letters.filter(
        (letter) => letter.letterId !== data.letterId,
      ),
    },
  };
};

export const recipientsCorrespondenceUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: CorrespondenceFormResponse;
}): GetRecipientsResponse | null => {
  const data = response?.data;
  const prev = previous as GetRecipientsResponse;

  if (!data) return prev;
  if (!prev) return null;

  const next = prev?.data.map((recipient) =>
    recipient.recipientId === data.recipient.recipientId
      ? data.recipient
      : recipient,
  );

  return {
    ...prev,
    data: next,
  };
};

export const recipientByIdCorrespondenceUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: CorrespondenceFormResponse;
}): GetRecipientByIdResponse | null => {
  const data = response?.data;
  const prev = previous as GetRecipientByIdResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data: data.recipient,
  };
};

export const recipientsUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: RecipientFormResponse;
}): GetRecipientsResponse | null => {
  const data = response?.data;
  const prev = previous as GetRecipientsResponse;

  if (!data) return prev;
  if (!prev) return null;

  const next = prev?.data.map((recipient) =>
    recipient.recipientId === data.recipientId ? data : recipient,
  );

  return {
    ...prev,
    data: next,
  };
};

export const recipientByIdUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: RecipientFormResponse;
}): GetRecipientByIdResponse | null => {
  const data = response?.data;
  const prev = previous as GetRecipientByIdResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data,
  };
};

export const correspondencesUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: CorrespondenceFormResponse;
}): GetCorrespondencesResponse | null => {
  const data = response?.data;
  const prev = previous as GetCorrespondencesResponse;

  if (!data) return prev;
  if (!prev) return null;

  const next = prev?.data.map((correspondence) =>
    correspondence.correspondenceId === data.correspondenceId
      ? data
      : correspondence,
  );

  return {
    ...prev,
    data: next,
  };
};

export const correspondenceByIdUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: CorrespondenceFormResponse;
}): GetCorrespondenceByIdResponse | null => {
  const data = response?.data;
  const prev = previous as GetCorrespondenceByIdResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data: {
      ...prev?.data,
      correspondence: data,
    },
  };
};

export const deleteCorrespondenceUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: DeleteCorrespondenceResponse;
}): GetCorrespondencesResponse | null => {
  const data = response?.data;
  const prev = previous as GetCorrespondencesResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data: prev.data.filter(
      (correspondence) =>
        correspondence.correspondenceId !== data.correspondenceId,
    ),
  };
};

export const deleteCorrespondenceLetterUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: DeleteCorrespondenceResponse;
}): GetLettersResponse | null => {
  const data = response?.data;
  const prev = previous as GetLettersResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data: prev.data.filter(
      (letter) => letter.correspondenceId !== data.correspondenceId,
    ),
  };
};

export const deleteCorrespondenceRecipientUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: DeleteCorrespondenceResponse;
}): GetRecipientsResponse | null => {
  const data = response?.data;
  const prev = previous as GetRecipientsResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data: prev.data.filter(
      (recipient) => recipient.recipientId !== data.recipientId,
    ),
  };
};

export const deleteRecipientUpdate = ({
  prev: previous,
  response,
}: {
  prev: unknown;
  response?: DeleteRecipientResponse;
}): GetRecipientsResponse | null => {
  const data = response?.data;
  const prev = previous as GetRecipientsResponse;

  if (!data) return prev;
  if (!prev) return null;

  return {
    ...prev,
    data: prev.data.filter(
      (recipient) => recipient.recipientId !== data.recipientId,
    ),
  };
};

export const defaultMerge = <T>(prev: unknown | null, page: unknown): T => {
  if (!prev) {
    return page as T;
  }
  return {
    ...(page as T),
    data: [
      ...(prev as { data: unknown[] }).data,
      ...(page as { data: unknown[] }).data,
    ],
  } as T;
};
