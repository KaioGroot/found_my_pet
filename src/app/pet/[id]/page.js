'use client';
import { useState, useEffect } from 'react';
import { db } from '@/connection/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Image from 'next/image';
import PetMap from '@/components/PetMap';

export default function PetDetails() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const docRef = doc(db, 'pets', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPet({
                        id: docSnap.id,
                        ...docSnap.data(),
                    });
                } else {
                    console.log('Pet não encontrado');
                }
            } catch (error) {
                console.error('Erro ao buscar detalhes do pet:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPetDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Pet não encontrado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4">
            <Navbar />
            <div className="max-w-7xl mx-auto mt-20">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Cabeçalho com imagem principal */}
                    <div className="relative h-[400px] w-full">
                        <Image src={pet.photoURL} alt={pet.name} fill className="object-cover" priority />
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">{pet.category}</div>
                    </div>

                    {/* Informações do pet */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Coluna da esquerda - Informações básicas */}
                            <div>
                                <h1 className="text-4xl font-bold mb-4">{pet.name}</h1>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-purple-100 p-3 rounded-lg">
                                            <p className="text-sm text-gray-600">Raça</p>
                                            <p className="font-semibold">{pet.breed}</p>
                                        </div>
                                        <div className="bg-purple-100 p-3 rounded-lg">
                                            <p className="text-sm text-gray-600">Idade</p>
                                            <p className="font-semibold">{pet.age} anos</p>
                                        </div>
                                        <div className="bg-purple-100 p-3 rounded-lg">
                                            <p className="text-sm text-gray-600">Peso</p>
                                            <p className="font-semibold">{pet.weight}kg</p>
                                        </div>
                                        <div className="bg-purple-100 p-3 rounded-lg">
                                            <p className="text-sm text-gray-600">Porte</p>
                                            <p className="font-semibold">{pet.size || 'Não informado'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                                        <p className="text-gray-600">{pet.description}</p>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">Informações do Desaparecimento</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-purple-100 p-3 rounded-lg">
                                                <p className="text-sm text-gray-600">Data</p>
                                                <p className="font-semibold">
                                                    {pet.lastSeenDate ? new Date(pet.lastSeenDate).toLocaleDateString('pt-BR') : 'Não informado'}
                                                </p>
                                            </div>
                                            <div className="bg-purple-100 p-3 rounded-lg">
                                                <p className="text-sm text-gray-600">Local</p>
                                                <p className="font-semibold">{pet.lastSeenLocation || 'Não informado'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">Localização</h2>
                                        <p className="text-gray-600">
                                            {pet.city}, {pet.state}
                                        </p>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">Contato</h2>
                                        <p className="text-gray-600">{pet.phone}</p>
                                        <p className="text-gray-600">{pet.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Coluna da direita - Mapa */}
                            <div className="h-[400px]">
                                <PetMap selectedPet={pet} />
                            </div>
                        </div>

                        {/* Botões de ação */}
                        <div className="mt-8 flex flex-wrap gap-4">
                            <button
                                onClick={() => window.open(`https://wa.me/${pet.phone}`, '_blank')}
                                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824z" />
                                </svg>
                                Contatar via WhatsApp
                            </button>
                            <button
                                onClick={() => window.open(`mailto:${pet.email}`, '_blank')}
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                                Enviar E-mail
                            </button>

                            {/* Botões de compartilhamento */}
                            <button
                                onClick={() =>
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
                                }
                                className="bg-[#1877f2] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                Compartilhar no Facebook
                            </button>
                            <button
                                onClick={() =>
                                    window.open(
                                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Ajude a encontrar ${
                                            pet.name
                                        }!`,
                                        '_blank'
                                    )
                                }
                                className="bg-[#1da1f2] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                Compartilhar no Twitter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
