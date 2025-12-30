export default async function handler(req, res) {
    // Configuración de CORS para permitir peticiones desde cualquier origen
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    const apiKey = process.env.GEMINI_API_KEY;
    // Cambiamos a la versión de modelo más compatible
    const model = "gemini-1.5-flash"; 

    if (!apiKey || apiKey.trim() === "") {
        return res.status(500).json({ 
            error: 'La API Key no está configurada en Vercel. Ve a Settings > Environment Variables.' 
        });
    }

    try {
        // Usamos la versión v1 de la API que es más estable para este modelo
        const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: data.error?.message || 'Error en la respuesta de Google' 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ 
            error: `Error de conexión: ${error.message}` 
        });
    }
}
