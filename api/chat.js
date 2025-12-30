export default async function handler(req, res) {
    // Configuración de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    const apiKey = process.env.GEMINI_API_KEY;
    // Usamos el nombre de modelo más estándar para v1beta
    const model = "gemini-1.5-flash"; 

    if (!apiKey || apiKey.trim() === "") {
        return res.status(500).json({ 
            error: 'La GEMINI_API_KEY no está configurada en el panel de Vercel (Settings > Environment Variables).' 
        });
    }

    try {
        // Endpoint v1beta: Necesario para systemInstruction y responseMimeType
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: data.error?.message || 'Error en la respuesta de Google Gemini' 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ 
            error: `Error crítico de servidor: ${error.message}` 
        });
    }
}
