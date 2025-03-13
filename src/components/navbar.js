'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <nav className="bg-white shadow-lg fixed w-full top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-purple-600">Found My Pet</span>
                        </Link>
                    </div>

                    {/* Menu para desktop */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <Link href="/perdidos" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                            Pets Perdidos
                        </Link>
                        <Link href="/encontrados" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                            Pets Encontrados
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    href="/anunciar"
                                    className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Anunciar Pet
                                </Link>
                                <div className="relative group">
                                    <button className="flex items-center text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                                        <span className="mr-2">{user.name || user.email}</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                                        <div className="py-1">
                                            <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                                                Meu Perfil
                                            </Link>
                                            <Link href="/meus-anuncios" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                                                Meus Anúncios
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                                            >
                                                Sair
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                                    Entrar
                                </Link>
                                <Link
                                    href="/cadastro"
                                    className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Cadastrar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Botão do menu mobile */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 focus:outline-none"
                        >
                            <svg
                                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg
                                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu mobile */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white`}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link
                        href="/perdidos"
                        className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Pets Perdidos
                    </Link>
                    <Link
                        href="/encontrados"
                        className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Pets Encontrados
                    </Link>
                    {user ? (
                        <>
                            <Link
                                href="/anunciar"
                                className="block bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Anunciar Pet
                            </Link>
                            <Link
                                href="/perfil"
                                className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Meu Perfil
                            </Link>
                            <Link
                                href="/meus-anuncios"
                                className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Meus Anúncios
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Entrar
                            </Link>
                            <Link
                                href="/cadastro"
                                className="block bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Cadastrar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
