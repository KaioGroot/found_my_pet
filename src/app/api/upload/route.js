import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo foi enviado.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Gera um nome único para o arquivo usando timestamp
        const timestamp = Date.now();
        const originalName = file.name;
        const extension = path.extname(originalName);
        const fileName = `pet-${timestamp}${extension}`;

        // Caminho onde a imagem será salva
        const filePath = path.join(process.cwd(), 'public', 'uploads', 'pets', fileName);

        // Salva o arquivo
        await writeFile(filePath, buffer);

        // Retorna o caminho relativo do arquivo para usar no frontend
        const fileUrl = `/uploads/pets/${fileName}`;

        return NextResponse.json({
            success: true,
            fileUrl: fileUrl,
        });
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        return NextResponse.json({ error: 'Erro ao fazer upload do arquivo.' }, { status: 500 });
    }
}
