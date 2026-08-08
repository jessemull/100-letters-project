import { toDeleteUploadFileKey } from './uploads';

describe('toDeleteUploadFileKey', () => {
  it('passes through unprocessed ___ keys', () => {
    const key =
      'unprocessed/abc___def___LETTER_FRONT___11111111-1111-1111-1111-111111111111.jpg';
    expect(toDeleteUploadFileKey(key)).toBe(key);
  });

  it('converts seeded images/ _large_N keys to unprocessed form', () => {
    const corr = '6c18f8f5-bc49-4229-8a13-3d3471425f29';
    const letter = '2e5d1072-9dcb-446b-b972-eac5d9e1fc9c';
    const uuid = 'd4f872a4-1e32-4514-870f-1ffeeeb10058';

    expect(
      toDeleteUploadFileKey(
        `images/${corr}/${letter}/LETTER_FRONT/${uuid}_large_8.jpg`,
      ),
    ).toBe(`unprocessed/${corr}___${letter}___LETTER_FRONT___${uuid}.jpg`);
  });

  it('returns unrecognized keys unchanged', () => {
    expect(toDeleteUploadFileKey('not-a-real-key')).toBe('not-a-real-key');
  });
});
