import { useState } from 'react';

export default function Docs() {
    const [testUrl, setTestUrl] = useState('');
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const runTest = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/download?url=${encodeURIComponent(testUrl)}&format=mp4`);
            const data = await res.json();
            setTestResult(data);
        } catch (e) { alert("Test Gagal"); }
        setLoading(false);
    };

    return (
        <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '40px 20px', fontFamily: 'monospace' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ color: '#f00' }}>{">"} WARUNGERIK API_DOCS</h1>

                <section style={{ margin: '40px 0', border: '1px solid #333', padding: '20px', borderRadius: '10px' }}>
                    <h2 style={{ color: '#0f0' }}>[+] Test API Console</h2>
                    <input
                        placeholder="Masukkan URL YouTube untuk tes..."
                        value={testUrl} onChange={(e) => setTestUrl(e.target.value)}
                        style={{ width: '70%', padding: '10px', background: '#111', border: '1px solid #444', color: '#0f0' }}
                    />
                    <button onClick={runTest} style={{ padding: '10px 20px', background: '#f00', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>
                        {loading ? 'RUNNING...' : 'EXECUTE'}
                    </button>

                    {testResult && (
                        <pre style={{ background: '#050505', padding: '15px', marginTop: '20px', color: '#0f0', border: '1px dashed #0f0', overflowX: 'auto' }}>
                            {JSON.stringify(testResult, null, 2)}
                        </pre>
                    )}
                </section>

                <section>
                    <h3>Endpoint: GET /api/download</h3>
                    <p>Params: url (string), format (mp3/mp4)</p>
                    <hr style={{ borderColor: '#222' }} />
                    <h4>PHP Example:</h4>
                    <pre style={{ color: '#fbbf24' }}>
                        {`$res = file_get_contents("https://apiyt-three.vercel.app/api/download?url=LINK&format=mp4");
$data = json_decode($res);
echo $data->download;`}
                    </pre>
                </section>
            </div>
        </div>
    );
}