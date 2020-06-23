import {FormatDurationPipe} from './format-duration.pipe';

describe('FormatDurationPipe', () => {
  it('test formatting', () => {
    const pipe = new FormatDurationPipe();
    expect(pipe.transform(60 * 60 + 2 * 60 + 3)).toBe('01:02:03');
    expect(pipe.transform(60 * 60 - 2 * 60 + 3)).toBe('58:03');
    expect(pipe.transform(undefined)).toBe('-');
  });
});
