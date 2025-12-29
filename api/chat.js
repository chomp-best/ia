export default async function handler(req, res) {
    // Configuración de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    const apiKey = process.env.GEMINI_API_KEY;
    const model = "gemini-1.5-flash"; 

    // Diagnóstico inicial
    if (!apiKey || apiKey.trim() === "") {
        console.error("CONFIG_ERROR: La GEMINI_API_KEY está vacía o no existe en Vercel.");
        return res.status(500).json({ 
            error: 'Falta la API Key en Vercel. Ve a Settings > Environment Variables y agrégala.' 
        });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("GOOGLE_API_ERROR:", JSON.stringify(data));
            return res.status(response.status).json({ 
                error: data.error?.message || 'Error en la API de Google' 
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("PROXY_CRASH:", error.message);
        return res.status(500).json({ 
            error: `Error interno del servidor: ${error.message}` 
        });
    }
}
