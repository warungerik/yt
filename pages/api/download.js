import axios from 'axios';

let jsonCache = null;
const gB = Buffer.from('ZXRhY2xvdWQub3Jn', 'base64').toString();
const headers = {
    origin: 'https://v1.y2mate.nu',
    referer: 'https://v1.y2mate.nu/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    accept: '*/*'
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const ts = () => Math.floor(Date.now() / 1000);

async function getjson() {
    if (jsonCache) return jsonCache;
    const { data: html } = await axios.get('https://v1.y2mate.nu', { headers });
    const m = /var json = JSON\.parse\('([^']+)'\)/.exec(html);
    if (!m) throw new Error("Gagal mengambil config session");
    jsonCache = JSON.parse(m[1]);
    return jsonCache;
}

function authorization(json) {
    let e = '';
    for (let i = 0; i < json[0].length; i++) {
        e += String.fromCharCode(json[0][i] - json[2][json[2].length - (i + 1)]);
    }
    if (json[1]) e = e.split('').reverse().join('');
    return e.length > 32 ? e.slice(0, 32) : e;
}

function extrakid(url) {
    const m = /youtu\.be\/([a-zA-Z0-9_-]{11})/.exec(url) ||
        /v=([a-zA-Z0-9_-]{11})/.exec(url) ||
        /\/shorts\/([a-zA-Z0-9_-]{11})/.exec(url);
    if (!m) throw new Error('URL YouTube tidak valid');
    return m[1];
}

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { url, format = 'mp3' } = req.query;

    if (!url) return res.status(400).json({ error: 'URL diperlukan' });

    try {
        const json = await getjson();
        const videoId = extrakid(url);

        // Init
        const key = String.fromCharCode(json[6]);
        const initUrl = `https://eta.${gB}/api/v1/init?${key}=${authorization(json)}&t=${ts()}`;
        const { data: initRes } = await axios.get(initUrl, { headers });

        // Convert
        let { data } = await axios.get(
            `${initRes.convertURL}&v=${videoId}&f=${format}&t=${ts()}&_=${Math.random()}`,
            { headers }
        );

        if (data.redirect === 1 && data.redirectURL) {
            const r2 = await axios.get(data.redirectURL + '&t=' + ts(), { headers });
            data = r2.data;
        }

        // Polling jika proses belum selesai
        if (data.progressURL) {
            let tries = 0;
            while (tries < 10) { // Limit 10 kali polling (30 detik) agar tidak timeout di Vercel
                await sleep(3000);
                const { data: p } = await axios.get(data.progressURL + '&t=' + ts(), { headers });
                if (p.progress === 3) {
                    return res.status(200).json({ title: p.title, download: data.downloadURL });
                }
                tries++;
            }
            throw new Error("Proses terlalu lama, silakan coba lagi.");
        }

        res.status(200).json({ title: data.title, download: data.downloadURL });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}