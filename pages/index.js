import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFetch = async () => {
    if (!url) return alert("Masukkan URL!");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.error) alert(data.error);
      else setResult(data);
    } catch (e) {
      alert("Gagal memproses video.");
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#1a1a1a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '40px auto', background: '#2d2d2d', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>

        <h2 style={{ textAlign: 'center', color: '#ff4757' }}>🚀 Savetube Downloader</h2>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Tempel link YouTube di sini..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#3d3d3d', color: '#fff', boxSizing: 'border-box' }}
          />
          <button
            onClick={handleFetch}
            disabled={loading}
            style={{ width: '100%', marginTop: '10px', padding: '12px', background: '#ff4757', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Sedang Menyiapkan Link...' : 'Dapatkan Link Download'}
          </button>
        </div>

        {result && (
          <div style={{ textAlign: 'center' }}>
            <img src={result.thumbnail} style={{ width: '100%', borderRadius: '10px', marginBottom: '10px' }} />
            <h4 style={{ marginBottom: '20px', fontSize: '14px' }}>{result.title}</h4>

            <div style={{ textAlign: 'left', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
              {result.formats.map((f, i) => (
                <a key={i} href={f.download} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#3d3d3d',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    border: f.type === 'mp3' ? '1px solid #2ed573' : '1px solid #1e90ff'
                  }}>
                    <span>{f.type.toUpperCase()} - {f.quality}</span>
                    <span style={{ color: f.type === 'mp3' ? '#2ed573' : '#1e90ff', fontWeight: 'bold' }}>Download</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}