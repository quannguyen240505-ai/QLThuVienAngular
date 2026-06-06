export interface ResetPasswordRequest {
  gmail: string;
  pin: string;
  newPassword: string;
  confirmNewPassword: string;
}