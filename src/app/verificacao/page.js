'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Verificacao() {
    const { user, requestVerification } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [documentFile, setDocumentFile] = useState(null);
    const [documentType, setDocumentType] = useState('');
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                // 5MB
                setError('O arquivo deve ter no máximo 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setDocumentFile(file);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!documentFile || !documentType) {
                throw new Error('Por favor, selecione um documento e seu tipo');
            }

            const formData = new FormData();
            formData.append('file', documentFile);

            // Upload do documento
            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadResponse.json();

            if (!uploadData.success) {
                throw new Error('Erro ao fazer upload do documento');
            }

            // Solicitar verificação
            await requestVerification({
                documentUrl: uploadData.fileUrl,
                documentType,
                submittedAt: new Date().toISOString(),
            });

            setSuccess('Solicitação de verificação enviada com sucesso! Analisaremos seu documento em até 48 horas.');
            setTimeout(() => {
                router.push('/perfil');
            }, 3000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (user?.isVerified) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-24">
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Conta Verificada</h1>
                        <p className="text-gray-600">Sua conta já está verificada! Você pode ver seu badge de verificação no seu perfil.</p>
                        <div className="mt-6">
                            <button
                                onClick={() => router.push('/perfil')}
                                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                            >
                                Ir para o Perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-24">
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Verificação de Conta</h1>
                        <p className="text-gray-600 mb-6">
                            Para garantir a segurança da nossa comunidade, pedimos que você envie um documento de identificação. Seu documento será
                            analisado em até 48 horas.
                        </p>

                        {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}

                        {success && (
                            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">{success}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                                <select
                                    value={documentType}
                                    onChange={(e) => setDocumentType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    required
                                >
                                    <option value="">Selecione um tipo de documento</option>
                                    <option value="RG">RG</option>
                                    <option value="CNH">CNH</option>
                                    <option value="PASSPORT">Passaporte</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Documento (máximo 5MB)</label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    required
                                />
                            </div>

                            {preview && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                                    <img src={preview} alt="Document preview" className="max-w-md rounded-lg shadow-sm" />
                                </div>
                            )}

                            <div className="bg-gray-50 p-4 rounded-md">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Importante:</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>Seu documento deve estar legível e sem cortes</li>
                                    <li>Aceitamos apenas documentos oficiais com foto</li>
                                    <li>Seus dados serão tratados com segurança e confidencialidade</li>
                                    <li>Após a verificação, você receberá um badge especial no seu perfil</li>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                            >
                                {loading ? 'Enviando...' : 'Enviar para Verificação'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
