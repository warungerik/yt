import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { url, type, rel, hash } = req.query;

    // Jika ada parameter 'hash', berarti ini request untuk mengambil link download final
    if (hash && rel) {
        try {
            const { data } = await axios.post('https://www.y2mate.com/ays?vt=home',
                new URLSearchParams({ type: 'youtube', _id: rel, v_id: url, ajax: '1', token: '', ftype: type, fquality: hash }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({ error: 'Gagal mendapatkan link download' });
        }
    }

    // Tahap Awal: Ambil Info Video & Daftar Kualitas
    if (!url) return res.status(400).json({ error: 'URL diperlukan' });

    try {
        const { data } = await axios.post('https://www.y2mate.com/ats?vt=home',
            new URLSearchParams({ k_query: url, k_page: 'home', hl: 'en', q_auto: '0' }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        if (data.status !== 'ok') throw new Error('Video tidak ditemukan');

        // Rapikan data untuk dikirim ke frontend
        const result = {
            id: data.v_id,
            title: data.title,
            thumbnail: `https://i.ytimg.com/vi/${data.v_id}/mqdefault.jpg`,
            links: {
                mp4: Object.values(data.links.mp4 || {}),
                mp3: Object.values(data.links.mp3 || {})
            }
        };

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}