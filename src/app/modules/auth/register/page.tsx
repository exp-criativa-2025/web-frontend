"use client";

import Image from 'next/image';
import Button from '../../../../components/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/providers/UserProvider';

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { setUser } = useUser();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost/api/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar conta");
      }

      const data = await response.json();
      
      const userData = {
        id: data.user?.id || "1",
        name: name,
        email: email,
        phone: phone,
        role: "User",
        avatar: "/avatars/default.jpg"
      };
      
      setUser(userData);
      router.push("/modules/base/dashboards");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer registro.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/academic-donations.png"
          alt="Imagem de registro"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Treko</h1>
            <p className="text-xl">Sua plataforma de gestão de doações</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-8">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-green-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h2>
              <p className="text-gray-600">Preencha seus dados para começar</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Digite seu nome completo"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="exemplo@gmail.com"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="(11) 99999-9999"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Digite uma senha segura"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4">
                <Button
                  text={isLoading ? "Criando conta..." : "Criar Conta"}
                  variant="primary"
                  onClick={handleRegister}
                  disabled={isLoading}
                />
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{" "}
                <button
                  onClick={() => router.push("/modules/auth/login")}
                  className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile background */}
      <div className="lg:hidden absolute inset-0 -z-10">
        <Image
          src="/academic-donations.png"
          alt="Background"
          fill
          className="object-cover brightness-30"
        />
      </div>
    </div>
  );
}