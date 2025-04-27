import { GetLettersResponse } from '@ts-types/letter';
import {
  onLetterUpdate,
  onCorrespondenceUpdate,
  onCorrespondenceLetterUpdate,
  onRecipientUpdate,
} from './cache';
import {
  GetCorrespondenceByIdResponse,
  GetCorrespondencesResponse,
} from '@ts-types/correspondence';
import { GetRecipientsResponse } from '@ts-types/recipients';

describe('onLetterUpdate', () => {
  it('Returns prev if next is falsy', () => {
    expect(
      onLetterUpdate({ prev: null, params: { letterId: '123' } }),
    ).toBeNull();
  });

  it('Removes the letter with matching letterId', () => {
    const prev = {
      data: [{ letterId: '1' }, { letterId: '2' }],
      lastEvaluatedKey: null,
    };
    const result = onLetterUpdate({
      prev,
      params: { letterId: '1' },
    }) as GetLettersResponse;
    expect(result.data).toEqual([{ letterId: '2' }]);
    expect(result.lastEvaluatedKey).toBeNull();
  });

  it('Handles missing params gracefully', () => {
    const prev = {
      data: [{ letterId: '1' }, { letterId: '2' }],
      lastEvaluatedKey: null,
    };
    const result = onLetterUpdate({ prev }) as GetLettersResponse;
    expect(result.data).toHaveLength(2);
  });
});

describe('onCorrespondenceUpdate', () => {
  it('Returns prev if next is falsy', () => {
    expect(
      onCorrespondenceUpdate({
        prev: null,
        params: { correspondenceId: 'abc' },
      }),
    ).toBeNull();
  });

  it('Removes the correspondence with matching correspondenceId', () => {
    const prev = {
      data: [{ correspondenceId: 'abc' }, { correspondenceId: 'def' }],
      lastEvaluatedKey: null,
    };
    const result = onCorrespondenceUpdate({
      prev,
      params: { correspondenceId: 'abc' },
    }) as GetCorrespondencesResponse;
    expect(result.data).toEqual([{ correspondenceId: 'def' }]);
    expect(result.lastEvaluatedKey).toBeNull();
  });

  it('Handles missing params gracefully', () => {
    const prev = {
      data: [{ correspondenceId: 'abc' }, { correspondenceId: 'def' }],
      lastEvaluatedKey: null,
    };
    const result = onCorrespondenceUpdate({
      prev,
    }) as GetCorrespondencesResponse;
    expect(result.data).toHaveLength(2);
  });
});

describe('onCorrespondenceLetterUpdate', () => {
  it('Returns prev if next is falsy', () => {
    expect(
      onCorrespondenceLetterUpdate({ prev: null, params: { letterId: '123' } }),
    ).toBeNull();
  });

  it('Removes the letter with matching letterId from correspondence', () => {
    const prev = {
      data: {
        letters: [{ letterId: '1' }, { letterId: '2' }],
      },
    };
    const result = onCorrespondenceLetterUpdate({
      prev,
      params: { letterId: '1' },
    }) as GetCorrespondenceByIdResponse;
    expect(result.data.letters).toEqual([{ letterId: '2' }]);
  });

  it('Handles missing params gracefully', () => {
    const prev = {
      data: {
        letters: [{ letterId: '1' }, { letterId: '2' }],
      },
    };
    const result = onCorrespondenceLetterUpdate({
      prev,
    }) as GetCorrespondenceByIdResponse;
    expect(result.data.letters).toHaveLength(2);
  });
});

describe('onRecipientUpdate', () => {
  it('Returns prev if next is falsy', () => {
    expect(
      onRecipientUpdate({ prev: null, params: { recipientId: 'xyz' } }),
    ).toBeNull();
  });

  it('Removes the recipient with matching recipientId', () => {
    const prev = {
      data: [{ recipientId: 'xyz' }, { recipientId: 'uvw' }],
      lastEvaluatedKey: null,
    };
    const result = onRecipientUpdate({
      prev,
      params: { recipientId: 'xyz' },
    }) as GetRecipientsResponse;
    expect(result.data).toEqual([{ recipientId: 'uvw' }]);
    expect(result.lastEvaluatedKey).toBeNull();
  });

  it('Handles missing params gracefully', () => {
    const prev = {
      data: [{ recipientId: 'xyz' }, { recipientId: 'uvw' }],
      lastEvaluatedKey: null,
    };
    const result = onRecipientUpdate({ prev }) as GetRecipientsResponse;
    expect(result.data).toHaveLength(2);
  });
});
