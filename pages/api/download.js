import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL diperlukan' });

    try {
        const body = new URLSearchParams({
            auth: '20250901majwlqo', // Token auth dari scraper Anda
            domain: 'api-ak.vidssave.com',
            origin: 'source',
            link: url
        }).toString();

        const response = await axios.post('https://api.vidssave.com/api/contentsite_api/media/parse',
            body,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'origin': 'https://vidssave.com',
                    'referer': 'https://vidssave.com/'
                }
            }
        );

        const data = response.data;

        // Cek jika data valid
        if (!data || data.code !== 0) {
            throw new Error(data.message || 'Gagal mengambil data dari Vidssave');
        }

        // Mengembalikan data hasil parse
        res.status(200).json({
            title: data.data.title,
            thumbnail: data.data.thumbnail,
            source: data.data.source,
            medias: data.data.medias // Berisi daftar link video/audio
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}