import React, { useState } from 'react';

export default function IteraPlayStarter(){
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [credits, setCredits] = useState(() => {
    const c = localStorage.getItem('credits');
    if (c === null) { localStorage.setItem('credits', '3'); return 3; }
    return parseInt(c);
  });

  function updateCredits(v){ localStorage.setItem('credits', String(v)); setCredits(v); }

  async function handleConvert(e){
    e && e.preventDefault();
    if(!link) return;
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch('/api/convert', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ url: link })
      });
      const data = await resp.json();
      if(data.success){
        setResult(data);
      } else {
        alert(data.message || 'Conversion failed');
      }
    } catch(err){
      alert('Network error or backend not running.');
    } finally {
      setLoading(false);
    }
  }

  function useCreditAndDownload(downloadUrl){
    let c = parseInt(localStorage.getItem('credits') || '0');
    if(c > 0){
      c -= 1;
      localStorage.setItem('credits', String(c));
      setCredits(c);
      // start download via proxy to avoid CORS if needed
      window.open('/api/proxy?url=' + encodeURIComponent(downloadUrl) + '&name=' + encodeURIComponent(result.filename), '_blank');
    } else {
      // show shortlink page
      // for demo we simulate shortlink completion
      const ok = confirm('You have 0 credits. Click OK to open shortlink (simulate). After closing, you will get 5 credits.');
      if(ok){
        // open shortener (GPLink) - replace with actual shortener URL
        window.open('https://gplink.example.com/?r=demo', '_blank');
        // simulate unlock after shortlink
        updateCredits(5);
        alert('Credits unlocked: 5');
      }
    }
  }

  return (
    <div className="container">
      <div className="card">
        <form onSubmit={handleConvert}>
          <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Paste TeraBox share link here" style={{width:'100%', padding:12, borderRadius:10, border:'1px solid rgba(255,255,255,0.04)', background:'rgba(255,255,255,0.01)', color:'#eaf2ff'}} />
          <div style={{display:'flex', gap:10, marginTop:12}}>
            <button className="btn play" onClick={handleConvert} disabled={loading} style={{flex:1}}>{loading? 'Processing...':'Get Details'}</button>
            <div style={{padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.02)', color:'#9aa6b2'}}>Credits: {credits}</div>
          </div>
        </form>

        {result && (
          <div style={{marginTop:18}}>
            <img className="thumb" src={result.thumbnail || 'https://via.placeholder.com/800x450?text=No+Preview'} alt="thumb"/>
            <div className="meta">
              <div className="title">{result.filename}</div>
              <div className="row">
                <div className="badge">{(result.size && (Math.round(result.size/1024/1024*100)/100)+' MB') || 'Unknown size'}</div>
                <div className="badge">720p</div>
                <div className="badge">video</div>
              </div>

              <div className="buttons">
                <button className="btn play" onClick={()=>{ window.open(result.stream_url || result.download_url, '_blank'); }}>Play</button>
                <button className="btn fastplay" onClick={()=>{ window.open(result.stream_url || result.download_url + '?fast=1', '_blank'); }}>Fast Play</button>
                <button className="btn download" onClick={()=> useCreditAndDownload(result.download_url)}>Download</button>
                <button className="btn fastdownload" onClick={()=> useCreditAndDownload(result.download_url)}>Fast Download</button>
              </div>
              <div className="info">If Download fails use Proxy button</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
