'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/connection/firebase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    // Registrar usuário
    const signup = async (email, password, name, phone) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Atualizar perfil com nome
            await updateProfile(userCredential.user, {
                displayName: name,
            });

            // Criar documento do usuário no Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name,
                email,
                phone,
                isVerified: false,
                verificationBadge: null,
                verificationDate: null,
                isModerator: false,
                status: 'active',
                createdAt: new Date().toISOString(),
            });

            return userCredential;
        } catch (error) {
            throw new Error(getAuthErrorMessage(error.code));
        }
    };

    // Login com email/senha
    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result;
        } catch (error) {
            throw new Error(getAuthErrorMessage(error.code));
        }
    };

    // Login com Google
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            // Verificar se é primeiro login e criar documento do usuário
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', result.user.uid), {
                    name: result.user.displayName,
                    email: result.user.email,
                    phone: '',
                    isVerified: false,
                    verificationBadge: null,
                    verificationDate: null,
                    isModerator: false,
                    status: 'active',
                    createdAt: new Date().toISOString(),
                });
            }

            return result;
        } catch (error) {
            throw new Error(getAuthErrorMessage(error.code));
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            throw new Error(getAuthErrorMessage(error.code));
        }
    };

    // Recuperação de senha
    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            throw new Error(getAuthErrorMessage(error.code));
        }
    };

    // Observar mudanças no estado de autenticação
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUser({
                        uid: user.uid,
                        email: user.email,
                        name: docSnap.data().name,
                        phone: docSnap.data().phone,
                        isVerified: docSnap.data().isVerified || false,
                        verificationBadge: docSnap.data().verificationBadge || null,
                        verificationDate: docSnap.data().verificationDate || null,
                        isModerator: docSnap.data().isModerator || false,
                        status: docSnap.data().status || 'active',
                    });
                } else {
                    // Criar documento do usuário se não existir
                    await setDoc(docRef, {
                        email: user.email,
                        name: user.displayName || '',
                        phone: '',
                        isVerified: false,
                        verificationBadge: null,
                        verificationDate: null,
                        isModerator: false,
                        status: 'active',
                        createdAt: new Date().toISOString(),
                    });

                    setUser({
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName || '',
                        phone: '',
                        isVerified: false,
                        verificationBadge: null,
                        verificationDate: null,
                        isModerator: false,
                        status: 'active',
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Função auxiliar para traduzir mensagens de erro
    const getAuthErrorMessage = (errorCode) => {
        const errorMessages = {
            'auth/email-already-in-use': 'Este email já está em uso.',
            'auth/invalid-email': 'Email inválido.',
            'auth/operation-not-allowed': 'Operação não permitida.',
            'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
            'auth/user-disabled': 'Esta conta foi desativada.',
            'auth/user-not-found': 'Usuário não encontrado.',
            'auth/wrong-password': 'Senha incorreta.',
            'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
            'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
            default: 'Ocorreu um erro. Tente novamente.',
        };

        return errorMessages[errorCode] || errorMessages.default;
    };

    const updateUserProfile = async (data) => {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, data);

        setUser((prev) => ({
            ...prev,
            ...data,
        }));
    };

    const requestVerification = async (documentData) => {
        if (!user) return;

        const verificationRef = doc(db, 'verificationRequests', user.uid);
        await setDoc(verificationRef, {
            userId: user.uid,
            documentData,
            status: 'pending',
            createdAt: new Date().toISOString(),
        });
    };

    const setUserAsModerator = async (userId) => {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            isModerator: true,
        });

        if (user && user.uid === userId) {
            setUser((prev) => ({
                ...prev,
                isModerator: true,
            }));
        }
    };

    const value = {
        user,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        updateUserProfile,
        requestVerification,
        setUserAsModerator,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
};
