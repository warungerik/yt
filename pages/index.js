import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDownload = async () => {
    if (!input) return alert("Masukkan link YouTube!");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(input)}&format=${format}`);
      const data = await res.json();
      if (data.error) alert("Error: " + data.error);
      else setResult(data);
    } catch (e) {
      alert("Gagal koneksi ke server");
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#ff0000', fontSize: '32px', marginBottom: '10px' }}>WARUNGERIK DL</h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>YouTube MP4 & MP3 Downloader Premium</p>

        <input
          placeholder="Tempel Link YouTube..."
          value={input} onChange={(e) => setInput(e.target.value)}
          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #333', marginBottom: '15px', backgroundColor: '#111', color: '#fff', fontSize: '16px' }}
        />

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => setFormat('mp4')} style={{ flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', border: 'none', backgroundColor: format === 'mp4' ? '#ff0000' : '#222', color: '#fff', fontWeight: 'bold' }}>Video MP4</button>
          <button onClick={() => setFormat('mp3')} style={{ flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', border: 'none', backgroundColor: format === 'mp3' ? '#ff0000' : '#222', color: '#fff', fontWeight: 'bold' }}>Audio MP3</button>
        </div>

        <button
          onClick={handleDownload}
          disabled={loading}
          style={{ width: '100%', padding: '15px', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? 'Sabar, Lagi Proses...' : 'Ambil File'}
        </button>

        {result && (
          <div style={{ marginTop: '30px', background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
            <img src={result.thumbnail} style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }} alt="thumb" />
            <p style={{ marginBottom: '20px', fontSize: '14px', color: '#ccc' }}>{result.title}</p>

            <a href={result.download} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: '15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
                💾 DOWNLOAD {(result.size / 1048576).toFixed(2)} MB
              </button>
            </a>
            <p style={{ fontSize: '11px', color: '#555', marginTop: '10px' }}>Powered by Autoresbot & Warung Erik</p>
          </div>
        )}
      </div>
    </div>
  );
}