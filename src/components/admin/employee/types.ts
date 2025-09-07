export interface User {
  id: string | number;
  username: string;
  name?: string;
  email?: string;
  role: 'admin' | 'employee';
}
