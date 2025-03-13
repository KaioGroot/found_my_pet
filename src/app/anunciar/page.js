'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../connection/firebase';

export default function Anunciar() {
    const [pet, setPet] = useState({
        name: '',
        breed: '',
        age: '',
        weight: '',
        city: '',
        state: '',
        description: '',
        photoURL: '',
        category: '',
    });

    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [perdidos, setPerdidos] = useState([]);
    const [dadosip, setDadosip] = useState([]);

    const handleImageUpload = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            // Criar preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Preparar upload
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            // Fazer upload
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setPet((prev) => ({
                    ...prev,
                    photoURL: data.fileUrl,
                }));
            } else {
                throw new Error(data.error || 'Erro ao fazer upload');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao fazer upload da imagem. Tente novamente.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pet.photoURL) {
            alert('Por favor, faça upload de uma foto do pet');
            return;
        }

        try {
            // Adicionar o documento e pegar a referência com o ID gerado
            const docRef = await addDoc(collection(db, 'pets'), pet);

            // Atualizar o documento com seu próprio ID
            await updateDoc(docRef, {
                id: docRef.id,
            });

            alert('Anúncio enviado com sucesso!');
            // Limpar formulário
            setPet({
                name: '',
                breed: '',
                age: '',
                weight: '',
                city: '',
                state: '',
                description: '',
                photoURL: '',
                category: '',
            });
            setPreview(null);
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao enviar anúncio. Tente novamente.');
        }
    };

    useEffect(() => {
        const fetchDocuments = async () => {
            const querySnapShot = await getDocs(collection(db, 'pets'));
            const pets = [];
            querySnapShot.forEach((doc) => {
                pets.push(doc.data());
            });
            setPerdidos(pets);
        };
        fetchDocuments();
    }, []);

    useEffect(() => {
        const fetchip = async () => {
            const ip = await fetch('https://api.ipify.org').then((response) => response.text());
            const result = await fetch(`http://ip-api.com/json/${ip}`).then((response) => response.json());
            setDadosip(result);
        };
        fetchip();
    }, []);

    return (
        <div className="container flex w-full mx-auto px-4 py-24 rounded-full backdrop-blur-3xl mt-20 font-[family-name:var(--font-geist-sans)] bg-purple-50">
            <div className="md:flex-col flex justify-between md:w-1/2 rounded backdrop-blur-3xl px-4 py-4 bg-purple-200 md:overflow-y-auto md:border-r md:border-gray-200">
                <div className="p-4 bg-white rounded-lg shadow-lg mt-4">
                    <h2 className="text-3xl text-gray-600 font-bold">Criar anúncio pet</h2>
                    <p className="mt-2">Basta criar um anuncio com as informações do seu pet e ele será publicado na nossa plataforma.</p>
                </div>

                {preview && (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-2">Preview da Imagem</h3>
                        <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                )}

                <div className="mt-4">
                    <p className="font-bold">
                        Pets cadastrados: <span className="text-purple-600">{perdidos.length}</span>
                    </p>
                </div>
            </div>

            <div className="md:w-1/2 px-8">
                <h1 className="text-3xl font-bold mb-6">Anunciar Pet</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="photo" className="font-bold mb-2">
                            Foto do Pet
                        </label>
                        <input
                            type="file"
                            id="photo"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="py-2 px-4 rounded-md border-2 border-purple-600"
                            disabled={uploading}
                        />
                        {uploading && <p className="text-sm text-purple-600 mt-1">Fazendo upload...</p>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="name" className="font-bold mb-2">
                            Nome do Pet
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={pet.name}
                            onChange={(e) => setPet({ ...pet, name: e.target.value })}
                            className="py-2 px-4 rounded-md border-2 border-purple-600"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="breed" className="font-bold mb-2">
                            Raça
                        </label>
                        <input
                            type="text"
                            id="breed"
                            value={pet.breed}
                            onChange={(e) => setPet({ ...pet, breed: e.target.value })}
                            className="py-2 px-4 rounded-md border-2 border-purple-600"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="age" className="font-bold mb-2">
                                Idade
                            </label>
                            <input
                                type="number"
                                id="age"
                                value={pet.age}
                                onChange={(e) => setPet({ ...pet, age: e.target.value })}
                                className="py-2 px-4 rounded-md border-2 border-purple-600"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="weight" className="font-bold mb-2">
                                Peso (kg)
                            </label>
                            <input
                                type="number"
                                id="weight"
                                value={pet.weight}
                                onChange={(e) => setPet({ ...pet, weight: e.target.value })}
                                className="py-2 px-4 rounded-md border-2 border-purple-600"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="city" className="font-bold mb-2">
                                Cidade
                            </label>
                            <input
                                type="text"
                                id="city"
                                value={pet.city || dadosip.city}
                                onChange={(e) => setPet({ ...pet, city: e.target.value })}
                                className="py-2 px-4 rounded-md border-2 border-purple-600"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="state" className="font-bold mb-2">
                                Estado
                            </label>
                            <input
                                type="text"
                                id="state"
                                value={pet.state || dadosip.regionName}
                                onChange={(e) => setPet({ ...pet, state: e.target.value })}
                                className="py-2 px-4 rounded-md border-2 border-purple-600"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="category" className="font-bold mb-2">
                            Categoria
                        </label>
                        <select
                            id="category"
                            value={pet.category}
                            onChange={(e) => setPet({ ...pet, category: e.target.value })}
                            className="py-2 px-4 rounded-md border-2 border-purple-600"
                            required
                        >
                            <option value="">Selecione uma opção</option>
                            <option value="ENCONTREI UM PET">Encontrei um pet</option>
                            <option value="PERDI UM PET">Perdi um pet</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="description" className="font-bold mb-2">
                            Descrição
                        </label>
                        <textarea
                            id="description"
                            value={pet.description}
                            onChange={(e) => setPet({ ...pet, description: e.target.value })}
                            className="py-2 px-4 rounded-md border-2 border-purple-600"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-400 to-blue-600 text-lg text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity"
                        disabled={uploading}
                    >
                        {uploading ? 'Enviando...' : 'Publicar Anúncio'}
                    </button>
                </form>
            </div>
        </div>
    );
}
