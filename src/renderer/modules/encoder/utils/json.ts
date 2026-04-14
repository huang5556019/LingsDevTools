export function jsonFormat(json: string): string {
  if (!json) {
    return '';
  }
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    throw new Error('无效的 JSON 数据');
  }
}

export function jsonCompress(json: string): string {
  if (!json) {
    return '';
  }
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('无效的 JSON 数据');
  }
}
