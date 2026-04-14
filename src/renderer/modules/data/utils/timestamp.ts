/**
 * Convert timestamp to date string
 * @param timestamp - Timestamp in seconds or milliseconds
 * @param format - Date format (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted date string
 */
export function timestampToDate(timestamp: string | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  // Convert to number
  const numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;

  // Validate timestamp
  if (isNaN(numTimestamp)) {
    throw new Error('Invalid timestamp');
  }

  // Check if timestamp is in milliseconds (length > 10 digits)
  const isMilliseconds = numTimestamp.toString().length > 10;
  const date = new Date(isMilliseconds ? numTimestamp : numTimestamp * 1000);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp');
  }

  // Check if timestamp is out of range
  if (numTimestamp > Number.MAX_SAFE_INTEGER) {
    throw new Error('Timestamp out of range');
  }

  // Format date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * Convert date string to timestamp
 * @param date - Date string
 * @returns Timestamp object with seconds and milliseconds
 */
export function dateToTimestamp(date: string): { seconds: number; milliseconds: number } {
  const dateObj = new Date(date);

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date');
  }

  const milliseconds = dateObj.getTime();
  const seconds = Math.floor(milliseconds / 1000);

  return { seconds, milliseconds };
}
