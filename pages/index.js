import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDownload = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(input)}&format=${format}`);
      const data = await res.json();
      if (data.error) alert(data.error);
      else setResult(data);
    } catch (e) {
      alert("Gagal koneksi ke API");
    }
    setLoading(false);
  };

  // Fungsi untuk mengatasi masalah 403 (Forbidden)
  const triggerDownload = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // Memaksa browser mengunduh file
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ backgroundColor: '#111', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#ff0000' }}>YouTube Downloader</h1>

        <input
          placeholder="Link Video atau Judul..."
          value={input} onChange={(e) => setInput(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '5px', border: 'none', marginBottom: '10px', color: '#000' }}
        />

        <div style={{ marginBottom: '10px' }}>
          <button onClick={() => setFormat('mp4')} style={{ padding: '10px 20px', marginRight: '5px', background: format === 'mp4' ? '#f00' : '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>MP4</button>
          <button onClick={() => setFormat('mp3')} style={{ padding: '10px 20px', background: format === 'mp3' ? '#f00' : '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>MP3</button>
        </div>

        <button onClick={handleDownload} disabled={loading} style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {loading ? 'Sedang Memproses...' : 'Cari & Download'}
        </button>

        {result && (
          <div style={{ marginTop: '20px', background: '#222', padding: '15px', borderRadius: '10px' }}>
            <img src={result.thumbnail} style={{ width: '100%', borderRadius: '5px' }} />
            <p style={{ margin: '15px 0', fontWeight: 'bold' }}>{result.title}</p>

            <button
              onClick={() => triggerDownload(result.download, `${result.title}.${result.type}`)}
              style={{ width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Klik Simpan {result.type.toUpperCase()} {result.quality || ''}
            </button>

            <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
              *Jika muncul error 403, coba tahan tombol lalu pilih "Simpan Link".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}