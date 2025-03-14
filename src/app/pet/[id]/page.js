'use client';
import { useState, useEffect } from 'react';
import { db } from '@/connection/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Navbar from '@/components/nav';
import Image from 'next/image';
import PetMap from '@/components/PetMap';
import ReportButton from '@/components/ReportButton';

export default function PetDetails() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPetAndOwner = async () => {
            try {
                const petDoc = await getDoc(doc(db, 'pets', id));
                if (!petDoc.exists()) {
                    throw new Error('Pet não encontrado');
                }

                const petData = petDoc.data();
                setPet({ id: petDoc.id, ...petData });

                // Buscar dados do dono
                const ownerDoc = await getDoc(doc(db, 'users', petData.userId));
                if (ownerDoc.exists()) {
                    setOwner({ id: ownerDoc.id, ...ownerDoc.data() });
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setError('Erro ao carregar os dados do pet. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPetAndOwner();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-24">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !pet) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-24">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error || 'Pet não encontrado'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="md:flex">
                        {/* Imagem do Pet */}
                        <div className="md:flex-shrink-0 relative h-96 md:w-96">
                            <Image
                                src={pet.photoURL || '/placeholder-pet.jpg'}
                                alt={pet.name || 'Pet'}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>

                        {/* Informações do Pet */}
                        <div className="p-8 flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{pet.name || 'Sem nome'}</h1>
                                    <p className="mt-1 text-lg text-gray-600">{pet.breed || 'Raça não informada'}</p>
                                </div>
                                <div className="flex items-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            pet.category === 'ENCONTREI UM PET'
                                                ? 'bg-green-100 text-green-800'
                                                : pet.category === 'PERDI UM PET'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}
                                    >
                                        {pet.category === 'ENCONTREI UM PET'
                                            ? 'Encontrado'
                                            : pet.category === 'PERDI UM PET'
                                            ? 'Perdido'
                                            : 'Para Doação'}
                                    </span>
                                </div>
                            </div>

                            {/* Seção de Recompensa para Pets Perdidos */}
                            {pet.category === 'PERDI UM PET' && pet.reward && (
                                <div className="mt-6">
                                    <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-6 rounded-lg border border-yellow-200 shadow-sm">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-full">
                                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-yellow-800">Recompensa Oferecida!</h3>
                                                <p className="text-2xl font-bold text-yellow-900">
                                                    {typeof pet.reward === 'number' ? `R$ ${pet.reward.toFixed(2)}` : pet.reward}
                                                </p>
                                                <p className="text-sm text-yellow-700 mt-1">Para quem encontrar e devolver com segurança</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Idade</h3>
                                    <p className="mt-1 text-lg text-gray-900">{pet.age || 'Não informada'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Peso</h3>
                                    <p className="mt-1 text-lg text-gray-900">{pet.weight ? `${pet.weight} kg` : 'Não informado'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Cor</h3>
                                    <p className="mt-1 text-lg text-gray-900">{pet.color || 'Não informada'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Porte</h3>
                                    <p className="mt-1 text-lg text-gray-900">{pet.size || 'Não informado'}</p>
                                </div>
                            </div>

                            {pet.category === 'DOACAO' && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-500">Informações para Adoção</h3>
                                    <div className="mt-2 grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-gray-500">Castrado</p>
                                            <p className="font-medium">{pet.castrado === 'SIM' ? 'Sim' : 'Não'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Vacinas</p>
                                            <p className="font-medium">{pet.vacinas || 'Não informado'}</p>
                                        </div>
                                    </div>
                                    {pet.temperamento && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500">Temperamento</p>
                                            <p className="font-medium">{pet.temperamento}</p>
                                        </div>
                                    )}
                                    {pet.requisitos && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500">Requisitos para Adoção</p>
                                            <p className="font-medium">{pet.requisitos}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                                <p className="mt-2 text-gray-600">{pet.description || 'Sem descrição'}</p>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-500">Localização</h3>
                                <p className="mt-2 text-gray-600">
                                    {pet.city && pet.state ? `${pet.city} - ${pet.state}` : 'Localização não informada'}
                                </p>
                                {pet.lastSeenLocation && <p className="mt-1 text-gray-600">Visto por último em: {pet.lastSeenLocation}</p>}
                                {pet.lastSeenDate && (
                                    <p className="mt-1 text-gray-600">Data: {new Date(pet.lastSeenDate).toLocaleDateString('pt-BR')}</p>
                                )}
                            </div>

                            {/* Informações do Dono */}
                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Informações de Contato</h3>
                                        <div className="mt-2">
                                            <p className="text-gray-600">
                                                {owner?.name || 'Usuário'}
                                                {owner?.isVerified && (
                                                    <span className="ml-2 text-blue-600" title="Usuário Verificado">
                                                        ✓
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-gray-600">{pet.userPhone || 'Telefone não informado'}</p>
                                            <p className="text-gray-600">{pet.userEmail || 'Email não informado'}</p>
                                        </div>
                                    </div>
                                    {owner && (
                                        <ReportButton
                                            reportedUserId={owner.id}
                                            reportedUserEmail={owner.email}
                                            contentId={pet.id}
                                            contentType="pet"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div className="mt-8 flex gap-4">
                                {pet.userPhone && (
                                    <a
                                        href={`https://wa.me/55${pet.userPhone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-center flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z" />
                                        </svg>
                                        Contatar via WhatsApp
                                    </a>
                                )}
                                {pet.userEmail && (
                                    <button
                                        onClick={() => (window.location.href = `mailto:${pet.userEmail}`)}
                                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                                    >
                                        Enviar Email
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
