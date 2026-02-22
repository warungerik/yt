import axios from 'axios';

// Fungsi mengekstrak ID YouTube dari URL
function convertid(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed|watch|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?]|$)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Fungsi mencari ID jika input berupa judul/kata kunci
async function resolveid(input) {
    const direct = convertid(input);
    if (direct) return direct;

    const search = await axios.get(`https://test.flvto.online/search/?q=${encodeURIComponent(input)}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            origin: 'https://v5.ytmp4.is',
            referer: 'https://v5.ytmp4.is/'
        }
    });

    if (!search.data.items || search.data.items.length === 0) throw new Error('Video tidak ditemukan');
    return search.data.items[0].id;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { input, format = 'mp4' } = req.query;
    if (!input) return res.status(400).json({ error: 'Input diperlukan' });

    try {
        const youtube_id = await resolveid(input);

        const { data } = await axios.post('https://ht.flvto.online/converter',
            { id: youtube_id, fileType: format },
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Content-Type': 'application/json',
                    origin: 'https://ht.flvto.online'
                }
            }
        );

        if (!data || !data.title) throw new Error('Gagal mengonversi video');

        // Metadata dasar
        const responseData = {
            title: data.title,
            thumbnail: `https://i.ytimg.com/vi/${youtube_id}/mqdefault.jpg`,
            duration: data.duration,
            type: format
        };

        if (format === 'mp3') {
            responseData.download = data.link;
            responseData.size = data.filesize;
        } else {
            // Mengambil semua opsi kualitas MP4 yang tersedia
            responseData.formats = data.formats.map(f => ({
                quality: f.qualityLabel,
                download: f.url,
                size: f.sizeText || 'N/A'
            }));
        }

        res.status(200).json(responseData);
    } catch (err) {
        res.status(500).json({ error: err.message || 'Terjadi kesalahan sistem' });
    }
}