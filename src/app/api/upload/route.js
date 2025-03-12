import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo foi enviado.' }, { status: 400 });
        }

        // Upload para o Vercel Blob
        const blob = await put(file.name, file, {
            access: 'public',
            addRandomSuffix: true, // Adiciona um sufixo aleatório para evitar conflitos de nome
        });

        return NextResponse.json({
            success: true,
            fileUrl: blob.url,
        });
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        return NextResponse.json({ error: 'Erro ao fazer upload do arquivo.' }, { status: 500 });
    }
}
