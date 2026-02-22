import axios from 'axios';

// --- LOGIKA SCRAPER ZENZZXD (MP3) ---
function extractId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed|watch|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

async function resolveIdForMp3(input) {
    const directId = extractId(input);
    if (directId) return directId;

    const search = await axios.get(`https://test.flvto.online/search/?q=${encodeURIComponent(input)}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0',
            'origin': 'https://v5.ytmp4.is',
            'referer': 'https://v5.ytmp4.is/'
        }
    });

    if (!search.data.items || !search.data.items.length) throw new Error('Video tidak ditemukan');
    return search.data.items[0].id;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { url, format = 'mp4' } = req.query;
    const apiKey = 'warungerik';

    if (!url) return res.status(400).json({ error: 'URL atau Judul diperlukan' });

    try {
        if (format === 'mp4') {
            // --- LOGIKA MP4 (AUTORESBOT) ---
            const response = await axios.get(`https://api.autoresbot.com/api/downloader/ytmp4`, {
                params: { apikey: apiKey, url: url },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0',
                    'Accept': 'application/json'
                }
            });

            const result = response.data;

            if (result.status && result.data) {
                return res.status(200).json({
                    title: "WARUNGERIK MP4",
                    thumbnail: `https://img.youtube.com/vi/${extractId(url) || 'default'}/mqdefault.jpg`,
                    type: 'mp4',
                    download: result.data.url,
                    size: result.data.size
                });
            } else {
                throw new Error(result.message || 'Gagal mengambil MP4 dari Autoresbot');
            }

        } else {
            // --- LOGIKA MP3 (ZENZZXD) ---
            const youtube_id = await resolveIdForMp3(url);
            const converter = await axios.post('https://ht.flvto.online/converter',
                { id: youtube_id, fileType: 'mp3' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'origin': 'https://ht.flvto.online',
                        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0'
                    }
                }
            );

            const data = converter.data;
            return res.status(200).json({
                title: data.title || "WARUNGERIK MP3",
                thumbnail: `https://img.youtube.com/vi/${youtube_id}/mqdefault.jpg`,
                type: 'mp3',
                download: data.link,
                size: data.filesize
            });
        }
    } catch (err) {
        res.status(err.response?.status || 500).json({ error: err.message });
    }
}