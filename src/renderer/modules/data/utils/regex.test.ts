import { testRegex, replaceRegex } from './regex';

describe('regex utilities', () => {
  describe('testRegex', () => {
    test('should find matches in text', () => {
      const pattern = 'test';
      const text = 'This is a test. Another test.';
      const result = testRegex(pattern, text, 'g');
      expect(result.matches.length).toBe(2);
      expect(result.matches[0].text).toBe('test');
      expect(result.matches[0].index).toBe(10);
    });

    test('should handle regex flags', () => {
      const pattern = 'test';
      const text = 'This is a Test. Another test.';
      const result = testRegex(pattern, text, 'gi');
      expect(result.matches.length).toBe(2);
    });

    test('should handle groups', () => {
      const pattern = '(test)(\d+)';
      const text = 'test123 test456';
      const result = testRegex(pattern, text, 'g');
      expect(result.matches.length).toBe(2);
    });

    test('should throw error for invalid regex', () => {
      expect(() => testRegex('[invalid', 'text')).toThrow('Invalid regular expression');
    });
  });

  describe('replaceRegex', () => {
    test('should replace matches in text', () => {
      const pattern = 'test';
      const text = 'This is a test. Another test.';
      const replacement = 'example';
      const result = replaceRegex(pattern, text, replacement, 'g');
      expect(result).toBe('This is a example. Another example.');
    });

    test('should handle regex flags', () => {
      const pattern = 'test';
      const text = 'This is a Test. Another test.';
      const replacement = 'example';
      const result = replaceRegex(pattern, text, replacement, 'gi');
      expect(result).toBe('This is a example. Another example.');
    });
  });
});
