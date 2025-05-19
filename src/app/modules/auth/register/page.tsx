"use client";

import Image from 'next/image';
import Button from '../../../../components/Button';
import { FormEvent, useState } from 'react';
import { registerUser } from '@/lib/interface-user';
import { RegisterUserInputDto } from '@/lib/interface-user';
import { redirect } from "next/navigation";

export default function RegisterPage() {

  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const[userCpf, setUserCpf] = useState('');
  const[userBirthdayDate, setUserBirthdayDate] = useState('');
  const[userRoleAtributed, setUserRoleAtributed] = useState('USER')
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!userEmail || !userPassword || !username || !userCpf || !userBirthdayDate ){
      setError("Todos os campos são obrigatórios");
      setIsLoading(false);
      return;
    }

    const userData: 
    RegisterUserInputDto = { 
      username, 
      userEmail, 
      userPassword, 
      userCpf,
      userRoleAtributed: userRoleAtributed || "USER",
      userBirthdayDate:  new Date(userBirthdayDate).toISOString()
      
    };

    try {
      const userForCreate = await registerUser(userData);

      setSuccess(`Usuário ${userForCreate.name} || ${userForCreate.email} criado com sucesso!`);
      setUsername('')
      setUserEmail('')
      setUserPassword('')
      setUserBirthdayDate('')

      setTimeout(() => {
        redirect('/');
      });
    } catch (err: any) {
      setError(err.message || 'Falha ao registrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row @max-lg:bg-image bg-cover bg-no-repeat bg-center">
      <div className="flex lg:invisible flex-1 bg-gray-200 relative static">
        <Image
          src="/academic-donations.png"
          alt="Imagem de login"
          width={862}
          height={862}
          className="object-cover w-full h-screen brightness-75"
          />
      </div>
      <div className="flex-1 flex items-center justify-center bg-[#00000000] lg:bg-[#E3EAD5] h-screen w-screen lg:w-1/2 absolute">
        <div className="w-full max-w-md bg-gray-50 p-10 rounded-[25px] ">
          <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Nome do usuário
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e)=> setUsername(e.target.value)}
                placeholder="Ronaldo Ferreira"
                className="mt-1 w-full p-3 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label
                htmlFor="userEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="userEmail"
                value={userEmail}
                onChange={(e)=> setUserEmail(e.target.value)}
                placeholder="exemplo@gmail.com"
                className="mt-1 w-full p-3 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label
                htmlFor="userPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                type="password"
                id="userPassword"
                value={userPassword}
                onChange={(e)=> setUserPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="mt-1 w-full p-3 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label
                htmlFor="userCpf"
                className="block text-sm font-medium text-gray-700"
              >
                Cpf
              </label>
              <input
                type="text"
                id="userCpf"
                value={userCpf}
                onChange={(e)=> setUserCpf(e.target.value)}
                placeholder="14061026723"
                className="mt-1 w-full p-3 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label
                htmlFor="userBirthdayDate"
                className="block text-sm font-medium text-gray-700"
              >
                Data de Nascimento
              </label>
              <input
                type="date"
                id="userBirthdayDate"
                value={userBirthdayDate}
                onChange={(e)=> setUserBirthdayDate(e.target.value)}
                className="mt-1 w-full p-3 border bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label
                htmlFor="userRoleAtributed"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo de usuário
              </label>
              <select
              value={userRoleAtributed}
              onChange={(e) => setUserRoleAtributed(e.target.value)}
              className="mt-1 w-full p-3 border bg-gray-100 border-gray-300 rounded-md"
            >
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
            </div>

            <Button
              text="Cadastrar"
              variant="primary"
              onClick={ handleSubmit}
              
            />
          </form>
        </div>
      </div>
      <div className="hidden lg:block flex-1 bg-gray-200">
        <Image
          src="/academic-donations.png"
          alt="Imagem de login"
          width={862}
          height={862}
          className="object-cover w-full h-full brightness-75"
        />
      </div>
    </div>
  );
}