export type SignupFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
      data?: {
        name?: string;
        email?: string;
      };
    }
  | undefined;

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
      data?: {
        email?: string;
      };
    }
  | undefined;

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
}
