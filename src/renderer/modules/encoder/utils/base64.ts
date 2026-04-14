export function base64Encode(text: string): string {
  if (!text) {
    return '';
  }
  return Buffer.from(text, 'utf8').toString('base64');
}

export function base64Decode(text: string): string {
  if (!text) {
    return '';
  }
  try {
    return Buffer.from(text, 'base64').toString('utf8');
  } catch (error) {
    throw new Error('无效的 Base64 编码');
  }
}
