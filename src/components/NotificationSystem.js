'use client';
import { useState, useEffect } from 'react';
import { db } from '@/connection/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function NotificationSystem({ userCity, userState }) {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (!userCity || !userState) return;

        const q = query(
            collection(db, 'pets'),
            where('category', '==', 'PERDI UM PET'),
            where('city', '==', userCity),
            where('state', '==', userState)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newPets = snapshot
                .docChanges()
                .filter((change) => change.type === 'added')
                .map((change) => ({
                    id: change.doc.id,
                    ...change.doc.data(),
                    timestamp: new Date(),
                }));

            if (newPets.length > 0) {
                setNotifications((prev) => [...newPets, ...prev]);
                // Mostrar notificação do navegador
                if (Notification.permission === 'granted') {
                    newPets.forEach((pet) => {
                        new Notification('Novo Pet Perdido!', {
                            body: `${pet.name} foi perdido em ${pet.city}`,
                            icon: pet.photoURL,
                        });
                    });
                }
            }
        });

        return () => unsubscribe();
    }, [userCity, userState]);

    const requestNotificationPermission = async () => {
        if (Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                alert('Notificações ativadas! Você receberá alertas sobre novos pets perdidos na sua região.');
            }
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.length}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold">Notificações Recentes</h3>
                    </div>
                    <div className="divide-y">
                        {notifications.map((notification) => (
                            <div key={notification.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-start gap-3">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                        <img src={notification.photoURL} alt={notification.name} className="object-cover w-full h-full" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{notification.name}</h4>
                                        <p className="text-sm text-gray-600">{notification.breed}</p>
                                        <p className="text-xs text-gray-500">{notification.timestamp.toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t">
                        <button
                            onClick={requestNotificationPermission}
                            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Ativar Notificações
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
