import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { url, format = 'mp4' } = req.query;
    const apiKey = 'warungerik';

    if (!url) return res.status(400).json({ error: 'URL YouTube diperlukan' });

    try {
        // Menyesuaikan endpoint berdasarkan pilihan user (ytmp3 atau ytmp4)
        const endpoint = format === 'mp3' ? 'ytmp3' : 'ytmp4';

        const response = await axios.get(`https://api.autoresbot.com/api/downloader/${endpoint}`, {
            params: {
                apikey: apiKey,
                url: url
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0'
            }
        });

        const result = response.data;

        // Validasi data berdasarkan respons JSON yang kamu kirim
        if (result.status && result.data) {
            return res.status(200).json({
                title: "WARUNGERIK Download",
                thumbnail: `https://img.youtube.com/vi/${extractId(url)}/mqdefault.jpg`,
                type: format,
                download: result.data.url, // URL dari uploader.autoresbot.com
                size: result.data.size      // Ukuran file dalam bytes
            });
        } else {
            return res.status(400).json({ error: result.message || "Gagal memproses file" });
        }
    } catch (err) {
        res.status(500).json({ error: "Kesalahan pada server API Autoresbot" });
    }
}

function extractId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed|watch|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : 'default';
}