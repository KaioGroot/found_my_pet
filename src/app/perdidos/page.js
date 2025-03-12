'use client';
import { useState, useEffect } from 'react';
import { db } from '@/connection/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '@/components/navbar';
import Image from 'next/image';

export default function Achados() {
    const [perdidos, setPerdidos] = useState([]);
    const [docPerdidos, setDocPerdidos] = useState([]);
    const [docencontrados, setDocEncontrados] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const pegardados = async function () {
            try {
                const collectionRef = collection(db, 'pets');
                const documentoss = await getDocs(collectionRef);
                const petsData = [];
                documentoss.forEach((doc) => {
                    const data = doc.data();
                    // Verifica se a URL da imagem existe
                    if (data.photoURL) {
                        petsData.push(data);
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                    {docPerdidos.map((pet, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
                        >
                            <div className="relative">
                                <div className="absolute top-0 left-0 right-0 bg-red-500 p-2 text-white font-bold text-center z-10">Perdido</div>
                                <div className="relative w-full h-48">
                                    <Image
                                        src={pet.photoURL}
                                        alt={pet.name}
                                        fill
                                        className="object-cover cursor-pointer"
                                        onClick={() => setSelectedImage(pet.photoURL)}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={index < 4} // Prioriza o carregamento das primeiras 4 imagens
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

                {docPerdidos.length === 0 && (
                    <div className="text-center mt-10">
                        <p className="text-xl text-gray-600">Nenhum pet perdido cadastrado no momento.</p>
                    </div>
                )}
            </div>
        </>
    );
}
