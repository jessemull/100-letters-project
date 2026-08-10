import { flattenValidators, get, set } from './form';

describe('form utils', () => {
  it('flattens nested validators to dotted paths', () => {
    const required = () => 'Required';
    const flat = flattenValidators<{
      firstName: string;
      address: { city: string };
    }>({
      firstName: [required],
      address: {
        city: [required],
      },
    });

    expect(flat.firstName).toEqual([required]);
    expect(flat['address.city']).toEqual([required]);
  });

  it('gets and sets nested values immutably', () => {
    const source = {
      firstName: 'Ada',
      address: { city: 'Portland', state: 'OR' },
    };

    expect(get(source, 'address.city')).toBe('Portland');

    const next = set(source, 'address.city', 'Seattle');
    expect(next.address.city).toBe('Seattle');
    expect(source.address.city).toBe('Portland');
  });
});
