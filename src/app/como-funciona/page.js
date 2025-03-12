'use client';
import React from 'react';

export default function ComoFunciona() {
    return (
        <div className="flex flex-col p-8 pb-20 gap-40 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start mt-20">
                <h1 className="text-4xl sm:text-8xl font-bold">
                    Como{' '}
                    <strong
                        style={{
                            WebkitTextStroke: '4px #FF00FF',
                            MozTextStroke: '1px #FF00FF',
                            textShadow: '0 0 10px #FF00FF',
                        }}
                        className="text-purple-200"
                    >
                        Funciona
                    </strong>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-10">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                            Perdeu seu Pet?
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-2 rounded-full">
                                    <span className="text-purple-600 font-bold">1</span>
                                </div>
                                <p>Crie um anúncio com todas as informações do seu pet, incluindo fotos recentes.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-2 rounded-full">
                                    <span className="text-purple-600 font-bold">2</span>
                                </div>
                                <p>Compartilhe o anúncio nas redes sociais e com a comunidade local.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-2 rounded-full">
                                    <span className="text-purple-600 font-bold">3</span>
                                </div>
                                <p>Receba notificações quando alguém encontrar um pet com características similares.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                            Encontrou um Pet?
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-2 rounded-full">
                                    <span className="text-purple-600 font-bold">1</span>
                                </div>
                                <p>Registre o pet encontrado com fotos e localização onde foi visto.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-2 rounded-full">
                                    <span className="text-purple-600 font-bold">2</span>
                                </div>
                                <p>Nossa plataforma irá procurar por anúncios compatíveis na região.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-2 rounded-full">
                                    <span className="text-purple-600 font-bold">3</span>
                                </div>
                                <p>Conecte-se com possíveis tutores de forma segura através da nossa plataforma.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-gradient-to-r from-purple-400 to-blue-500 p-8 rounded-lg shadow-lg mt-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
                    <p className="text-lg">
                        Reunir a comunidade para ajudar pets perdidos a encontrarem o caminho de volta para casa. Utilizamos tecnologia avançada e o
                        poder das redes sociais para aumentar as chances de reencontro entre pets e seus tutores.
                    </p>
                </div>

                <div className="mt-8 text-center w-full">
                    <h3 className="text-2xl font-bold mb-4">Pronto para começar?</h3>
                    <div className="flex gap-4 justify-center">
                        <a
                            href="/anunciar"
                            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground bg-gradient-to-tr from-[#ff7b00] to-[#cec002] text-background gap-2 hover:bg-foreground hover:bg-gradient-to-tr hover:from-[#e77171] hover:to-[#ffae00] text-md 2xl:text-base sm:h-12 px-4 sm:px-5"
                        >
                            Criar Anúncio
                        </a>
                        <a
                            href="/perdidos"
                            className="text-md 2xl:text-base rounded-full sm:h-12 px-4 sm:px-5 border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 bg-gradient-to-r from-[#FF00FF] to-[#FF8C00] hover:bg-[#383838] dark:hover:bg-[#ccc] hover:scale-105 transform transition-transform duration-300 ease-in-out"
                        >
                            Ver Pets Perdidos
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
