export interface CreateUserRequest {
  username: string;
  gmail: string;
  dateOfBirth: string;
  password: string;
  role: string;
  isActive: boolean;
}