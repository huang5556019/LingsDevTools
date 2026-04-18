import { useHistoryStore } from '../../../store/historyStore';

// 模拟 electronAPI
global.window = global.window || {};
global.window.electronAPI = {
  getAllHistory: jest.fn(),
  getAllFavorites: jest.fn(),
  saveHistory: jest.fn(),
  saveFavorite: jest.fn(),
  deleteHistory: jest.fn(),
  deleteFavorite: jest.fn(),
  clearHistory: jest.fn(),
};

describe('historyStore', () => {
  beforeEach(() => {
    // 清除所有模拟的调用和实例
    jest.clearAllMocks();
  });

  describe('fetchHistory', () => {
    it('should fetch history successfully', async () => {
      const mockHistory = [
        { id: 1, tool_type: 'base64', input: 'test', output: 'dGVzdA==', created_at: '2023-01-01T00:00:00Z' },
        { id: 2, tool_type: 'url', input: 'test', output: 'test', created_at: '2023-01-02T00:00:00Z' },
      ];

      (global.window.electronAPI.getAllHistory as jest.Mock).mockResolvedValue({
        success: true,
        data: mockHistory,
      });

      const { fetchHistory, history } = useHistoryStore.getState();
      await fetchHistory();

      expect(global.window.electronAPI.getAllHistory).toHaveBeenCalled();
      expect(useHistoryStore.getState().history).toEqual(mockHistory);
    });

    it('should handle fetch history failure', async () => {
      (global.window.electronAPI.getAllHistory as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Failed to fetch history',
      });

      const { fetchHistory } = useHistoryStore.getState();
      await fetchHistory();

      expect(global.window.electronAPI.getAllHistory).toHaveBeenCalled();
      expect(useHistoryStore.getState().error).toBe('Failed to fetch history');
    });

    it('should handle fetch history exception', async () => {
      (global.window.electronAPI.getAllHistory as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { fetchHistory } = useHistoryStore.getState();
      await fetchHistory();

      expect(global.window.electronAPI.getAllHistory).toHaveBeenCalled();
      expect(useHistoryStore.getState().error).toBe('Network error');
    });
  });

  describe('fetchFavorites', () => {
    it('should fetch favorites successfully', async () => {
      const mockFavorites = [
        { id: 1, tool_type: 'base64', name: 'Test 1', data: 'test', created_at: '2023-01-01T00:00:00Z' },
        { id: 2, tool_type: 'url', name: 'Test 2', data: 'test', created_at: '2023-01-02T00:00:00Z' },
      ];

      (global.window.electronAPI.getAllFavorites as jest.Mock).mockResolvedValue({
        success: true,
        data: mockFavorites,
      });

      const { fetchFavorites } = useHistoryStore.getState();
      await fetchFavorites();

      expect(global.window.electronAPI.getAllFavorites).toHaveBeenCalledWith(undefined);
      expect(useHistoryStore.getState().favorites).toEqual(mockFavorites);
    });

    it('should fetch favorites with tool type filter', async () => {
      const mockFavorites = [
        { id: 1, tool_type: 'base64', name: 'Test 1', data: 'test', created_at: '2023-01-01T00:00:00Z' },
      ];

      (global.window.electronAPI.getAllFavorites as jest.Mock).mockResolvedValue({
        success: true,
        data: mockFavorites,
      });

      const { fetchFavorites } = useHistoryStore.getState();
      await fetchFavorites('base64');

      expect(global.window.electronAPI.getAllFavorites).toHaveBeenCalledWith({ tool_type: 'base64' });
      expect(useHistoryStore.getState().favorites).toEqual(mockFavorites);
    });

    it('should handle fetch favorites failure', async () => {
      (global.window.electronAPI.getAllFavorites as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Failed to fetch favorites',
      });

      const { fetchFavorites } = useHistoryStore.getState();
      await fetchFavorites();

      expect(global.window.electronAPI.getAllFavorites).toHaveBeenCalled();
      expect(useHistoryStore.getState().error).toBe('Failed to fetch favorites');
    });
  });

  describe('saveHistory', () => {
    it('should save history successfully', async () => {
      const mockRecord = {
        tool_type: 'base64',
        input: 'test',
        output: 'dGVzdA==',
      };

      (global.window.electronAPI.saveHistory as jest.Mock).mockResolvedValue({
        success: true,
      });

      // 模拟 fetchHistory
      (global.window.electronAPI.getAllHistory as jest.Mock).mockResolvedValue({
        success: true,
        data: [],
      });

      const { saveHistory } = useHistoryStore.getState();
      await saveHistory(mockRecord);

      expect(global.window.electronAPI.saveHistory).toHaveBeenCalledWith(mockRecord);
      expect(global.window.electronAPI.getAllHistory).toHaveBeenCalled();
    });

    it('should handle save history failure', async () => {
      const mockRecord = {
        tool_type: 'base64',
        input: 'test',
        output: 'dGVzdA==',
      };

      (global.window.electronAPI.saveHistory as jest.Mock).mockResolvedValue({
        success: false,
      });

      const { saveHistory } = useHistoryStore.getState();
      await saveHistory(mockRecord);

      expect(global.window.electronAPI.saveHistory).toHaveBeenCalledWith(mockRecord);
    });
  });

  describe('saveFavorite', () => {
    it('should save favorite successfully', async () => {
      const mockRecord = {
        tool_type: 'base64',
        name: 'Test',
        data: 'test',
      };

      (global.window.electronAPI.saveFavorite as jest.Mock).mockResolvedValue({
        success: true,
      });

      // 模拟 fetchFavorites
      (global.window.electronAPI.getAllFavorites as jest.Mock).mockResolvedValue({
        success: true,
        data: [],
      });

      const { saveFavorite } = useHistoryStore.getState();
      await saveFavorite(mockRecord);

      expect(global.window.electronAPI.saveFavorite).toHaveBeenCalledWith(mockRecord);
      expect(global.window.electronAPI.getAllFavorites).toHaveBeenCalled();
    });

    it('should handle save favorite failure', async () => {
      const mockRecord = {
        tool_type: 'base64',
        name: 'Test',
        data: 'test',
      };

      (global.window.electronAPI.saveFavorite as jest.Mock).mockResolvedValue({
        success: false,
      });

      const { saveFavorite } = useHistoryStore.getState();
      await saveFavorite(mockRecord);

      expect(global.window.electronAPI.saveFavorite).toHaveBeenCalledWith(mockRecord);
    });
  });

  describe('deleteHistory', () => {
    it('should delete history successfully', async () => {
      const mockIds = [1, 2];

      (global.window.electronAPI.deleteHistory as jest.Mock).mockResolvedValue({
        success: true,
      });

      // 模拟 fetchHistory
      (global.window.electronAPI.getAllHistory as jest.Mock).mockResolvedValue({
        success: true,
        data: [],
      });

      const { deleteHistory } = useHistoryStore.getState();
      await deleteHistory(mockIds);

      expect(global.window.electronAPI.deleteHistory).toHaveBeenCalledWith(mockIds);
      expect(useHistoryStore.getState().selectedIds).toEqual([]);
      expect(global.window.electronAPI.getAllHistory).toHaveBeenCalled();
    });

    it('should handle delete history failure', async () => {
      const mockIds = [1, 2];

      (global.window.electronAPI.deleteHistory as jest.Mock).mockResolvedValue({
        success: false,
      });

      const { deleteHistory } = useHistoryStore.getState();
      await deleteHistory(mockIds);

      expect(global.window.electronAPI.deleteHistory).toHaveBeenCalledWith(mockIds);
    });
  });

  describe('deleteFavorite', () => {
    it('should delete favorite successfully', async () => {
      const mockId = 1;

      (global.window.electronAPI.deleteFavorite as jest.Mock).mockResolvedValue({
        success: true,
      });

      // 模拟 fetchFavorites
      (global.window.electronAPI.getAllFavorites as jest.Mock).mockResolvedValue({
        success: true,
        data: [],
      });

      const { deleteFavorite } = useHistoryStore.getState();
      await deleteFavorite(mockId);

      expect(global.window.electronAPI.deleteFavorite).toHaveBeenCalledWith(mockId);
      expect(global.window.electronAPI.getAllFavorites).toHaveBeenCalled();
    });

    it('should handle delete favorite failure', async () => {
      const mockId = 1;

      (global.window.electronAPI.deleteFavorite as jest.Mock).mockResolvedValue({
        success: false,
      });

      const { deleteFavorite } = useHistoryStore.getState();
      await deleteFavorite(mockId);

      expect(global.window.electronAPI.deleteFavorite).toHaveBeenCalledWith(mockId);
    });
  });

  describe('clearHistory', () => {
    it('should clear history successfully', async () => {
      (global.window.electronAPI.clearHistory as jest.Mock).mockResolvedValue({
        success: true,
      });

      // 模拟 fetchHistory
      (global.window.electronAPI.getAllHistory as jest.Mock).mockResolvedValue({
        success: true,
        data: [],
      });

      const { clearHistory } = useHistoryStore.getState();
      await clearHistory();

      expect(global.window.electronAPI.clearHistory).toHaveBeenCalled();
      expect(useHistoryStore.getState().selectedIds).toEqual([]);
      expect(global.window.electronAPI.getAllHistory).toHaveBeenCalled();
    });

    it('should handle clear history failure', async () => {
      (global.window.electronAPI.clearHistory as jest.Mock).mockResolvedValue({
        success: false,
      });

      const { clearHistory } = useHistoryStore.getState();
      await clearHistory();

      expect(global.window.electronAPI.clearHistory).toHaveBeenCalled();
    });
  });

  describe('toggleSelection', () => {
    it('should toggle selection', () => {
      const { toggleSelection, selectedIds } = useHistoryStore.getState();
      expect(selectedIds).toEqual([]);

      toggleSelection(1);
      expect(useHistoryStore.getState().selectedIds).toEqual([1]);

      toggleSelection(1);
      expect(useHistoryStore.getState().selectedIds).toEqual([]);
    });
  });

  describe('clearSelection', () => {
    it('should clear selection', () => {
      const { toggleSelection, clearSelection } = useHistoryStore.getState();
      toggleSelection(1);
      toggleSelection(2);
      expect(useHistoryStore.getState().selectedIds).toEqual([1, 2]);

      clearSelection();
      expect(useHistoryStore.getState().selectedIds).toEqual([]);
    });
  });

  describe('selectAll', () => {
    it('should select all history items', async () => {
      const mockHistory = [
        { id: 1, tool_type: 'base64', input: 'test', output: 'dGVzdA==', created_at: '2023-01-01T00:00:00Z' },
        { id: 2, tool_type: 'url', input: 'test', output: 'test', created_at: '2023-01-02T00:00:00Z' },
      ];

      (global.window.electronAPI.getAllHistory as jest.Mock).mockResolvedValue({
        success: true,
        data: mockHistory,
      });

      const { fetchHistory, selectAll } = useHistoryStore.getState();
      await fetchHistory();
      selectAll();

      expect(useHistoryStore.getState().selectedIds).toEqual([1, 2]);
    });
  });

  describe('setCurrentTab', () => {
    it('should set current tab', () => {
      const { setCurrentTab } = useHistoryStore.getState();
      expect(useHistoryStore.getState().currentTab).toBe('history');

      setCurrentTab('favorites');
      expect(useHistoryStore.getState().currentTab).toBe('favorites');

      setCurrentTab('history');
      expect(useHistoryStore.getState().currentTab).toBe('history');
    });
  });
});