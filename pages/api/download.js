import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { url, format = 'mp4' } = req.query;
    const apiKey = 'warungerik';

    if (!url) return res.status(400).json({ error: 'URL YouTube diperlukan' });

    try {
        // Autoresbot menggunakan endpoint yang berbeda untuk mp4 dan mp3
        const type = format === 'mp3' ? 'ytmp3' : 'ytmp4';

        const response = await axios.get(`https://api.autoresbot.com/api/downloader/${type}`, {
            params: {
                apikey: apiKey,
                url: url
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0',
                'Accept': 'application/json'
            }
        });

        const result = response.data;

        // Sesuai respons yang kamu kirim: result.status harus true
        if (result.status && result.data) {
            return res.status(200).json({
                title: "WARUNGERIK Download",
                thumbnail: `https://img.youtube.com/vi/${extractId(url)}/mqdefault.jpg`,
                type: format,
                download: result.data.url, // Mengambil data.url dari API
                size: result.data.size     // Mengambil data.size dari API
            });
        } else {
            return res.status(400).json({ error: result.message || "Gagal memproses video" });
        }
    } catch (err) {
        // Jika API Autoresbot memberikan error (seperti 403), tangkap di sini
        res.status(err.response?.status || 500).json({
            error: err.response?.data?.message || "Kesalahan pada API Provider"
        });
    }
}

function extractId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed|watch|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : 'default';
}