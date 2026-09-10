const VPS_API_URL = "http://194.104.9.85:2245/api/fitness-data";

export default async function handler(request, response) {
    if (request.method !== "GET") {
        response.setHeader("Allow", "GET");
        return response.status(405).json({ error: "Method not allowed" });
    }

    try {
        const upstream = await fetch(`${VPS_API_URL}?t=${Date.now()}`, {
            headers: { Accept: "application/json" },
        });

        if (!upstream.ok) {
            return response.status(502).json({
                error: `VPS API returned HTTP ${upstream.status}`,
            });
        }

        const data = await upstream.json();
        response.setHeader("Cache-Control", "no-store");
        return response.status(200).json(data);
    } catch (error) {
        console.error("VPS API proxy error:", error);
        return response.status(502).json({
            error: "Не удалось получить данные с VPS API",
        });
    }
}