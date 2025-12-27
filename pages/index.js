import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import html2canvas from 'html2canvas';

export default function GenLayerRankCheck() {
  const [query, setQuery] = useState('');
  const [allMembers, setAllMembers] = useState([]);
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const cardRef = useRef(null);

  const LOGO_URL = "https://www.genlayer.com/favicon.ico";

  const getRankData = (lvl) => {
    if (lvl >= 54) return { label: 'SINGULARITY 🎖️🎊', color: '#22C55E' };
    if (lvl >= 36) return { label: 'BRAIN', color: '#A855F7' };
    if (lvl >= 18) return { label: 'SYNAPSE', color: '#3B82F6' };
    if (lvl >= 7)  return { label: 'NEURON', color: '#FB923C' };
    return { label: 'MOLECULE', color: '#FACC15' };
  };

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(data => {
      setAllMembers(Array.isArray(data) ? data : []);
      setIsSyncing(false);
    }).catch(() => setIsSyncing(false));
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = allMembers
        .filter(m => m.username.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
    } else { setSuggestions([]); }
  }, [query, allMembers]);

  const handleSelect = (s) => {
    const rank = allMembers.findIndex(m => m.id === s.id) + 1;
    setUser({ ...s, rank });
    setQuery(s.username);
    setSuggestions([]);
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: '#000' });
    const link = document.createElement('a');
    link.download = `GenLayer_${user.username}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (isSyncing) return (
    <div style={{background:'#000', height:'100vh', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'20px'}}>
      <h2 style={{letterSpacing:'4px', fontSize:'14px'}}>SYNCING 5,000 MEMBERS... PLEASE WAIT</h2>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <Head><title>GenLayer Rank Check</title></Head>
      <div style={{ maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
        <img src={LOGO_URL} style={{ width: '60px', marginBottom: '10px' }} alt="logo" />
        <h1 style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '2px', marginBottom: '30px' }}>GENLAYER RANK CHECK</h1>

        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <input 
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #222', backgroundColor: '#080808', color: '#fff' }}
            placeholder="Start typing (e.g. Gem...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {suggestions.length > 0 && (
            <div style={{ position: 'absolute', width: '100%', background: '#111', border: '1px solid #333', borderRadius: '0 0 12px 12px', zIndex: 100 }}>
              {suggestions.map(s => (
                <div key={s.id} onClick={() => handleSelect(s)} style={{ padding: '15px', borderBottom: '1px solid #222', cursor: 'pointer', textAlign: 'left' }}>
                  {s.username} <span style={{color: getRankData(s.level).color, float: 'right'}}>Lvl {s.level}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {user && (
          <div style={{animation: 'fadeIn 0.5s'}}>
            <div ref={cardRef} style={{ background: '#000', border: `3px solid ${getRankData(user.level).color}`, padding: '30px', borderRadius: '30px' }}>
              <h2 style={{ color: getRankData(user.level).color, fontSize: '38px', margin: '0' }}>{user.username.toUpperCase()}</h2>
              <p style={{ color: '#444', fontSize: '12px' }}>RANK #{user.rank}</p>
              <h1 style={{ color: getRankData(user.level).color, fontStyle: 'italic', fontSize: '28px' }}>{getRankData(user.level).label}</h1>
            </div>
            <button onClick={downloadImage} style={{ marginTop: '20px', padding: '15px', width: '100%', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor:'#fff', color:'#000', border:'none' }}>
              📸 SAVE RANK IMAGE
            </button>
          </div>
        )}
      </div>
    </div>
  );
    }
