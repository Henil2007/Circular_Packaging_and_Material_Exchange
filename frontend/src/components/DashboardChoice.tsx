import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────────────────────────────────
   Typewriter hook
───────────────────────────────────────── */
const TAGLINES = [
  'Trade surplus packaging across verified B2B networks.',
  'Reduce waste. Cut costs. Build greener supply chains.',
  'Turn excess inventory into revenue — instantly.',
  'AI-powered listings. Real-time buyer matching.',
  'Every kg recycled offsets carbon. Track your impact.',
];

function useTypewriter(lines: string[], typingSpeed = 42, pause = 2200) {
  const [displayed, setDisplayed] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = lines[lineIdx];
    let delay = deleting ? 18 : typingSpeed;

    if (!deleting && charIdx === current.length) {
      delay = pause;
      const t = setTimeout(() => setDeleting(true), delay);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setLineIdx(i => (i + 1) % lines.length);
      return;
    }
    const t = setTimeout(() => {
      setCharIdx(c => deleting ? c - 1 : c + 1);
      setDisplayed(current.slice(0, deleting ? charIdx - 1 : charIdx + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, lineIdx, lines, typingSpeed, pause]);

  return displayed;
}

/* ─────────────────────────────────────────
   Animated counting number hook
───────────────────────────────────────── */
function useCounter(target: number, duration = 1800, suffix = '') {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.floor(eased * target));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return value.toLocaleString() + suffix;
}

/* ─────────────────────────────────────────
   Circular Economy Flow SVG
───────────────────────────────────────── */
function CircularFlow() {
  const nodes = [
    { label: 'Manufacturer', icon: '🏭', cx: 260, cy: 70,  color: '#2563eb' },
    { label: 'Surplus Stock', icon: '📦', cx: 460, cy: 150, color: '#ea580c' },
    { label: 'LoopX Exchange',icon: '♻️', cx: 460, cy: 290, color: '#047857' },
    { label: 'Verified Buyer', icon: '🏢', cx: 260, cy: 370, color: '#7c3aed' },
    { label: 'Reprocessed',   icon: '🌿', cx:  60, cy: 290, color: '#0891b2' },
    { label: 'Raw Materials', icon: '⚙️', cx:  60, cy: 150, color: '#d97706' },
  ];

  // Curved paths connecting nodes in a circle
  const paths = [
    'M 280 75 C 360 75 440 120 445 148',
    'M 462 172 C 462 210 462 250 462 288',
    'M 448 308 C 390 360 320 372 282 372',
    'M 238 372 C 180 372 80 330 62 308',
    'M 60 268 C 60 230 60 190 60 172',
    'M 78 150 C 140 100 200 75 238 75',
  ];

  return (
    <div className="circular-flow-wrap">
      <div className="circular-flow-title">How LoopX Works</div>
      <div className="circular-flow-sub">Turning waste into value — endlessly</div>
      <svg viewBox="0 0 520 440" className="circular-flow-svg">
        {/* Animated dashed paths */}
        {paths.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="#e2e8f0" strokeWidth="2" />
            <path
              d={d}
              fill="none"
              stroke="url(#flowGrad)"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              strokeLinecap="round"
              style={{ animation: `dash-flow 2.5s linear infinite`, animationDelay: `${i * 0.4}s` }}
            />
          </g>
        ))}

        {/* Gradient def */}
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={i} style={{ animation: `node-pop 0.5s cubic-bezier(0.16,1,0.3,1) both`, animationDelay: `${i * 0.12}s` }}>
            <circle cx={n.cx} cy={n.cy} r="34" fill="white" stroke={n.color} strokeWidth="2.5"
              style={{ filter: `drop-shadow(0 4px 12px ${n.color}30)` }} />
            <circle cx={n.cx} cy={n.cy} r="34" fill={n.color} opacity="0.08" />
            <text x={n.cx} y={n.cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="20">{n.icon}</text>
            <text x={n.cx} y={n.cy + 50} textAnchor="middle" fontSize="11" fontWeight="600"
              fill="#475569" fontFamily="Inter, sans-serif">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   Live Activity Ticker
───────────────────────────────────────── */
const FEED_ITEMS = [
  { company: 'EcoTech Solutions', action: 'listed', qty: '320 kg', material: 'Cardboard', icon: '📦', color: '#92400e' },
  { company: 'GreenMart Pvt Ltd', action: 'purchased', qty: '1.2 t', material: 'Pallets', icon: '🪵', color: '#6d28d9' },
  { company: 'Reliance Packaging', action: 'listed', qty: '850 kg', material: 'HDPE Plastics', icon: '♻️', color: '#1e40af' },
  { company: 'Flipkart Logistics', action: 'purchased', qty: '400 kg', material: 'Cardboard', icon: '📦', color: '#92400e' },
  { company: 'Tata Consumer', action: 'listed', qty: '2.1 t', material: 'Wooden Pallets', icon: '🪵', color: '#6d28d9' },
  { company: 'ITC Limited', action: 'offset', qty: '1.8 t', material: 'CO₂ Saved', icon: '🌿', color: '#047857' },
  { company: 'Marico Industries', action: 'listed', qty: '600 kg', material: 'PET Plastics', icon: '♻️', color: '#1e40af' },
  { company: 'HUL Distribution', action: 'purchased', qty: '750 kg', material: 'Cardboard', icon: '📦', color: '#92400e' },
];

function LiveFeed() {
  const [items, setItems] = useState(FEED_ITEMS);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFadeIn(true);
      setTimeout(() => {
        setItems(prev => {
          const rotated = [...prev];
          rotated.push(rotated.shift()!);
          return rotated;
        });
        setFadeIn(false);
      }, 300);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const times = ['2s ago', '14s ago', '41s ago', '1m ago', '2m ago'];

  return (
    <div className="live-feed-card">
      <div className="live-feed-header">
        <span className="live-feed-dot" />
        Live Activity
      </div>
      <div className="live-feed-list">
        {items.slice(0, 5).map((item, i) => (
          <div key={i} className="live-feed-item" style={{
            opacity: i === 0 && fadeIn ? 0 : 1,
            transform: i === 0 && fadeIn ? 'translateY(-8px)' : 'translateY(0)',
            transition: 'all 0.3s ease',
          }}>
            <span className="feed-icon" style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color }}>
              {item.icon}
            </span>
            <div className="feed-text">
              <span className="feed-company">{item.company}</span>
              {' '}<span className="feed-action">{item.action}</span>{' '}
              <span className="feed-qty">{item.qty}</span>
              {' of '}<span className="feed-material">{item.material}</span>
            </div>
            <span className="feed-time">{times[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CO₂ Impact Calculator
───────────────────────────────────────── */
function ImpactCalculator() {
  const [kg, setKg] = useState(500);
  const co2 = (kg * 1.5 / 1000).toFixed(2);
  const trees = Math.round(kg * 0.008);
  const water = Math.round(kg * 4.2);

  return (
    <div className="impact-calc-card">
      <div className="impact-calc-title">
        <span>🌍</span> CO₂ Impact Calculator
      </div>
      <p className="impact-calc-sub">Drag to see your environmental impact</p>

      <div className="impact-slider-wrap">
        <input
          type="range" min="50" max="5000" value={kg}
          onChange={e => setKg(Number(e.target.value))}
          className="impact-slider"
        />
        <div className="impact-slider-label">
          <span className="impact-kg">{kg.toLocaleString()} kg</span>
          <span>of materials recycled</span>
        </div>
      </div>

      <div className="impact-results">
        <div className="impact-result-item">
          <div className="impact-result-icon" style={{ background: '#ecfdf5', color: '#047857' }}>🌿</div>
          <div className="impact-result-val">{co2} t</div>
          <div className="impact-result-label">CO₂ Offset</div>
        </div>
        <div className="impact-result-item">
          <div className="impact-result-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>💧</div>
          <div className="impact-result-val">{water.toLocaleString()}L</div>
          <div className="impact-result-label">Water Saved</div>
        </div>
        <div className="impact-result-item">
          <div className="impact-result-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>🌳</div>
          <div className="impact-result-val">{trees}</div>
          <div className="impact-result-label">Trees Equivalent</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Animated Stat
───────────────────────────────────────── */
function AnimStat({ target, suffix, label, icon, delay }: { target: number; suffix?: string; label: string; icon: string; delay?: number }) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const val = useCounter(started ? target : 0, 1800 + (delay || 0), suffix || '');

  return (
    <div className="metric" ref={ref}>
      <div style={{ fontSize: '26px', marginBottom: '8px' }}>{icon}</div>
      <div className="metric-val">{val}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────── */
interface ChoiceProps {
  onSelect: (choice: 'buy' | 'sell') => void;
}

export default function DashboardChoice({ onSelect }: ChoiceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const typeText = useTypewriter(TAGLINES);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.action-card');
    cards?.forEach((card, i) => {
      (card as HTMLElement).style.animationDelay = `${i * 0.1}s`;
    });
  }, []);

  /* 3D tilt on action cards */
  const handleTilt = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -12;
    el.style.transform = `translateY(-6px) rotateX(${x}deg) rotateY(${y}deg)`;
  };
  const resetTilt = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <div className="page-container" ref={containerRef} style={{ maxWidth: '1280px' }}>

      {/* ── Header ── */}
      <div className="dashboard-header">
        <span className="dashboard-eyebrow">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4" fill="currentColor" opacity="0.5" />
            <circle cx="5" cy="5" r="2" fill="currentColor" />
          </svg>
          Platform Live · India's #1 Circular Packaging Exchange
        </span>
        <h1 className="dashboard-title">
          The Future of{' '}
          <span className="dashboard-title-accent">Circular Commerce</span>
        </h1>
        <p className="dashboard-subtitle" style={{ minHeight: '28px' }}>
          {typeText}<span className="typewriter-cursor">|</span>
        </p>
      </div>

      {/* ── Action Cards ── */}
      <div className="dashboard-grid">
        <button
          onClick={() => onSelect('buy')}
          onMouseMove={handleTilt}
          onMouseLeave={resetTilt}
          className="action-card"
          id="buy-action-card"
          style={{ transformStyle: 'preserve-3d', perspective: '600px', transition: 'transform 0.2s ease, box-shadow 0.35s ease, border-color 0.35s ease' }}
        >
          <div className="action-card-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2 className="action-card-title">Procure Materials</h2>
          <p className="action-card-desc">
            Source high-quality recycled packaging — cardboard, plastics, pallets — from a global network of verified enterprises.
          </p>
          <div className="action-card-cta">
            Browse Marketplace
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>
          <div className="card-pill card-pill-green">BUY</div>
        </button>

        <button
          onClick={() => onSelect('sell')}
          onMouseMove={handleTilt}
          onMouseLeave={resetTilt}
          className="action-card action-card-sell"
          id="sell-action-card"
          style={{ transformStyle: 'preserve-3d', perspective: '600px', transition: 'transform 0.2s ease, box-shadow 0.35s ease, border-color 0.35s ease' }}
        >
          <div className="action-card-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <h2 className="action-card-title">List Surplus Inventory</h2>
          <p className="action-card-desc">
            Turn your excess packaging into revenue. AI-powered listing tools auto-fill details and match you with nearby buyers instantly.
          </p>
          <div className="action-card-cta">
            Create Listing
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </div>
          <div className="card-pill card-pill-blue">SELL</div>
        </button>
      </div>

      {/* ── Animated Stats ── */}
      <div className="metrics-bar" style={{ marginBottom: '32px' }}>
        <AnimStat target={2450} suffix="+" label="Active Listings" icon="📦" delay={0} />
        <div className="metric-divider" />
        <AnimStat target={850} suffix=" t" label="CO₂ Offset" icon="🌿" delay={100} />
        <div className="metric-divider" />
        <AnimStat target={342} label="Verified Enterprises" icon="🏢" delay={200} />
        <div className="metric-divider" />
        <AnimStat target={99} suffix="%" label="Platform Uptime" icon="⚡" delay={300} />
      </div>

      {/* ── Bottom 3-col Section ── */}
      <div className="dash-bottom-grid">
        <CircularFlow />
        <ImpactCalculator />
        <LiveFeed />
      </div>
    </div>
  );
}