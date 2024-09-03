export interface ApiResponse<T> {
  status: 'success' | 'fail';
  result?: T;
}
