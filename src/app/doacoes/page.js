'use client';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/connection/firebase';
import Navbar from '@/components/navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function Doacoes() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtros, setFiltros] = useState({
        porte: '',
        castrado: '',
    });

    useEffect(() => {
        const fetchPets = async () => {
            try {
                let q = query(collection(db, 'pets'), where('category', '==', 'DOACAO'), orderBy('createdAt', 'desc'));

                const querySnapshot = await getDocs(q);
                const petsData = [];
                querySnapshot.forEach((doc) => {
                    petsData.push({ id: doc.id, ...doc.data() });
                });

                // Aplicar filtros
                let petsFiltrados = petsData;
                if (filtros.porte) {
                    petsFiltrados = petsFiltrados.filter((pet) => pet.size === filtros.porte);
                }
                if (filtros.castrado) {
                    petsFiltrados = petsFiltrados.filter((pet) => pet.castrado === filtros.castrado);
                }

                setPets(petsFiltrados);
            } catch (error) {
                console.error('Erro ao buscar pets:', error);
                setError('Erro ao carregar os pets para doação. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, [filtros]);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Pets para Doação</h1>
                    <p className="text-gray-600">Encontre seu novo melhor amigo! Todos os pets disponíveis para adoção responsável.</p>
                </div>

                {/* Filtros */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="porte" className="block text-sm font-medium text-gray-700 mb-1">
                                Porte
                            </label>
                            <select
                                id="porte"
                                name="porte"
                                value={filtros.porte}
                                onChange={handleFiltroChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="">Todos</option>
                                <option value="PEQUENO">Pequeno</option>
                                <option value="MEDIO">Médio</option>
                                <option value="GRANDE">Grande</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="castrado" className="block text-sm font-medium text-gray-700 mb-1">
                                Castrado
                            </label>
                            <select
                                id="castrado"
                                name="castrado"
                                value={filtros.castrado}
                                onChange={handleFiltroChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="">Todos</option>
                                <option value="SIM">Sim</option>
                                <option value="NAO">Não</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {pets.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum pet disponível para doação no momento</h3>
                        <p className="mt-1 text-sm text-gray-500">Tente novamente mais tarde ou ajuste os filtros de busca.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map((pet) => (
                            <div key={pet.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative h-48">
                                    <Image
                                        src={pet.photoURL}
                                        alt={pet.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute top-0 right-0 m-2">
                                        <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-sm">
                                            {pet.castrado === 'SIM' ? 'Castrado' : 'Não castrado'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-gray-900">{pet.name}</h2>
                                    <p className="mt-1 text-gray-600">{pet.breed}</p>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium">Porte:</span> {pet.size}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium">Idade:</span> {pet.age} anos
                                        </p>
                                        {pet.vacinas && (
                                            <p className="text-sm text-gray-500">
                                                <span className="font-medium">Vacinas:</span> {pet.vacinas}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href={`/pet/${pet.id}`}
                                            className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                                        >
                                            Ver detalhes
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
