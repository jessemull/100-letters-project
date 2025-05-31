import {
  correspondenceByIdDeleteUpdate,
  correspondenceByIdLetterUpdate,
  correspondenceByIdUpdate,
  correspondencesDeleteUpdate,
  correspondencesLetterUpdate,
  correspondencesUpdate,
  defaultMerge,
  deleteCorrespondenceLetterUpdate,
  deleteCorrespondenceRecipientUpdate,
  deleteCorrespondenceUpdate,
  deleteRecipientUpdate,
  letterByIdDeleteUpdate,
  letterByIdUpdate,
  lettersDeleteUpdate,
  lettersUpdate,
  recipientByIdCorrespondenceUpdate,
  recipientByIdUpdate,
  recipientsCorrespondenceUpdate,
  recipientsUpdate,
} from './cache';
import { GetLettersResponse, LetterFormResponse } from '@ts-types/letter';
import {
  GetCorrespondencesResponse,
  GetCorrespondenceByIdResponse,
  DeleteCorrespondenceResponse,
  Correspondence,
} from '@ts-types/correspondence';
import {
  GetRecipientsResponse,
  GetRecipientByIdResponse,
  RecipientFormResponse,
  DeleteRecipientResponse,
} from '@ts-types/recipients';

describe('Returns null or prev if data', () => {
  const dummyPrev = { data: [] };

  const baseTests = (fn: Function, name: string) => {
    describe(name, () => {
      it('returns prev if data is missing', () => {
        const result = fn({ prev: dummyPrev, response: {} });
        expect(result).toBe(dummyPrev);
      });

      it('returns null if prev is null', () => {
        const result = fn({ prev: null, response: { data: {} } });
        expect(result).toBeNull();
      });
    });
  };

  baseTests(lettersUpdate, 'lettersUpdate');
  baseTests(letterByIdUpdate, 'letterByIdUpdate');
  baseTests(correspondencesLetterUpdate, 'correspondencesLetterUpdate');
  baseTests(correspondenceByIdLetterUpdate, 'correspondenceByIdLetterUpdate');
  baseTests(lettersDeleteUpdate, 'lettersDeleteUpdate');
  baseTests(correspondencesDeleteUpdate, 'correspondencesDeleteUpdate');
  baseTests(correspondenceByIdDeleteUpdate, 'correspondenceByIdDeleteUpdate');
  baseTests(recipientsCorrespondenceUpdate, 'recipientsCorrespondenceUpdate');
  baseTests(
    recipientByIdCorrespondenceUpdate,
    'recipientByIdCorrespondenceUpdate',
  );
  baseTests(recipientsUpdate, 'recipientsUpdate');
  baseTests(recipientByIdUpdate, 'recipientByIdUpdate');
  baseTests(correspondencesUpdate, 'correspondencesUpdate');
  baseTests(correspondenceByIdUpdate, 'correspondenceByIdUpdate');
  baseTests(deleteCorrespondenceUpdate, 'deleteCorrespondenceUpdate');
  baseTests(
    deleteCorrespondenceLetterUpdate,
    'deleteCorrespondenceLetterUpdate',
  );
  baseTests(
    deleteCorrespondenceRecipientUpdate,
    'deleteCorrespondenceRecipientUpdate',
  );
  baseTests(deleteRecipientUpdate, 'deleteRecipientUpdate');
});

describe('Update Functions', () => {
  const mockLetter = {
    letterId: 'l1',
    correspondenceId: 'c1',
  };

  const mockLetter2 = {
    letterId: 'l2',
    correspondenceId: 'c2',
  };

  const mockLetterResponse = {
    data: mockLetter,
  } as LetterFormResponse;

  const mockLettersPrev = {
    data: [
      { letterId: 'l1', correspondenceId: 'c1' },
      { letterId: 'l2', correspondenceId: 'c1' },
    ],
  } as GetLettersResponse;

  const mockCorrespondence = {
    correspondenceId: 'c1',
    letters: [mockLetter, mockLetter2],
  };

  const mockCorrespondence2 = {
    correspondenceId: 'c2',
    letters: [mockLetter2],
  };

  const mockCorrespondencesPrev = {
    data: [mockCorrespondence, mockCorrespondence2],
  } as GetCorrespondencesResponse;

  const mockCorrespondenceById = {
    data: {
      correspondence: mockCorrespondence,
      letters: [
        { letterId: 'l1', correspondenceId: 'c1' },
        { letterId: 'l2', correspondenceId: 'l2' },
      ],
    },
  } as GetCorrespondenceByIdResponse;

  const mockRecipient = {
    recipientId: 'r1',
  };

  const mockRecipientResponse = {
    data: mockRecipient,
  } as unknown as RecipientFormResponse;

  const mockRecipientsPrev = {
    data: [{ recipientId: 'r1' }, { recipientId: 'r2' }],
  } as GetRecipientsResponse;

  const mockRecipientById = {
    data: { recipientId: 'r1' },
  } as GetRecipientByIdResponse;

  it('Updates letters correctly.', () => {
    const result = lettersUpdate({
      prev: mockLettersPrev,
      response: mockLetterResponse,
    });
    expect(result?.data[0]).toEqual(mockLetter);
  });

  it('Updates letterById correctly.', () => {
    const result = letterByIdUpdate({
      prev: { data: { letterId: 'l1', correspondenceId: 'c1' } },
      response: mockLetterResponse,
    });
    expect(result?.data).toEqual(mockLetter);
  });

  it('Updates correspondences with new letter.', () => {
    const result = correspondencesLetterUpdate({
      prev: mockCorrespondencesPrev,
      response: mockLetterResponse,
    });
    expect(result?.data[0].letters[0]).toEqual(mockLetter);
  });

  it('Updates correspondenceById with new letter.', () => {
    const result = correspondenceByIdLetterUpdate({
      key: 'k',
      prev: mockCorrespondenceById,
      response: mockLetterResponse,
    });
    expect(result?.data.letters[0]).toEqual(mockLetter);
  });

  it('Deletes letter from letters.', () => {
    const result = lettersDeleteUpdate({
      key: 'k',
      prev: mockLettersPrev,
      response: { data: { letterId: 'l1' }, message: '' },
    });
    expect(result?.data).toHaveLength(1);
    expect(result?.data[0].letterId).toBe('l2');
  });

  it('Deletes letter from correspondences.', () => {
    const result = correspondencesDeleteUpdate({
      params: { correspondenceId: 'c1', letterId: 'l1' },
      prev: mockCorrespondencesPrev,
      response: { data: { letterId: 'l1' }, message: '' },
    });
    expect(result?.data[0].letters).toHaveLength(1);
  });

  it('Deletes letter from correspondenceById.', () => {
    const result = correspondenceByIdDeleteUpdate({
      prev: mockCorrespondenceById,
      response: { data: { letterId: 'l1' }, message: '' },
    });
    expect(result?.data.letters).toHaveLength(1);
  });

  it('Updates recipients correspondence.', () => {
    const result = recipientsCorrespondenceUpdate({
      prev: mockRecipientsPrev,
      response: {
        data: { recipient: mockRecipient } as Correspondence,
        message: '',
      },
    });
    expect(result?.data[0].recipientId).toBe('r1');
  });

  it('Updates recipientById correspondence.', () => {
    const result = recipientByIdCorrespondenceUpdate({
      prev: mockRecipientById,
      response: {
        data: { recipient: mockRecipient } as Correspondence,
        message: '',
      },
    });
    expect(result?.data.recipientId).toBe('r1');
  });

  it('Updates recipients.', () => {
    const result = recipientsUpdate({
      prev: mockRecipientsPrev,
      response: mockRecipientResponse,
    });
    expect(result?.data[0].recipientId).toBe('r1');
  });

  it('Updates recipientById.', () => {
    const result = recipientByIdUpdate({
      prev: mockRecipientById,
      response: mockRecipientResponse,
    });
    expect(result?.data.recipientId).toBe('r1');
  });

  it('Updates correspondences.', () => {
    const result = correspondencesUpdate({
      prev: mockCorrespondencesPrev,
      response: { data: mockCorrespondence as Correspondence, message: '' },
    });
    expect(result?.data[0].correspondenceId).toBe('c1');
  });

  it('Updates correspondenceById.', () => {
    const result = correspondenceByIdUpdate({
      prev: mockCorrespondenceById,
      response: { data: mockCorrespondence as Correspondence, message: '' },
    });
    expect(result?.data.correspondence).toEqual(mockCorrespondence);
  });

  it('Deletes correspondence from list.', () => {
    const result = deleteCorrespondenceUpdate({
      prev: mockCorrespondencesPrev,
      response: {
        data: { correspondenceId: 'c1' },
      } as DeleteCorrespondenceResponse,
    });
    expect(result?.data).toHaveLength(1);
  });

  it('Deletes correspondence-linked letters.', () => {
    const result = deleteCorrespondenceLetterUpdate({
      prev: mockLettersPrev,
      response: {
        data: { correspondenceId: 'c1' },
      } as DeleteCorrespondenceResponse,
    });
    expect(result?.data).toHaveLength(0);
  });

  it('Deletes recipient linked to correspondence.', () => {
    const result = deleteCorrespondenceRecipientUpdate({
      prev: mockRecipientsPrev,
      response: { data: { recipientId: 'r1' } } as DeleteCorrespondenceResponse,
    });
    expect(result?.data).toHaveLength(1);
    expect(result?.data[0].recipientId).toBe('r2');
  });

  it('Deletes recipient.', () => {
    const result = deleteRecipientUpdate({
      prev: mockRecipientsPrev,
      response: { data: { recipientId: 'r1' } } as DeleteRecipientResponse,
    });
    expect(result?.data).toHaveLength(1);
    expect(result?.data[0].recipientId).toBe('r2');
  });

  it('Deletes letter by ID.', () => {
    expect(letterByIdDeleteUpdate()).toBeNull();
  });
});

describe('Default Merge', () => {
  it('Returns the page when prev is null.', () => {
    const prev = null;
    const page = { data: [1, 2, 3] };

    const result = defaultMerge(prev, page);

    expect(result).toEqual(page);
  });

  it('Merges data when prev contains empty data array.', () => {
    const prev = { data: [] };
    const page = { data: [1, 2, 3] };

    const result = defaultMerge(prev, page);

    expect(result).toEqual({ data: [1, 2, 3] });
  });

  it('Merges data when prev contains data and page contains additional data.', () => {
    const prev = { data: [1, 2] };
    const page = { data: [3, 4, 5] };

    const result = defaultMerge(prev, page);

    expect(result).toEqual({ data: [1, 2, 3, 4, 5] });
  });

  it('Merges nested data correctly when prev and page have nested data arrays.', () => {
    const prev = {
      data: [
        { id: 1, value: 'a' },
        { id: 2, value: 'b' },
      ],
    };
    const page = {
      data: [
        { id: 3, value: 'c' },
        { id: 4, value: 'd' },
      ],
    };

    const result = defaultMerge(prev, page);

    expect(result).toEqual({
      data: [
        { id: 1, value: 'a' },
        { id: 2, value: 'b' },
        { id: 3, value: 'c' },
        { id: 4, value: 'd' },
      ],
    });
  });

  it('Handles cases where the page contains no data.', () => {
    const prev = { data: [1, 2, 3] };
    const page = { data: [] };

    const result = defaultMerge(prev, page);

    expect(result).toEqual({ data: [1, 2, 3] });
  });

  it('Handles when both prev and page are null.', () => {
    const prev = null;
    const page = null;

    const result = defaultMerge(prev, page);

    expect(result).toEqual(null);
  });
});
