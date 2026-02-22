import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { url, format = 'mp4' } = req.query;
    const apiKey = 'warungerik'; // API Key Anda

    if (!url) return res.status(400).json({ error: 'URL YouTube diperlukan' });

    try {
        if (format === 'mp4') {
            // Menggunakan API Autoresbot untuk MP4 agar anti-403
            const response = await axios.get(`https://api.autoresbot.com/api/downloader/ytmp4?apikey=${apiKey}&url=${encodeURIComponent(url)}`);
            const result = response.data;

            if (result.status && result.data) {
                return res.status(200).json({
                    title: "YouTube Video",
                    thumbnail: `https://img.youtube.com/vi/${extractId(url)}/mqdefault.jpg`,
                    type: 'mp4',
                    download: result.data.url, // Link uploader autoresbot
                    size: result.data.size
                });
            } else {
                throw new Error(result.message || 'Gagal mengambil data dari API Autoresbot');
            }
        } else {
            // Endpoint MP3 (Bisa Anda ganti ke ytmp3 jika Autoresbot menyediakan)
            const response = await axios.get(`https://api.autoresbot.com/api/downloader/ytmp3?apikey=${apiKey}&url=${encodeURIComponent(url)}`);
            const result = response.data;

            if (result.status && result.data) {
                return res.status(200).json({
                    title: "YouTube Audio",
                    thumbnail: `https://img.youtube.com/vi/${extractId(url)}/mqdefault.jpg`,
                    type: 'mp3',
                    download: result.data.url,
                    size: result.data.size
                });
            } else {
                throw new Error('Gagal mengonversi MP3');
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Helper untuk ambil ID Video
function extractId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed|watch|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : 'default';
}