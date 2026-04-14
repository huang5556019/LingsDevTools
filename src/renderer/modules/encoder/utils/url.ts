export function urlEncode(url: string): string {
  if (!url) {
    return '';
  }
  return encodeURIComponent(url);
}

export function urlDecode(url: string): string {
  if (!url) {
    return '';
  }
  try {
    return decodeURIComponent(url);
  } catch (error) {
    throw new Error('无效的 URL 编码');
  }
}
