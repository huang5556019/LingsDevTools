import { urlEncode, urlDecode } from './url';

describe('URL 工具函数', () => {
  describe('urlEncode', () => {
    it('应该正确编码 URL', () => {
      const input = 'https://example.com?name=测试';
      const expected = 'https%3A%2F%2Fexample.com%3Fname%3D%E6%B5%8B%E8%AF%95';
      expect(urlEncode(input)).toBe(expected);
    });

    it('应该处理空字符串', () => {
      expect(urlEncode('')).toBe('');
    });

    it('应该处理特殊字符', () => {
      const input = 'https://example.com?a=1&b=2';
      const expected = 'https%3A%2F%2Fexample.com%3Fa%3D1%26b%3D2';
      expect(urlEncode(input)).toBe(expected);
    });
  });

  describe('urlDecode', () => {
    it('应该正确解码 URL', () => {
      const input = 'https%3A%2F%2Fexample.com%3Fname%3D%E6%B5%8B%E8%AF%95';
      const expected = 'https://example.com?name=测试';
      expect(urlDecode(input)).toBe(expected);
    });

    it('应该处理空字符串', () => {
      expect(urlDecode('')).toBe('');
    });

    it('应该处理特殊字符', () => {
      const input = 'https%3A%2F%2Fexample.com%3Fa%3D1%26b%3D2';
      const expected = 'https://example.com?a=1&b=2';
      expect(urlDecode(input)).toBe(expected);
    });

    it('应该在输入无效 URL 编码时抛出错误', () => {
      const input = 'https%3A%2F%2Fexample.com%3Fname%3D%E6%B5%8B%E8%AF%95%zzz';
      expect(() => urlDecode(input)).toThrow('无效的 URL 编码');
    });
  });
});
