import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [dlLoading, setDlLoading] = useState(null);

  const getInfo = async () => {
    if (!url) return;
    setLoading(true);
    setInfo(null);
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.error) alert(data.error);
      else setInfo(data);
    } catch (e) { alert("Gagal mengambil data"); }
    setLoading(false);
  };

  const generateLink = async (v_id, type, hash, quality) => {
    setDlLoading(hash);
    try {
      const res = await fetch(`/api/download?url=${v_id}&rel=${v_id}&type=${type}&hash=${hash}`);
      const data = await res.json();
      if (data.status === 'ok') {
        window.open(data.result, '_blank');
      } else {
        alert("Gagal membuat link download");
      }
    } catch (e) { alert("Error"); }
    setDlLoading(null);
  };

  return (
    <div style={{ backgroundColor: '#111', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#FF0000' }}>YouTube DL</h1>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
          <input
            style={{ flex: 1, padding: '12px', borderRadius: '5px', border: 'none' }}
            placeholder="Tempel Link YouTube..."
            value={url} onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={getInfo} disabled={loading} style={{ padding: '10px 20px', background: '#FF0000', border: 'none', color: '#fff', borderRadius: '5px', fontWeight: 'bold' }}>
            {loading ? '...' : 'Cari'}
          </button>
        </div>

        {info && (
          <div style={{ background: '#222', padding: '15px', borderRadius: '10px' }}>
            <img src={info.thumbnail} style={{ width: '100%', borderRadius: '5px' }} />
            <h3 style={{ fontSize: '16px', margin: '15px 0' }}>{info.title}</h3>

            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 'bold', borderBottom: '1px solid #444' }}>Video (MP4)</p>
              {info.links.mp4.slice(0, 4).map((l) => (
                <button
                  key={l.k}
                  onClick={() => generateLink(info.id, 'mp4', l.k, l.q)}
                  style={{ width: '100%', padding: '10px', margin: '5px 0', background: '#333', color: '#fff', border: '1px solid #444', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{l.q}</span>
                  <span>{dlLoading === l.k ? 'Tunggu...' : 'Download'}</span>
                </button>
              ))}

              <p style={{ fontWeight: 'bold', borderBottom: '1px solid #444', marginTop: '20px' }}>Audio (MP3)</p>
              {info.links.mp3.map((l) => (
                <button
                  key={l.k}
                  onClick={() => generateLink(info.id, 'mp3', l.k, l.q)}
                  style={{ width: '100%', padding: '10px', margin: '5px 0', background: '#1e3a2f', color: '#fff', border: 'none', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>MP3 - {l.q}</span>
                  <span>{dlLoading === l.k ? 'Tunggu...' : 'Download'}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}