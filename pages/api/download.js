import axios from 'axios';

function convertid(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed|watch|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?]|$)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

async function resolveid(input) {
    const direct = convertid(input);
    if (direct) return direct;

    const search = await axios.get(`https://test.flvto.online/search/?q=${encodeURIComponent(input)}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
            origin: 'https://v5.ytmp4.is',
            referer: 'https://v5.ytmp4.is/'
        }
    });

    if (!search.data.items || !search.data.items.length) throw new Error('Video tidak ditemukan');
    return search.data.items[0].id;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { input, format = 'mp4' } = req.query;

    if (!input) return res.status(400).json({ error: 'Input (URL/Judul) diperlukan' });

    try {
        const youtube_id = await resolveid(input);

        const converter = await axios.post('https://ht.flvto.online/converter',
            { id: youtube_id, fileType: format },
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                    'Content-Type': 'application/json',
                    origin: 'https://ht.flvto.online',
                    referer: `https://ht.flvto.online/button?url=https://www.youtube.com/watch?v=${youtube_id}&fileType=${format}`
                }
            }
        );

        const data = converter.data;

        if (format === 'mp3') {
            return res.status(200).json({
                title: data.title,
                type: 'mp3',
                filesize: data.filesize,
                download: data.link
            });
        }

        if (format === 'mp4') {
            if (!Array.isArray(data.formats) || !data.formats.length) {
                throw new Error('Format MP4 tidak tersedia');
            }
            const sorted = data.formats.sort((a, b) => b.height - a.height);
            const selected = sorted.find(v => v.qualityLabel === '720p') || sorted[0];

            return res.status(200).json({
                title: data.title,
                type: 'mp4',
                quality: selected.qualityLabel,
                download: selected.url
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}