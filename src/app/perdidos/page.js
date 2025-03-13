'use client';
import { useState, useEffect } from 'react';
import { db } from '@/connection/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '@/components/nav';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Achados() {
    const router = useRouter();
    const [perdidos, setPerdidos] = useState([]);
    const [docPerdidos, setDocPerdidos] = useState([]);
    const [docencontrados, setDocEncontrados] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        city: '',
        state: '',
        breed: '',
        age: '',
        size: '',
        color: '',
        dateRange: {
            start: '',
            end: '',
        },
    });

    useEffect(() => {
        const pegardados = async function () {
            try {
                const collectionRef = collection(db, 'pets');
                const documentoss = await getDocs(collectionRef);
                const petsData = [];
                documentoss.forEach((doc) => {
                    const data = doc.data();
                    // Verifica se a URL da imagem existe e adiciona o ID do documento
                    if (data.photoURL) {
                        petsData.push({
                            ...data,
                            id: doc.id,
                        });
                    }
                });
                setPerdidos(petsData);
            } catch (error) {
                console.error('Erro ao buscar pets:', error);
            } finally {
                setLoading(false);
            }
        };
        pegardados();
    }, []);

    useEffect(() => {
        const verificarPetPerdido = async function () {
            const perdidosArray = perdidos.filter((pet) => pet.category === 'PERDI UM PET');
            const encontradosArray = perdidos.filter((pet) => pet.category === 'ENCONTREI UM PET');
            setDocPerdidos(perdidosArray);
            setDocEncontrados(encontradosArray);
        };
        verificarPetPerdido();
    }, [perdidos]);

    const filteredPets = docPerdidos.filter((pet) => {
        const matchesSearch =
            pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            !searchTerm ||
            pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            !searchTerm ||
            pet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            !searchTerm;

        const matchesFilters =
            (!filters.city || pet.city?.toLowerCase().includes(filters.city.toLowerCase())) &&
            (!filters.state || pet.state?.toLowerCase().includes(filters.state.toLowerCase())) &&
            (!filters.breed || pet.breed?.toLowerCase().includes(filters.breed.toLowerCase())) &&
            (!filters.age || pet.age?.toString().includes(filters.age)) &&
            (!filters.size || pet.size === filters.size) &&
            (!filters.color || pet.color?.toLowerCase().includes(filters.color.toLowerCase())) &&
            (!filters.dateRange.start || !pet.lastSeenDate || new Date(pet.lastSeenDate) >= new Date(filters.dateRange.start)) &&
            (!filters.dateRange.end || !pet.lastSeenDate || new Date(pet.lastSeenDate) <= new Date(filters.dateRange.end));

        return matchesSearch && matchesFilters;
    });

    // Ordenar por data mais recente
    const sortedPets = [...filteredPets].sort((a, b) => {
        if (!a.lastSeenDate) return 1;
        if (!b.lastSeenDate) return -1;
        return new Date(b.lastSeenDate) - new Date(a.lastSeenDate);
    });

    const handlePetClick = (pet) => {
        router.push(`/pet/${pet.id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen p-4">
                <Navbar />
                <div className="text-6xl font-extrabold tracking-wider relative text-transparent bg-clip-text bg-gradient-to-r backdrop-blur-sm from-purple-400 to-blue-500 mt-40 mb-20">
                    <span className="neon">Pets Perdidos</span>
                    <span className="neon-glow"></span>
                </div>

                {/* Barra de Busca e Filtros */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Buscar por nome, raça ou descrição..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Cidade"
                                value={filters.city}
                                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                className="p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Estado"
                                value={filters.state}
                                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                                className="p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Raça"
                                value={filters.breed}
                                onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
                                className="p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                            />
                            <input
                                type="number"
                                placeholder="Idade"
                                value={filters.age}
                                onChange={(e) => setFilters({ ...filters, age: e.target.value })}
                                className="p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <select
                                value={filters.size}
                                onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                                className="p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                            >
                                <option value="">Todos os portes</option>
                                <option value="PEQUENO">Pequeno</option>
                                <option value="MEDIO">Médio</option>
                                <option value="GRANDE">Grande</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Cor"
                                value={filters.color}
                                onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                                className="p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                            />
                            <input
                                type="date"
                                placeholder="Data início"
                                value={filters.dateRange.start}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        dateRange: { ...filters.dateRange, start: e.target.value },
                                    })
                                }
                                className="p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                            />
                            <input
                                type="date"
                                placeholder="Data fim"
                                value={filters.dateRange.end}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        dateRange: { ...filters.dateRange, end: e.target.value },
                                    })
                                }
                                className="p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-gray-600">{filteredPets.length} pets encontrados</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilters({
                                    city: '',
                                    state: '',
                                    breed: '',
                                    age: '',
                                    size: '',
                                    color: '',
                                    dateRange: {
                                        start: '',
                                        end: '',
                                    },
                                });
                            }}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                    {sortedPets.map((pet, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => handlePetClick(pet)}
                        >
                            <div className="relative">
                                <div className="absolute top-0 left-0 right-0 bg-red-500 p-2 text-white font-bold text-center z-10">Perdido</div>
                                <div className="relative w-full h-48">
                                    <Image
                                        src={pet.photoURL}
                                        alt={pet.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={index < 4}
                                    />
                                </div>
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-bold text-gray-800">{pet.name}</h2>
                                <p className="text-gray-600 mt-1">{pet.breed}</p>
                                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{pet.description}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-700 font-semibold">{pet.city}</p>
                                        <p className="text-gray-500 text-sm">{pet.state}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-700">{pet.age} anos</p>
                                        <p className="text-gray-500 text-sm">{pet.weight}kg</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal para visualização da imagem em tamanho maior */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative max-w-4xl w-full">
                            <button
                                className="absolute top-4 right-4 text-white text-xl font-bold bg-red-500 w-8 h-8 rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(null);
                                }}
                            >
                                ×
                            </button>
                            <Image
                                src={selectedImage}
                                alt="Imagem ampliada"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-lg"
                                priority
                            />
                        </div>
                    </div>
                )}

                {filteredPets.length === 0 && (
                    <div className="text-center mt-10">
                        <p className="text-xl text-gray-600">Nenhum pet encontrado com os filtros atuais.</p>
                    </div>
                )}
            </div>
        </>
    );
}
