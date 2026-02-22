import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDownload = async () => {
    if (!url) return alert("Masukkan link media!");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.error) alert(data.error);
      else setResult(data);
    } catch (e) {
      alert("Terjadi kesalahan koneksi.");
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '50px auto', background: '#1e293b', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>

        <h2 style={{ textAlign: 'center', color: '#38bdf8', marginBottom: '10px' }}>All-in-One Downloader</h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8', marginBottom: '30px' }}>
          Support: Instagram, TikTok, YouTube, FB, & Twitter
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Tempel link video/reel di sini..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #334155', background: '#0f172a', color: '#fff', outline: 'none' }}
          />
          <button
            onClick={handleDownload}
            disabled={loading}
            style={{ padding: '15px', background: '#38bdf8', border: 'none', borderRadius: '10px', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}
          >
            {loading ? 'Sedang Memproses...' : 'Download Sekarang'}
          </button>
        </div>

        {result && (
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <img src={result.thumbnail} style={{ width: '100%', borderRadius: '15px', marginBottom: '15px', border: '2px solid #334155' }} />
            <h4 style={{ fontSize: '16px', marginBottom: '20px', color: '#f1f5f9' }}>{result.title}</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {result.medias.map((m, i) => (
                <a key={i} href={m.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    background: '#334155',
                    borderRadius: '10px',
                    color: '#fff',
                    borderLeft: `4px solid ${m.extension === 'mp3' ? '#fbbf24' : '#22c55e'}`
                  }}>
                    <span>{m.quality} ({m.extension.toUpperCase()})</span>
                    <span style={{ fontWeight: 'bold' }}>Simpan →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <p style={{ textAlign: 'center', color: '#475569', fontSize: '12px', marginTop: '20px' }}>Powered by Vidssave Scraper 2026</p>
    </div>
  );
}