import { jsonFormat, jsonCompress } from './json';

describe('JSON 工具函数', () => {
  describe('jsonFormat', () => {
    it('应该正确格式化 JSON', () => {
      const input = '{"name":"test","value":123}';
      const expected = JSON.stringify(JSON.parse(input), null, 2);
      expect(jsonFormat(input)).toBe(expected);
    });

    it('应该处理空字符串', () => {
      expect(jsonFormat('')).toBe('');
    });

    it('应该在输入无效 JSON 时抛出错误', () => {
      const input = '{"name":"test",}';
      expect(() => jsonFormat(input)).toThrow('无效的 JSON 数据');
    });
  });

  describe('jsonCompress', () => {
    it('应该正确压缩 JSON', () => {
      const input = '{"name":"test","value":123}';
      const expected = JSON.stringify(JSON.parse(input));
      expect(jsonCompress(input)).toBe(expected);
    });

    it('应该处理空字符串', () => {
      expect(jsonCompress('')).toBe('');
    });

    it('应该在输入无效 JSON 时抛出错误', () => {
      const input = '{"name":"test",}';
      expect(() => jsonCompress(input)).toThrow('无效的 JSON 数据');
    });
  });
});
