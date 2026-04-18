export function base64Encode(text: string): string {
  if (!text) {
    return '';
  }
  return btoa(unescape(encodeURIComponent(text)));
}

export function base64Decode(text: string): string {
  if (!text) {
    return '';
  }
  try {
    return decodeURIComponent(escape(atob(text)));
  } catch (error) {
    throw new Error('无效的 Base64 编码');
  }
}
