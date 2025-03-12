'use client';
import { useState, useEffect } from 'react';
import { db } from '@/connection/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '@/components/navbar';

export default function Achados() {
    const [perdidos, setPerdidos] = useState([]);
    const [docPerdidos, setDocPerdidos] = useState([]);
    const [docencontrados, setDocEncontrados] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(function () {
        const pegardados = async function () {
            const collectionRef = collection(db, 'pets');
            const documentoss = await getDocs(collectionRef);
            const petsData = [];
            documentoss.forEach((doc) => {
                petsData.push(doc.data());
            });
            setPerdidos(petsData);
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
                                <div className="absolute top-0 left-0 right-0 bg-red-500 p-2 text-white font-bold text-center">Perdido</div>
                                <img
                                    src={pet.photoURL}
                                    className="w-full h-48 object-cover cursor-pointer"
                                    alt={pet.name}
                                    onClick={() => setSelectedImage(pet.photoURL)}
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-bold text-gray-800">{pet.name}</h2>
                                <p className="text-gray-600 mt-1">{pet.breed}</p>
                                <p className="text-gray-500 text-sm mt-2">{pet.description}</p>
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
                                onClick={() => setSelectedImage(null)}
                            >
                                ×
                            </button>
                            <img src={selectedImage} alt="Imagem ampliada" className="w-full h-auto rounded-lg" />
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
