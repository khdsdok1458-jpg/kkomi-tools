// 웹에서는 토스 SDK 대신 브라우저 localStorage를 씁니다.
export const Storage = {
  async getItem(key: string): Promise<string | null> {
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  async setItem(key: string, value: string): Promise<void> {
    try { window.localStorage.setItem(key, value); } catch { /* 저장 불가 환경 */ }
  },
};
