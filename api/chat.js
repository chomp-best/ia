export default async function handler(req, res) {
    // Solo permitimos el método POST para seguridad
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // Vercel leerá esta clave desde su panel de control (Environment Variables)
    // Tú NO debes escribir la clave real aquí.
    const apiKey = process.env.GEMINI_API_KEY;
    const model = "gemini-1.5-flash"; 

    if (!apiKey) {
        return res.status(500).json({ error: 'La API Key no está configurada en el servidor.' });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) // Reenviamos lo que mandó el frontend
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error de conexión con el servidor de IA' });
    }
}
