import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDownload = async () => {
    if (!input) return alert("Masukkan link atau judul lagu!");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/download?input=${encodeURIComponent(input)}&format=${format}`);
      const data = await res.json();
      if (data.error) alert(data.error);
      else setResult(data);
    } catch (e) {
      alert("Gagal menghubungi server");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '450px', margin: '60px auto', padding: '25px', textAlign: 'center', border: '1px solid #eaeaea', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#ff0000' }}>YouTube Downloader</h2>
      <p style={{ fontSize: '14px', color: '#666' }}>Bisa pakai Link atau Judul Video</p>

      <input
        type="text"
        placeholder="Contoh: Bersenja Gurau atau Link YT"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={() => setFormat('mp4')} style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #ff0000', backgroundColor: format === 'mp4' ? '#ff0000' : '#fff', color: format === 'mp4' ? '#fff' : '#000' }}>MP4 (Video)</button>
        <button onClick={() => setFormat('mp3')} style={{ flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #ff0000', backgroundColor: format === 'mp3' ? '#ff0000' : '#fff', color: format === 'mp3' ? '#fff' : '#000' }}>MP3 (Audio)</button>
      </div>

      <button
        onClick={handleDownload}
        disabled={loading}
        style={{ width: '100%', padding: '12px', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        {loading ? 'Sedang Memproses...' : 'Dapatkan Link'}
      </button>

      {result && (
        <div style={{ marginTop: '25px', padding: '15px', background: '#fcfcfc', border: '1px dashed #ccc', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', marginBottom: '10px' }}><strong>{result.title}</strong></p>
          <p style={{ fontSize: '12px', color: '#888' }}>Format: {result.type.toUpperCase()} {result.quality ? `(${result.quality})` : ''}</p>
          <a href={result.download} target="_blank" rel="noreferrer">
            <button style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px' }}>
              Download Sekarang
            </button>
          </a>
        </div>
      )}
    </div>
  );
}