const axios = require('axios');

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
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K)',
            origin: 'https://v5.ytmp4.is',
            referer: 'https://v5.ytmp4.is/'
        }
    });

    if (!search.data.items || !search.data.items.length) throw new Error('Video tidak ditemukan');
    return search.data.items[0].id;
}

export default async function handler(req, res) {
    const { url, format = 'mp4' } = req.query;
    if (!url) return res.status(400).json({ error: 'URL/Judul diperlukan' });

    try {
        const youtube_id = await resolveid(url);
        const converter = await axios.post('https://ht.flvto.online/converter',
            { id: youtube_id, fileType: format },
            {
                headers: {
                    'Content-Type': 'application/json',
                    origin: 'https://ht.flvto.online'
                }
            }
        );

        const data = converter.data;
        if (format === 'mp3') {
            return res.status(200).json({
                title: data.title,
                thumbnail: `https://i.ytimg.com/vi/${youtube_id}/mqdefault.jpg`,
                type: 'mp3',
                download: data.link
            });
        }

        const sorted = data.formats.sort((a, b) => b.height - a.height);
        const selected = sorted.find(v => v.qualityLabel === '720p') || sorted[0];

        res.status(200).json({
            title: data.title,
            thumbnail: `https://i.ytimg.com/vi/${youtube_id}/mqdefault.jpg`,
            type: 'mp4',
            quality: selected.qualityLabel,
            download: selected.url
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}