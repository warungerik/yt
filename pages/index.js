import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp3');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDownload = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(url)}&format=${format}`);
      const data = await res.json();
      if (data.error) alert(data.error);
      else setResult(data);
    } catch (e) {
      alert("Terjadi kesalahan sistem");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '500px', margin: '50px auto', padding: '20px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h1>YT Downloader</h1>
      <input 
        type="text" 
        placeholder="Masukkan URL YouTube..." 
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ padding: '10px', marginBottom: '10px', width: '100%' }}>
        <option value="mp3">Audio (MP3)</option>
        <option value="mp4">Video (MP4)</option>
      </select>
      <button 
        onClick={handleDownload} 
        disabled={loading}
        style={{ width: '100%', padding: '10px', backgroundColor: '#ff0000', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        {loading ? 'Sabar ya, lagi proses...' : 'Download'}
      </button>

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9' }}>
          <p><strong>{result.title}</strong></p>
          <a href={result.download} target="_blank" rel="noreferrer">
            <button style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: 'green', color: 'white', border: 'none' }}>
              Klik untuk Simpan File
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
