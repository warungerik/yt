import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDownload = async () => {
    if (!input) return alert("Tempel link YouTube-nya dulu!");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(input)}&format=${format}`);
      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + data.error);
      } else {
        setResult(data);
      }
    } catch (e) {
      alert("Koneksi gagal!");
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#ff0000', fontSize: '32px', marginBottom: '10px' }}>WARUNGERIK DL</h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>Premium YouTube Downloader</p>

        <input
          placeholder="Tempel link video di sini..."
          value={input} onChange={(e) => setInput(e.target.value)}
          style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #333', marginBottom: '15px', backgroundColor: '#111', color: '#fff' }}
        />

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => setFormat('mp4')} style={{ flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', border: 'none', backgroundColor: format === 'mp4' ? '#ff0000' : '#222', color: '#fff', fontWeight: 'bold' }}>Video MP4</button>
          <button onClick={() => setFormat('mp3')} style={{ flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', border: 'none', backgroundColor: format === 'mp3' ? '#ff0000' : '#222', color: '#fff', fontWeight: 'bold' }}>Audio MP3</button>
        </div>

        <button onClick={handleDownload} disabled={loading} style={{ width: '100%', padding: '15px', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          {loading ? 'MENYIAPKAN FILE...' : 'AMBIL DOWNLOAD'}
        </button>

        {result && (
          <div style={{ marginTop: '30px', background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #444' }}>
            <img src={result.thumbnail} style={{ width: '100%', borderRadius: '10px', marginBottom: '15px' }} alt="thumbnail" />
            <p style={{ marginBottom: '15px', fontSize: '14px' }}>{result.title}</p>

            <a href={result.download} target="_blank" rel="noreferrer">
              <button style={{ width: '100%', padding: '15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                SIMPAN {result.type.toUpperCase()} ({(result.size / 1024 / 1024).toFixed(2)} MB)
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}