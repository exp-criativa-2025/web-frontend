"use client";

import Image from 'next/image';
import Button from '../../../../components/Button';

export default function LoginPage() {
  const handleLogin = () => {
    
};

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex lg:invisible flex-1 bg-gray-200 relative ">
        <Image
          src="/academic-donations.png"
          alt="Imagem de login"
          width={862}
          height={862}
          className="object-cover w-full h-screen brightness-75"
        />
      </div>
      <div className="flex-1 flex items-center justify-center bg-[#00000000] lg:bg-[#E3EAD5] h-screen w-screen lg:w-1/2 absolute">
        <div className='w-screen lg:w-[70%] xl:w-full flex flex-col items-center'>
          <div className='mb-8  justify-center hidden lg:block'>
            <Image
              src="/Vector.png"
              alt="Imagem de login"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="w-full max-w-lg bg-gray-50 p-10 rounded-[25px]">
            <form className="space-y-6">

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="fulano@gmail.com"
                  className="mt-1 w-full p-3 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 "
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Digite sua senha"
                  className="mt-1 w-full p-3 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 "
                />
              </div>

              <div className="mt-[50px] flex justify-center">
                <Button
                  text="Entrar"
                  variant="primary"
                  onClick={handleLogin}
                />
              </div>

            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <a href="/modules/auth/register" className="text-blue-600 hover:underline">
                Cadastre-se
              </a>
            </p>
          </div>

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