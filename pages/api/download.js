import axios from 'axios';
import crypto from 'crypto';

const KEY_SAVETUBE = Buffer.from('C5D58EF67A7584E4A29F6C35BBC4EB12', 'hex');

function decrypt(enc) {
    const b = Buffer.from(enc.replace(/\s/g, ''), 'base64');
    const iv = b.subarray(0, 16);
    const data = b.subarray(16);
    const d = crypto.createDecipheriv('aes-128-cbc', KEY_SAVETUBE, iv);
    return JSON.parse(Buffer.concat([d.update(data), d.final()]).toString());
}

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL YouTube diperlukan' });

    try {
        // 1. Dapatkan CDN Random
        const { data: rd } = await axios.get('https://media.savetube.vip/api/random-cdn', {
            headers: { origin: 'https://save-tube.com', 'User-Agent': 'Mozilla/5.0' }
        });
        const cdn = rd.cdn;

        // 2. Dapatkan Info Video
        const infoRes = await axios.post(`https://${cdn}/v2/info`, { url }, {
            headers: { 'Content-Type': 'application/json', origin: 'https://save-tube.com' }
        });

        if (!infoRes.data?.status) throw new Error('Video tidak ditemukan atau tidak didukung');
        const json = decrypt(infoRes.data.data);

        // 3. Fungsi Helper Download
        const getDlUrl = async (type, quality) => {
            const r = await axios.post(`https://${cdn}/download`, {
                id: json.id,
                key: json.key,
                downloadType: type,
                quality: String(quality)
            }, { headers: { 'Content-Type': 'application/json', origin: 'https://save-tube.com' } });
            return r.data?.data?.downloadUrl || null;
        };

        // 4. Proses Link Download (Kita ambil semua yang tersedia)
        const formats = [];

        // Video Formats
        for (const v of json.video_formats) {
            formats.push({
                quality: v.label || v.quality + 'p',
                type: 'mp4',
                download: await getDlUrl('video', v.quality)
            });
        }

        // Audio Formats
        for (const a of json.audio_formats) {
            formats.push({
                quality: a.label || 'Audio ' + a.quality,
                type: 'mp3',
                download: await getDlUrl('audio', a.quality)
            });
        }

        res.status(200).json({
            title: json.title,
            duration: json.duration,
            thumbnail: json.thumbnail,
            formats: formats.filter(f => f.download !== null)
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}