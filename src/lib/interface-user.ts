import { postData } from "./api";

// Para o endpoint de criação de usuário (POST /users)

export interface RegisterUserInputDto {
  username?: string;
  userEmail: string;
  userPassword?: string;
  userCpf: string;
  userRoleAtributed: string;
  userBirthdayDate: string;
}

export interface RegisterUserDto {
  username?: string;
  userEmail: string;
  userPassword?: string;
  userCpf: string;
  userRoleAtributed:string;
  userBirthdayDate: Date;
}

export interface UserResponseDto {
  id: number;
  name?: string;
  email: string;
}

// Para o endpoint de login (POST /auth/login)
// export interface LoginDto {
//   email: string;
//   password?: string;
// }

// export interface LoginResponse {
//   accessToken: string;
// }


export const registerUser = (data: RegisterUserInputDto) => {
  return postData<RegisterUserInputDto, UserResponseDto>('/auth/register', data); 
};