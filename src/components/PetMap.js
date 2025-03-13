'use client';
import { useState, useEffect } from 'react';
import { db } from '@/connection/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';

export default function PetMap({ selectedPet }) {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'pets'));
                const petsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPets(petsData);
            } catch (error) {
                console.error('Erro ao buscar pets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // Se tiver um pet selecionado, mostra apenas ele
    const displayPets = selectedPet ? [selectedPet] : pets;

    return (
        <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg w-80">
                <h3 className="text-lg font-semibold mb-4">{selectedPet ? 'Detalhes do Pet' : 'Pets Perdidos no Mapa'}</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {displayPets.map((pet) => (
                        <div key={pet.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                <Image src={pet.photoURL} alt={pet.name} fill className="object-cover" />
                            </div>
                            <div>
                                <h4 className="font-medium">{pet.name}</h4>
                                <p className="text-sm text-gray-600">
                                    {pet.city}, {pet.state}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Aqui você pode integrar um serviço de mapas como Google Maps ou Mapbox */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Integre um serviço de mapas aqui</p>
            </div>
        </div>
    );
}
