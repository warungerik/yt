import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    if (!input.trim()) return alert("Masukkan link atau judul!");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/download?input=${encodeURIComponent(input)}&format=${format}`);
      const data = await res.json();
      if (data.error) alert("Error: " + data.error);
      else setResult(data);
    } catch (e) {
      alert("Gagal mengambil data dari server.");
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#FF0000', fontSize: '28px', marginBottom: '10px' }}>YouTube Downloader</h1>
          <p style={{ color: '#666' }}>Download video atau MP3 dengan mudah</p>
        </div>

        <input
          type="text"
          placeholder="Tempel link YouTube atau ketik judul lagu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #eee', fontSize: '16px', outline: 'none', transition: 'border 0.3s' }}
        />

        <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
          <button onClick={() => setFormat('mp4')} style={{ flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', border: 'none', backgroundColor: format === 'mp4' ? '#FF0000' : '#eee', color: format === 'mp4' ? '#fff' : '#333', fontWeight: 'bold' }}>Video (MP4)</button>
          <button onClick={() => setFormat('mp3')} style={{ flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer', border: 'none', backgroundColor: format === 'mp3' ? '#FF0000' : '#eee', color: format === 'mp3' ? '#fff' : '#333', fontWeight: 'bold' }}>Audio (MP3)</button>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          style={{ width: '100%', padding: '15px', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          {loading ? 'Sedang Memproses...' : 'Cari & Konversi'}
        </button>

        {result && (
          <div style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
            <img src={result.thumbnail} alt="Thumbnail" style={{ width: '100%', borderRadius: '10px', marginBottom: '15px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#333' }}>{result.title}</h3>

            {result.type === 'mp3' ? (
              <a href={result.download} target="_blank" rel="noreferrer">
                <button style={{ width: '100%', padding: '15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Download MP3 Sekarang
                </button>
              </a>
            ) : (
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>Pilih Resolusi:</p>
                {result.formats.map((f, i) => (
                  <a key={i} href={f.download} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                    <button style={{ width: '100%', padding: '12px', marginBottom: '8px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }}>
                      <span style={{ color: '#333', fontWeight: '500' }}>🎥 {f.quality}</span>
                      <span style={{ color: '#FF0000', fontSize: '14px' }}>Download ({f.size})</span>
                    </button>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <footer style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#aaa' }}>
        &copy; 2026 YT Downloader - Powered by ZenzzXD Scraper
      </footer>
    </div>
  );
}