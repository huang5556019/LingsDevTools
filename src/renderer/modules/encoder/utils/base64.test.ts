import { base64Encode, base64Decode } from './base64';

describe('Base64 工具函数', () => {
  describe('base64Encode', () => {
    it('应该正确编码文本', () => {
      const input = 'Hello World';
      const expected = 'SGVsbG8gV29ybGQ=';
      expect(base64Encode(input)).toBe(expected);
    });

    it('应该处理空字符串', () => {
      expect(base64Encode('')).toBe('');
    });

    it('应该处理特殊字符', () => {
      const input = '测试123!@#';
      const expected = '5rWL6K+VMTIzIUAj';
      expect(base64Encode(input)).toBe(expected);
    });
  });

  describe('base64Decode', () => {
    it('应该正确解码 Base64', () => {
      const input = 'SGVsbG8gV29ybGQ=';
      const expected = 'Hello World';
      expect(base64Decode(input)).toBe(expected);
    });

    it('应该处理空字符串', () => {
      expect(base64Decode('')).toBe('');
    });

    it('应该处理特殊字符', () => {
      const input = '5rWL6K+VMTIzIUAj';
      const expected = '测试123!@#';
      expect(base64Decode(input)).toBe(expected);
    });

    it('应该在输入无效 Base64 时抛出错误', () => {
      const input = 'invalid-base64';
      expect(() => base64Decode(input)).toThrow('无效的 Base64 编码');
    });
  });
});
