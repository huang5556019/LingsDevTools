import { timestampToDate, dateToTimestamp } from './timestamp';

describe('timestamp utilities', () => {
  describe('timestampToDate', () => {
    test('should convert seconds timestamp to date', () => {
      const timestamp = 1618329600; // 2021-04-14 00:00:00 UTC
      const result = timestampToDate(timestamp);
      expect(result).toBe('2021-04-14 00:00:00');
    });

    test('should convert milliseconds timestamp to date', () => {
      const timestamp = 1618329600000; // 2021-04-14 00:00:00 UTC
      const result = timestampToDate(timestamp);
      expect(result).toBe('2021-04-14 00:00:00');
    });

    test('should convert timestamp with custom format', () => {
      const timestamp = 1618329600;
      const result = timestampToDate(timestamp, 'YYYY/MM/DD');
      expect(result).toBe('2021/04/14');
    });

    test('should throw error for invalid timestamp', () => {
      expect(() => timestampToDate('invalid')).toThrow('Invalid timestamp');
    });

    test('should throw error for out-of-range timestamp', () => {
      expect(() => timestampToDate(Number.MAX_SAFE_INTEGER + 1)).toThrow('Timestamp out of range');
    });
  });

  describe('dateToTimestamp', () => {
    test('should convert date string to timestamp', () => {
      const date = '2021-04-14 00:00:00';
      const result = dateToTimestamp(date);
      expect(result.seconds).toBe(1618329600);
      expect(result.milliseconds).toBe(1618329600000);
    });

    test('should throw error for invalid date', () => {
      expect(() => dateToTimestamp('invalid date')).toThrow('Invalid date');
    });
  });
});
