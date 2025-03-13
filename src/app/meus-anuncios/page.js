'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/connection/firebase';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function MeusAnuncios() {
    const { user } = useAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const q = query(collection(db, 'pets'), where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const petsData = [];
                querySnapshot.forEach((doc) => {
                    petsData.push({ id: doc.id, ...doc.data() });
                });
                setPets(petsData);
            } catch (error) {
                console.error('Erro ao buscar pets:', error);
                setError('Erro ao carregar seus anúncios. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPets();
        }
    }, [user]);

    const handleDelete = async (petId) => {
        if (!window.confirm('Tem certeza que deseja excluir este anúncio?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'pets', petId));
            setPets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
        } catch (error) {
            console.error('Erro ao excluir anúncio:', error);
            alert('Erro ao excluir anúncio. Tente novamente.');
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
                    <Navbar />
                    <div className="max-w-7xl mx-auto px-4 py-24">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-24">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Meus Anúncios</h1>
                        <Link
                            href="/anunciar"
                            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Novo Anúncio
                        </Link>
                    </div>

                    {error && (
                        <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {pets.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum anúncio encontrado</h3>
                            <p className="mt-1 text-sm text-gray-500">Comece criando um novo anúncio para seu pet.</p>
                            <div className="mt-6">
                                <Link
                                    href="/anunciar"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                    Criar anúncio
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pets.map((pet) => (
                                <div key={pet.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="relative h-48">
                                        <Image
                                            src={pet.photoURL}
                                            alt={pet.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div
                                            className={`absolute top-0 left-0 right-0 px-4 py-2 text-white font-bold text-center ${
                                                pet.category === 'PERDI UM PET' ? 'bg-red-500' : 'bg-green-500'
                                            }`}
                                        >
                                            {pet.category === 'PERDI UM PET' ? 'Perdido' : 'Encontrado'}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-xl font-bold text-gray-900">{pet.name}</h2>
                                        <p className="mt-1 text-gray-600">{pet.breed}</p>
                                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{pet.description}</p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <div className="text-sm text-gray-500">{new Date(pet.createdAt).toLocaleDateString('pt-BR')}</div>
                                            <div className="flex space-x-2">
                                                <Link href={`/pet/${pet.id}`} className="text-purple-600 hover:text-purple-700 font-medium">
                                                    Ver detalhes
                                                </Link>
                                                <button onClick={() => handleDelete(pet.id)} className="text-red-600 hover:text-red-700 font-medium">
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
