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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/connection/firebase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    // Registrar usuário
    const signup = async (email, password, name) => {
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
                createdAt: new Date().toISOString(),
                pets: [], // Array para armazenar IDs dos pets do usuário
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
                    createdAt: new Date().toISOString(),
                    pets: [],
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
                // Buscar dados adicionais do usuário no Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                setUser({
                    ...user,
                    ...userDoc.data(),
                });
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

    const value = {
        user,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
};
