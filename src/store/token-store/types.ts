export interface State {
  token: { value: string; isLoading: boolean };
  addToken: (token: string) => void;
  loadStore: () => void;
  deleteToken: () => void;
}
