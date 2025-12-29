export default async function handler(req, res) {
    // 1. Solo permitir peticiones POST
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');

    const apiKey = process.env.GEMINI_API_KEY; // La clave se lee de aquí, no del JS público
    const model = "gemini-1.5-flash"; // Versión estable recomendada

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}