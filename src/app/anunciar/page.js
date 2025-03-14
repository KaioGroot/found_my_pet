'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db, storage } from '@/connection/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/navbar';

export default function Anunciar() {
    const { user } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [pet, setPet] = useState({
        category: '',
        name: '',
        species: '',
        breed: '',
        age: '',
        weight: '',
        color: '',
        size: '',
        gender: '',
        lastSeenDate: '',
        lastSeenLocation: '',
        city: '',
        state: '',
        description: '',
        photoURL: '',
        userId: user?.uid || '',
        userEmail: user?.email || '',
        userPhone: user?.phone || '',
        status: 'ATIVO',
        createdAt: new Date(),
        // Campos específicos para doação
        castrado: '',
        temperamento: '',
        requisitos: '',
        // Campos específicos para perdidos/encontrados
        collar: '',
        chip: '',
        reward: '',
    });

    const steps = [
        {
            title: 'Tipo de Anúncio',
            description: 'Selecione o tipo de anúncio que deseja criar',
        },
        {
            title: 'Informações Básicas',
            description: 'Dados básicos do pet',
        },
        {
            title: 'Características',
            description: 'Características físicas do pet',
        },
        {
            title: 'Localização',
            description: 'Onde o pet foi visto pela última vez',
        },
        {
            title: 'Detalhes Adicionais',
            description: 'Informações complementares',
        },
    ];

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setPet({ ...pet, photo: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Você precisa estar logado para criar um anúncio');
            return;
        }

        if (!pet.photo) {
            alert('Por favor, selecione uma foto do pet');
            return;
        }

        try {
            setLoading(true);

            // Upload da imagem para o Vercel Blob
            const formData = new FormData();
            formData.append('file', pet.photo);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Erro ao fazer upload da imagem');
            }

            // Se chegou aqui, o upload da imagem foi bem sucedido
            const petData = {
                ...pet,
                photoURL: data.fileUrl,
                userId: user.uid,
                userEmail: user.email,
                userPhone: user.phone || '',
                createdAt: new Date(),
            };

            delete petData.photo;

            // Criar o documento do pet no Firestore
            const docRef = await addDoc(collection(db, 'pets'), petData);

            // Atualizar o documento com seu próprio ID
            await updateDoc(docRef, {
                id: docRef.id,
            });

            alert('Anúncio criado com sucesso!');
            router.push('/');
        } catch (error) {
            console.error('Erro ao criar anúncio:', error);
            alert('Erro ao criar anúncio. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <label htmlFor="category" className="font-bold mb-2">
                            Tipo de Anúncio
                        </label>
                        <select
                            id="category"
                            value={pet.category}
                            onChange={(e) => setPet({ ...pet, category: e.target.value })}
                            className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                            required
                        >
                            <option value="">Selecione uma opção</option>
                            <option value="PERDI UM PET">Perdi um Pet</option>
                            <option value="ENCONTREI UM PET">Encontrei um Pet</option>
                            <option value="DOACAO">Pet para Doação</option>
                        </select>

                        <div className="mt-8">
                            <label className="font-bold mb-2 block">Foto do Pet</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" required />
                            {preview && (
                                <div className="mt-4">
                                    <img src={preview} alt="Preview" className="max-w-xs rounded-lg" />
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="font-bold mb-2">
                                Nome do Pet
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={pet.name}
                                onChange={(e) => setPet({ ...pet, name: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                placeholder="Nome do pet (se souber)"
                            />
                        </div>

                        <div>
                            <label htmlFor="species" className="font-bold mb-2">
                                Espécie
                            </label>
                            <select
                                id="species"
                                value={pet.species}
                                onChange={(e) => setPet({ ...pet, species: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                required
                            >
                                <option value="">Selecione uma espécie</option>
                                <option value="CACHORRO">Cachorro</option>
                                <option value="GATO">Gato</option>
                                <option value="OUTRO">Outro</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="breed" className="font-bold mb-2">
                                Raça
                            </label>
                            <input
                                type="text"
                                id="breed"
                                value={pet.breed}
                                onChange={(e) => setPet({ ...pet, breed: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                placeholder="Raça do pet (se souber)"
                            />
                        </div>

                        <div>
                            <label htmlFor="gender" className="font-bold mb-2">
                                Sexo
                            </label>
                            <select
                                id="gender"
                                value={pet.gender}
                                onChange={(e) => setPet({ ...pet, gender: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                required
                            >
                                <option value="">Selecione o sexo</option>
                                <option value="MACHO">Macho</option>
                                <option value="FEMEA">Fêmea</option>
                                <option value="NAO_IDENTIFICADO">Não Identificado</option>
                            </select>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="age" className="font-bold mb-2">
                                Idade Aproximada
                            </label>
                            <input
                                type="text"
                                id="age"
                                value={pet.age}
                                onChange={(e) => setPet({ ...pet, age: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                placeholder="Ex: 2 anos, 6 meses..."
                            />
                        </div>

                        <div>
                            <label htmlFor="size" className="font-bold mb-2">
                                Porte
                            </label>
                            <select
                                id="size"
                                value={pet.size}
                                onChange={(e) => setPet({ ...pet, size: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                required
                            >
                                <option value="">Selecione o porte</option>
                                <option value="PEQUENO">Pequeno</option>
                                <option value="MEDIO">Médio</option>
                                <option value="GRANDE">Grande</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="color" className="font-bold mb-2">
                                Cor
                            </label>
                            <input
                                type="text"
                                id="color"
                                value={pet.color}
                                onChange={(e) => setPet({ ...pet, color: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                placeholder="Ex: preto com manchas brancas"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="weight" className="font-bold mb-2">
                                Peso Aproximado (kg)
                            </label>
                            <input
                                type="number"
                                id="weight"
                                value={pet.weight}
                                onChange={(e) => setPet({ ...pet, weight: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                placeholder="Ex: 10"
                            />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="lastSeenDate" className="font-bold mb-2">
                                {pet.category === 'DOACAO' ? 'Data de Disponibilidade' : 'Data em que foi visto pela última vez'}
                            </label>
                            <input
                                type="date"
                                id="lastSeenDate"
                                value={pet.lastSeenDate}
                                onChange={(e) => setPet({ ...pet, lastSeenDate: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="lastSeenLocation" className="font-bold mb-2">
                                {pet.category === 'DOACAO' ? 'Endereço' : 'Local onde foi visto pela última vez'}
                            </label>
                            <input
                                type="text"
                                id="lastSeenLocation"
                                value={pet.lastSeenLocation}
                                onChange={(e) => setPet({ ...pet, lastSeenLocation: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                placeholder="Ex: Próximo ao mercado X"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="city" className="font-bold mb-2">
                                Cidade
                            </label>
                            <input
                                type="text"
                                id="city"
                                value={pet.city}
                                onChange={(e) => setPet({ ...pet, city: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="state" className="font-bold mb-2">
                                Estado
                            </label>
                            <input
                                type="text"
                                id="state"
                                value={pet.state}
                                onChange={(e) => setPet({ ...pet, state: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                required
                            />
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        {pet.category !== 'DOACAO' && (
                            <>
                                <div>
                                    <label htmlFor="collar" className="font-bold mb-2">
                                        Coleira
                                    </label>
                                    <select
                                        id="collar"
                                        value={pet.collar}
                                        onChange={(e) => setPet({ ...pet, collar: e.target.value })}
                                        className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                    >
                                        <option value="">Selecione uma opção</option>
                                        <option value="SIM">Sim</option>
                                        <option value="NAO">Não</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="chip" className="font-bold mb-2">
                                        Microchip
                                    </label>
                                    <select
                                        id="chip"
                                        value={pet.chip}
                                        onChange={(e) => setPet({ ...pet, chip: e.target.value })}
                                        className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                    >
                                        <option value="">Selecione uma opção</option>
                                        <option value="SIM">Sim</option>
                                        <option value="NAO">Não</option>
                                        <option value="NAO_SEI">Não sei</option>
                                    </select>
                                </div>

                                {pet.category === 'PERDI UM PET' && (
                                    <div>
                                        <label htmlFor="reward" className="font-bold mb-2">
                                            Recompensa
                                        </label>
                                        <input
                                            type="text"
                                            id="reward"
                                            value={pet.reward}
                                            onChange={(e) => setPet({ ...pet, reward: e.target.value })}
                                            className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                            placeholder="Valor da recompensa (opcional)"
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {pet.category === 'DOACAO' && (
                            <>
                                <div>
                                    <label htmlFor="castrado" className="font-bold mb-2">
                                        Castrado
                                    </label>
                                    <select
                                        id="castrado"
                                        value={pet.castrado}
                                        onChange={(e) => setPet({ ...pet, castrado: e.target.value })}
                                        className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                    >
                                        <option value="">Selecione uma opção</option>
                                        <option value="SIM">Sim</option>
                                        <option value="NAO">Não</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="temperamento" className="font-bold mb-2">
                                        Temperamento
                                    </label>
                                    <textarea
                                        id="temperamento"
                                        value={pet.temperamento}
                                        onChange={(e) => setPet({ ...pet, temperamento: e.target.value })}
                                        className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                        placeholder="Descreva o temperamento do pet (dócil, brincalhão, etc.)"
                                        rows="3"
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="requisitos" className="font-bold mb-2">
                                        Requisitos para Adoção
                                    </label>
                                    <textarea
                                        id="requisitos"
                                        value={pet.requisitos}
                                        onChange={(e) => setPet({ ...pet, requisitos: e.target.value })}
                                        className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                        placeholder="Ex: Termo de adoção, visita prévia, etc."
                                        rows="3"
                                    ></textarea>
                                </div>
                            </>
                        )}

                        <div>
                            <label htmlFor="description" className="font-bold mb-2">
                                Descrição Adicional
                            </label>
                            <textarea
                                id="description"
                                value={pet.description}
                                onChange={(e) => setPet({ ...pet, description: e.target.value })}
                                className="w-full py-2 px-4 rounded-md border-2 border-purple-600"
                                placeholder="Informações adicionais importantes"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                    </div>
                );
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-center text-3xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
                    <p className="text-center text-gray-600">Você precisa estar logado para criar um anúncio.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Criar Anúncio</h2>

                    {/* Stepper */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            {steps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            currentStep > index + 1 ? 'bg-green-500' : currentStep === index + 1 ? 'bg-purple-600' : 'bg-gray-300'
                                        } text-white font-bold`}
                                    >
                                        {currentStep > index + 1 ? '✓' : index + 1}
                                    </div>
                                    <div className="text-xs mt-2 text-center">{step.title}</div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-1 w-full ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'} mt-4`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {renderStep()}

                        <div className="mt-8 flex justify-between">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    Voltar
                                </button>
                            )}
                            {currentStep < steps.length ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors ml-auto"
                                >
                                    Próximo
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors ml-auto disabled:bg-gray-400"
                                >
                                    {loading ? 'Criando...' : 'Criar Anúncio'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
