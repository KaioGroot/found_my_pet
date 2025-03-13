'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/connection/firebase';

export default function ReportButton({ reportedUserId, reportedUserEmail, contentId, contentType }) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [evidence, setEvidence] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleEvidenceChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                // 5MB
                setError('O arquivo deve ter no máximo 5MB');
                return;
            }
            setEvidence(file);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!reason) {
                throw new Error('Por favor, descreva o motivo da denúncia');
            }

            let evidenceUrl = null;
            if (evidence) {
                const formData = new FormData();
                formData.append('file', evidence);

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const uploadData = await uploadResponse.json();

                if (!uploadData.success) {
                    throw new Error('Erro ao fazer upload da evidência');
                }

                evidenceUrl = uploadData.fileUrl;
            }

            const reportId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            await setDoc(doc(db, 'reports', reportId), {
                reporterId: user.uid,
                reporterEmail: user.email,
                reportedUserId,
                reportedUserEmail,
                contentId,
                contentType,
                reason,
                evidenceUrl,
                status: 'pending',
                createdAt: new Date().toISOString(),
            });

            setSuccess('Denúncia enviada com sucesso! Nossa equipe irá analisar o caso.');
            setTimeout(() => {
                setIsOpen(false);
                setReason('');
                setEvidence(null);
                setSuccess('');
            }, 3000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.uid === reportedUserId) {
        return null;
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="text-red-600 hover:text-red-700 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        fillRule="evenodd"
                        d="M3 6a3 3 0 013-3h8a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9 1a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 7a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                    />
                </svg>
                Denunciar
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Denunciar Conteúdo</h3>

                        {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}

                        {success && (
                            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">{success}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Motivo da Denúncia</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    rows="4"
                                    placeholder="Descreva o motivo da denúncia..."
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Evidência (opcional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEvidenceChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">Você pode anexar uma imagem como evidência (máx. 5MB)</p>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                                >
                                    {loading ? 'Enviando...' : 'Enviar Denúncia'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
