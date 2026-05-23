export interface Memo<A> {
  (): A
  clear: () => void
}