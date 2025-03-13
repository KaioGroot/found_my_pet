'use client';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/connection/firebase';
import Navbar from '@/components/navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function Encontrados() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtros, setFiltros] = useState({
        porte: '',
        cidade: '',
        dataEncontro: '',
    });

    useEffect(() => {
        const fetchPets = async () => {
            try {
                let q = query(collection(db, 'pets'), where('category', '==', 'ENCONTREI UM PET'), orderBy('createdAt', 'desc'));

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
                if (filtros.cidade) {
                    petsFiltrados = petsFiltrados.filter((pet) => pet.city.toLowerCase().includes(filtros.cidade.toLowerCase()));
                }
                if (filtros.dataEncontro) {
                    petsFiltrados = petsFiltrados.filter((pet) => pet.lastSeenDate === filtros.dataEncontro);
                }

                setPets(petsFiltrados);
            } catch (error) {
                console.error('Erro ao buscar pets:', error);
                setError('Erro ao carregar os pets encontrados. Tente novamente mais tarde.');
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Pets Encontrados</h1>
                    <p className="text-gray-600">Ajude a encontrar os tutores desses pets que foram encontrados.</p>
                </div>

                {/* Filtros */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                                Cidade
                            </label>
                            <input
                                type="text"
                                id="cidade"
                                name="cidade"
                                value={filtros.cidade}
                                onChange={handleFiltroChange}
                                placeholder="Digite a cidade"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="dataEncontro" className="block text-sm font-medium text-gray-700 mb-1">
                                Data do Encontro
                            </label>
                            <input
                                type="date"
                                id="dataEncontro"
                                name="dataEncontro"
                                value={filtros.dataEncontro}
                                onChange={handleFiltroChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
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
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum pet encontrado no momento</h3>
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
                                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">Encontrado</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-gray-900">{pet.name}</h2>
                                    <p className="mt-1 text-gray-600">{pet.breed}</p>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium">Local:</span> {pet.lastSeenLocation}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium">Data:</span> {new Date(pet.lastSeenDate).toLocaleDateString('pt-BR')}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium">Cidade:</span> {pet.city} - {pet.state}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <Link
                                            href={`/pet/${pet.id}`}
                                            className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                                        >
                                            Ver detalhes
                                        </Link>
                                        <Link
                                            href={`https://wa.me/${pet.phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            className="inline-flex items-center text-green-600 hover:text-green-700"
                                        >
                                            <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z" />
                                            </svg>
                                            Contatar
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
