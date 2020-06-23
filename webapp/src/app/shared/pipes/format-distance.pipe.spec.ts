import { FormatDistancePipe } from './format-distance.pipe';

describe('FormatDistancePipe', () => {
  it('tests formatting', () => {
    const pipe = new FormatDistancePipe();
    expect(pipe.transform(12000)).toBe('12');
    expect(pipe.transform(12345)).toBe('12,3');
    expect(pipe.transform(undefined)).toBe('-');
  });
});
