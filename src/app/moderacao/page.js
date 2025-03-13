'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/connection/firebase';
import Navbar from '@/components/navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';

export default function Moderacao() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('verificacoes');
    const [verificacoes, setVerificacoes] = useState([]);
    const [denuncias, setDenuncias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/');
            return;
        }

        console.log('Status do moderador:', user.isModerator);

        if (!user.isModerator) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                console.log('Iniciando busca de dados...');

                // Buscar verificações pendentes
                const verificacoesRef = collection(db, 'verificationRequests');
                const verificacoesQuery = query(verificacoesRef, where('status', '==', 'pending'));
                const verificacoesSnap = await getDocs(verificacoesQuery);
                console.log('Verificações encontradas:', verificacoesSnap.size);
                const verificacoesData = [];

                for (const docSnap of verificacoesSnap.docs) {
                    try {
                        const userDocRef = doc(db, 'users', docSnap.data().userId);
                        const userData = await getDoc(userDocRef);
                        if (userData.exists()) {
                            verificacoesData.push({
                                id: docSnap.id,
                                ...docSnap.data(),
                                userData: userData.data(),
                            });
                        }
                    } catch (userError) {
                        console.error('Erro ao buscar dados do usuário:', userError);
                    }
                }

                setVerificacoes(verificacoesData);

                // Buscar denúncias pendentes
                const denunciasRef = collection(db, 'reports');
                const denunciasQuery = query(denunciasRef, where('status', '==', 'pending'));
                const denunciasSnap = await getDocs(denunciasQuery);
                const denunciasData = [];

                for (const docSnap of denunciasSnap.docs) {
                    try {
                        const reportedUserDocRef = doc(db, 'users', docSnap.data().reportedUserId);
                        const reportedUserData = await getDoc(reportedUserDocRef);
                        if (reportedUserData.exists()) {
                            denunciasData.push({
                                id: docSnap.id,
                                ...docSnap.data(),
                                reportedUserData: reportedUserData.data(),
                            });
                        }
                    } catch (userError) {
                        console.error('Erro ao buscar dados do usuário denunciado:', userError);
                    }
                }

                setDenuncias(denunciasData);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setError('Erro ao carregar os dados. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, router]);

    const handleVerification = async (verificationId, userId, action) => {
        try {
            const verificationRef = doc(db, 'verificationRequests', verificationId);
            await updateDoc(verificationRef, {
                status: action === 'approve' ? 'approved' : 'rejected',
                moderatorId: user.uid,
                decidedAt: new Date().toISOString(),
            });

            if (action === 'approve') {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    isVerified: true,
                    verificationBadge: '✓',
                    verificationDate: new Date().toISOString(),
                });
            }

            setVerificacoes((prev) => prev.filter((v) => v.id !== verificationId));
        } catch (error) {
            console.error('Erro ao processar verificação:', error);
            setError('Erro ao processar a verificação. Tente novamente.');
        }
    };

    const handleReport = async (reportId, userId, action) => {
        try {
            const reportRef = doc(db, 'reports', reportId);
            await updateDoc(reportRef, {
                status: action === 'approve' ? 'approved' : 'rejected',
                moderatorId: user.uid,
                decidedAt: new Date().toISOString(),
            });

            if (action === 'approve') {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    status: 'suspended',
                    suspensionDate: new Date().toISOString(),
                });
            }

            setDenuncias((prev) => prev.filter((d) => d.id !== reportId));
        } catch (error) {
            console.error('Erro ao processar denúncia:', error);
            setError('Erro ao processar a denúncia. Tente novamente.');
        }
    };

    if (!user?.isModerator) {
        return null;
    }

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
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-24">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex">
                                <button
                                    onClick={() => setActiveTab('verificacoes')}
                                    className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                        activeTab === 'verificacoes'
                                            ? 'border-purple-500 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Verificações ({verificacoes.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('denuncias')}
                                    className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                        activeTab === 'denuncias'
                                            ? 'border-purple-500 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Denúncias ({denuncias.length})
                                </button>
                            </nav>
                        </div>

                        {error && <div className="p-4 bg-red-100 border border-red-400 text-red-700">{error}</div>}

                        <div className="p-4">
                            {activeTab === 'verificacoes' ? (
                                <div className="space-y-4">
                                    {verificacoes.length === 0 ? (
                                        <p className="text-center text-gray-500 py-4">Não há solicitações de verificação pendentes.</p>
                                    ) : (
                                        verificacoes.map((verificacao) => (
                                            <div key={verificacao.id} className="border rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-medium">
                                                            {verificacao.userData.name || verificacao.userData.email}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">Documento: {verificacao.documentType}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Enviado em: {new Date(verificacao.submittedAt).toLocaleDateString('pt-BR')}
                                                        </p>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleVerification(verificacao.id, verificacao.userId, 'approve')}
                                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                        >
                                                            Aprovar
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerification(verificacao.id, verificacao.userId, 'reject')}
                                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                        >
                                                            Rejeitar
                                                        </button>
                                                    </div>
                                                </div>
                                                {verificacao.documentUrl && (
                                                    <div className="mt-4">
                                                        <Image
                                                            src={verificacao.documentUrl}
                                                            alt="Documento"
                                                            width={300}
                                                            height={200}
                                                            className="rounded-lg"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {denuncias.length === 0 ? (
                                        <p className="text-center text-gray-500 py-4">Não há denúncias pendentes.</p>
                                    ) : (
                                        denuncias.map((denuncia) => (
                                            <div key={denuncia.id} className="border rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-medium">
                                                            Denúncia contra: {denuncia.reportedUserData.name || denuncia.reportedUserData.email}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">Motivo: {denuncia.reason}</p>
                                                        <p className="text-sm text-gray-500">Reportado por: {denuncia.reporterEmail}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Data: {new Date(denuncia.createdAt).toLocaleDateString('pt-BR')}
                                                        </p>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleReport(denuncia.id, denuncia.reportedUserId, 'approve')}
                                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                        >
                                                            Aprovar
                                                        </button>
                                                        <button
                                                            onClick={() => handleReport(denuncia.id, denuncia.reportedUserId, 'reject')}
                                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                        >
                                                            Rejeitar
                                                        </button>
                                                    </div>
                                                </div>
                                                {denuncia.evidenceUrl && (
                                                    <div className="mt-4">
                                                        <Image
                                                            src={denuncia.evidenceUrl}
                                                            alt="Evidência"
                                                            width={300}
                                                            height={200}
                                                            className="rounded-lg"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
