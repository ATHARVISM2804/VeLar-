/* ============================================================
   Velar. — Sections 7 to 12  (Residences, Story, Process,
   Testimonials, Inquire, Footer) + shared helpers/icons.
   Loaded as a separate Babel module; exports to window.
   Wrapped in an IIFE so its top-level consts don't collide
   with the main script's shared global lexical scope.
   ============================================================ */
(function () {
const { useState, useEffect, useRef, useCallback } = React;

/* ---------------- palette ---------------- */
const DARK = '#1a1a1a';
const INK = '#213138';
const BG = '#f5f0ea';
const ACCENT = '#a07c50';

const clampN = (v, a, b) => Math.max(a, Math.min(b, v));

const RES_MEDIA = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154759_4cdc8175-8261-497c-b688-9477c76545d4.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154751_39b1b9bb-2708-4211-b6a2-d39f93309e52.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154737_eba7900c-0313-483c-a30a-632c747ccc42.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_144009_4348fe33-f885-4345-8e92-3fe1c2625d32.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_145337_e44eaa8c-6bb1-4a6e-a70f-ed0231cbaccb.mp4',
];

const LISTINGS = [
  { title: 'The Linnea Pavilion', place: 'Aspen, Colorado',     price: 'Price on request', beds: 5, baths: 6, area: '8,400 sq ft',  media: RES_MEDIA[0] },
  { title: 'Villa Sereno',        place: 'Lake Como, Italy',     price: 'Price on request', beds: 6, baths: 7, area: '11,200 sq ft', media: RES_MEDIA[1] },
  { title: 'The Onyx Penthouse',  place: 'New York, New York',   price: 'Price on request', beds: 4, baths: 5, area: '6,100 sq ft',  media: RES_MEDIA[2] },
  { title: 'Cliffside Maison',    place: 'Big Sur, California',  price: 'Price on request', beds: 5, baths: 6, area: '9,000 sq ft',  media: RES_MEDIA[3] },
  { title: 'Maison Lumiere',      place: 'Saint Tropez, France', price: 'Price on request', beds: 6, baths: 8, area: '12,500 sq ft', media: RES_MEDIA[4] },
];

/* ================= ICONS (inline Lucide) ================= */
function Icon({ size = 24, color = 'currentColor', stroke = 1.6, fill = 'none', children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {children}
    </svg>
  );
}
const ArrowUpRight = (p) => <Icon {...p}><path d="M7 17 17 7" /><path d="M7 7h10v10" /></Icon>;
const ArrowRight = (p) => <Icon {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>;
const MailIcon = (p) => <Icon {...p}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></Icon>;
const PhoneIcon = (p) => <Icon {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></Icon>;
const MapPinIcon = (p) => <Icon {...p}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></Icon>;
const CheckIcon = (p) => <Icon {...p}><path d="M20 6 9 17l-5-5" /></Icon>;
const QuoteIcon = ({ size = 40, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" style={{ flexShrink: 0 }}>
    <path d="M10.6 5.2A1 1 0 0 0 9.7 5 7 7 0 0 0 5 11.7V18a1 1 0 0 0 1 1h4.3a1 1 0 0 0 1-1v-4.3a1 1 0 0 0-1-1H8.1a4 4 0 0 1 2.9-3.8 1 1 0 0 0 .7-1.2l-.3-1.3a1 1 0 0 0-.8-.9Zm9 0A1 1 0 0 0 18.7 5a7 7 0 0 0-4.7 6.7V18a1 1 0 0 0 1 1h4.3a1 1 0 0 0 1-1v-4.3a1 1 0 0 0-1-1h-2.2a4 4 0 0 1 2.9-3.8 1 1 0 0 0 .7-1.2l-.3-1.3a1 1 0 0 0-.8-.9Z" />
  </svg>
);

/* ================= SHARED HELPERS ================= */
function Reveal({ children, delay = 0, className = '', style = {}, as = 'div', innerRef }) {
  const localRef = useRef(null);
  const ref = innerRef || localRef;
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { setShown(true); obs.disconnect(); }
      });
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref} className={className} style={{
      ...style,
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : 'translateY(44px)',
      transition: `opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      willChange: 'opacity, transform',
    }}>
      {children}
    </Tag>
  );
}

function useScrollProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(clampN((vh - rect.top) / (vh + rect.height), 0, 1));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
}

/* small reusable eyebrow with hairline */
function Eyebrow({ text, light }) {
  const col = light ? 'rgba(245,240,234,0.55)' : 'rgba(33,49,56,0.55)';
  const rule = light ? 'rgba(245,240,234,0.4)' : INK;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ width: 40, height: 1, background: rule, opacity: light ? 1 : 0.4, display: 'block' }} />
      <span className="font-inter" style={{
        textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.22em',
        fontSize: 'clamp(11px, 0.85vw, 13px)', color: col,
      }}>{text}</span>
    </div>
  );
}

/* ================= SECTION 7 — RESIDENCES ================= */
function ResidenceCard({ item, index }) {
  const mediaRef = useRef(null);
  const progress = useScrollProgress(mediaRef);
  const ty = (-progress + 0.5) * 6;
  return (
    <Reveal delay={index * 110} className="s7-card" style={{ cursor: 'pointer' }}>
      <div className="s7-media" ref={mediaRef} style={{
        position: 'relative', overflow: 'hidden', borderRadius: 14, aspectRatio: '3 / 4',
      }}>
        <video className="s7-video" src={item.media} autoPlay loop muted playsInline style={{
          objectFit: 'cover', width: '100%', height: '110%', display: 'block',
          transform: `translateY(${ty}%)`, transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, transparent 55%, rgba(26,26,26,0.45) 100%)',
        }} />
        <div className="s7-chip">
          <ArrowUpRight size={18} color={INK} />
        </div>
      </div>
      <div className="s7-meta" style={{ marginTop: 'clamp(14px, 1.4vw, 20px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <span className="font-syne" style={{ fontWeight: 700, color: INK, fontSize: 'clamp(18px, 1.5vw, 24px)', letterSpacing: '-0.02em' }}>{item.title}</span>
          <span className="font-inter" style={{ fontWeight: 400, color: 'rgba(33,49,56,0.5)', fontSize: 'clamp(11px, 0.85vw, 13px)', whiteSpace: 'nowrap' }}>{item.price}</span>
        </div>
        <span className="font-inter" style={{ fontWeight: 400, color: 'rgba(33,49,56,0.6)', fontSize: 'clamp(13px, 1vw, 15px)', marginTop: 4 }}>{item.place}</span>
        <div className="font-inter" style={{
          marginTop: 'clamp(10px, 1vw, 14px)', paddingTop: 'clamp(10px, 1vw, 14px)',
          borderTop: '1px solid rgba(33,49,56,0.15)', display: 'flex', alignItems: 'center', gap: 10,
          fontWeight: 400, color: 'rgba(33,49,56,0.7)', fontSize: 'clamp(12px, 0.9vw, 14px)',
        }}>
          <span>{item.beds} Beds</span><span style={{ opacity: 0.5 }}>·</span>
          <span>{item.baths} Baths</span><span style={{ opacity: 0.5 }}>·</span>
          <span>{item.area}</span>
        </div>
      </div>
    </Reveal>
  );
}

function Section7() {
  return (
    <section id="residences" className="px-6 md:px-10 lg:px-16" style={{
      background: BG, position: 'relative', zIndex: 26,
      paddingTop: 'clamp(90px, 12vw, 180px)', paddingBottom: 'clamp(90px, 12vw, 180px)',
    }}>
      <div className="s7-head" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal><Eyebrow text="Selected Residences" /></Reveal>
        <Reveal delay={120}>
          <h2 className="s7-title font-syne" style={{
            fontWeight: 800, color: INK, textTransform: 'uppercase', letterSpacing: '-0.03em',
            lineHeight: 0.95, fontSize: 'clamp(34px, 5.5vw, 88px)', marginTop: 'clamp(16px, 2vw, 28px)', margin: 'clamp(16px, 2vw, 28px) 0 0',
          }}>A portfolio of<br />permanence.</h2>
        </Reveal>
      </div>

      <div className="s7-grid" style={{
        maxWidth: 1280, margin: 'clamp(48px, 6vw, 96px) auto 0', display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(20px, 2.5vw, 40px)',
      }}>
        {LISTINGS.map((item, i) => <ResidenceCard key={item.title} item={item} index={i} />)}
      </div>

      <Reveal>
        <div className="s7-all" style={{ textAlign: 'center', marginTop: 'clamp(48px, 6vw, 88px)' }}>
          <a href="#residences" className="s7-all-link" onClick={(e) => e.preventDefault()}>
            <span className="font-syne" style={{ fontWeight: 700, fontSize: 'clamp(15px, 1.2vw, 18px)', color: INK }}>View the full collection</span>
            <span className="s7-arrow" style={{ display: 'inline-flex' }}><ArrowRight size={18} color={INK} /></span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= SECTION 8 — STORY ================= */
function Section8() {
  const principles = [
    { t: 'Provenance', b: 'Each estate is sourced privately, vetted for title, structure, and lineage, and presented only when its story is whole.' },
    { t: 'Restraint', b: 'We present fewer homes with deeper attention. A short list is a promise, not a limitation.' },
    { t: 'Permanence', b: 'Architecture that ages into character. We favour homes built to outlast the trends that surround them.' },
  ];
  return (
    <section id="story" className="px-6 md:px-10 lg:px-16" style={{
      background: BG, position: 'relative', zIndex: 26,
      paddingTop: 'clamp(40px, 6vw, 100px)', paddingBottom: 'clamp(100px, 14vw, 200px)',
    }}>
      <div className="s8-wrap" style={{
        maxWidth: 1280, margin: '0 auto', display: 'grid',
        gridTemplateColumns: '0.9fr 1.1fr', gap: 'clamp(40px, 6vw, 120px)', alignItems: 'start',
      }}>
        <div className="s8-sticky" style={{ position: 'sticky', top: 'clamp(110px, 14vh, 180px)', alignSelf: 'start' }}>
          <Reveal><Eyebrow text="Our Standard" /></Reveal>
          <Reveal delay={100}>
            <h2 className="font-syne" style={{
              fontWeight: 800, color: INK, letterSpacing: '-0.03em', lineHeight: 0.96,
              fontSize: 'clamp(30px, 4vw, 64px)', margin: 'clamp(16px, 2vw, 26px) 0 0',
            }}>Discipline,<br />not decoration.</h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="font-inter" style={{
              fontWeight: 300, color: 'rgba(33,49,56,0.7)', lineHeight: 1.7,
              fontSize: 'clamp(15px, 1.1vw, 18px)', maxWidth: 380, margin: 'clamp(20px, 2.5vw, 32px) 0 0',
            }}>We do not list property. We curate permanence. Every residence passes a single test before it earns the Velar name. Will it still feel inevitable in fifty years.</p>
          </Reveal>
        </div>

        <div className="s8-list">
          {principles.map((p, i) => (
            <Reveal key={p.t} delay={i * 80} className="s8-item" style={{
              padding: 'clamp(28px, 3.5vw, 56px) 0',
              borderTop: '1px solid rgba(33,49,56,0.15)',
              borderBottom: i === principles.length - 1 ? '1px solid rgba(33,49,56,0.15)' : 'none',
            }}>
              <div className="font-syne" style={{ fontWeight: 800, fontSize: 'clamp(34px, 4vw, 64px)', color: 'rgba(33,49,56,0.18)', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</div>
              <h3 className="font-syne" style={{ fontWeight: 700, color: INK, fontSize: 'clamp(20px, 1.8vw, 30px)', letterSpacing: '-0.02em', margin: 'clamp(10px, 1vw, 16px) 0 0' }}>{p.t}</h3>
              <p className="font-inter" style={{ fontWeight: 300, color: 'rgba(33,49,56,0.65)', lineHeight: 1.65, fontSize: 'clamp(14px, 1vw, 16px)', margin: 'clamp(8px, 0.8vw, 12px) 0 0', maxWidth: 460 }}>{p.b}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= SECTION 9 — PROCESS ================= */
function Section9({ innerRef }) {
  const stepsRef = useRef(null);
  const progress = useScrollProgress(stepsRef);
  const steps = [
    { t: 'Introduction', b: 'A private conversation to understand the life you are building, not just the home.' },
    { t: 'Curation', b: 'We assemble a tailored shortlist, often including residences never shown publicly.' },
    { t: 'Acquisition', b: 'Negotiation, diligence, and structuring, handled quietly end to end.' },
    { t: 'Stewardship', b: 'Relationship continues past the sale, from staffing to resale, for as long as you hold the home.' },
  ];
  return (
    <section ref={innerRef} className="s9-section px-6 md:px-10 lg:px-16" style={{
      background: DARK, position: 'relative', zIndex: 26, overflow: 'hidden',
      paddingTop: 'clamp(90px, 12vw, 170px)', paddingBottom: 'clamp(90px, 12vw, 170px)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <Reveal><div style={{ display: 'inline-flex' }}>
          <span className="font-inter" style={{ textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.22em', fontSize: 'clamp(11px, 0.85vw, 13px)', color: 'rgba(255,255,255,0.55)' }}>The Experience</span>
        </div></Reveal>
        <Reveal delay={120}>
          <h2 className="font-syne" style={{ fontWeight: 800, color: BG, letterSpacing: '-0.03em', lineHeight: 1, fontSize: 'clamp(30px, 4.5vw, 68px)', margin: 'clamp(14px, 1.6vw, 22px) 0 0' }}>From first call to final key.</h2>
        </Reveal>
      </div>

      <div className="s9-steps" ref={stepsRef} style={{
        maxWidth: 1100, margin: 'clamp(56px, 7vw, 110px) auto 0', position: 'relative',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(20px, 3vw, 48px)',
      }}>
        <svg className="s9-line-svg" viewBox="0 0 1000 56" preserveAspectRatio="none" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: 56, pointerEvents: 'none', overflow: 'visible', zIndex: 0,
        }}>
          <path d="M125 28 L875 28" pathLength="1" fill="none" stroke="rgba(160,124,80,0.7)"
            strokeWidth="1.5" strokeLinecap="round"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 - progress, transition: 'stroke-dashoffset 0.1s linear' }} />
        </svg>

        {steps.map((s, i) => (
          <Reveal key={s.t} delay={i * 130} className="s9-step" style={{ position: 'relative', zIndex: 1 }}>
            <div className="s9-num" style={{
              width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(245,240,234,0.25)',
              background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
            }}>
              <span className="font-syne" style={{ fontWeight: 700, color: BG, fontSize: 'clamp(16px, 1.3vw, 20px)' }}>{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="font-syne" style={{ fontWeight: 700, color: BG, fontSize: 'clamp(17px, 1.4vw, 22px)', letterSpacing: '-0.02em', margin: 'clamp(16px, 1.6vw, 24px) 0 0' }}>{s.t}</h3>
            <p className="font-inter" style={{ fontWeight: 300, color: 'rgba(245,240,234,0.6)', lineHeight: 1.6, fontSize: 'clamp(13px, 0.95vw, 15px)', margin: 'clamp(8px, 0.8vw, 12px) auto 0', maxWidth: 220 }}>{s.b}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= SECTION 10 — TESTIMONIALS ================= */
function Section10() {
  const quotes = [
    { q: 'Velar found a house we did not know existed, in a market we thought we understood.', a: 'Eleanor V., Private Collector' },
    { q: 'The shortlist was three homes. Every one of them was right. That is the whole craft.', a: 'Marcus T., Family Office Principal' },
    { q: 'They sold the trends and kept the architecture. We have never looked back.', a: 'Sofia and Daniel R., Lake Como' },
  ];
  const [active, setActive] = useState(0);
  const timer = useRef(null);
  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setActive((a) => (a + 1) % quotes.length), 5500);
  }, []);
  useEffect(() => { start(); return () => clearInterval(timer.current); }, [start]);
  const jump = (i) => { setActive(i); start(); };

  return (
    <section className="s10-section px-6 md:px-10 lg:px-16" style={{
      background: BG, position: 'relative', zIndex: 26,
      paddingTop: 'clamp(100px, 13vw, 190px)', paddingBottom: 'clamp(100px, 13vw, 190px)',
    }}>
      <Reveal>
        <div className="s10-wrap" style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center', position: 'relative', minHeight: 'clamp(280px, 30vw, 360px)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto clamp(24px, 3vw, 40px)' }}>
            <QuoteIcon size={48} color="rgba(160,124,80,0.5)" />
          </div>
          <div style={{ position: 'relative' }}>
            {quotes.map((item, i) => (
              <div key={i} style={{
                position: i === 0 ? 'relative' : 'absolute', top: 0, left: 0, right: 0,
                opacity: active === i ? 1 : 0, transition: 'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
                pointerEvents: active === i ? 'auto' : 'none',
              }}>
                <p className="font-syne" style={{ fontWeight: 700, color: INK, letterSpacing: '-0.02em', lineHeight: 1.3, fontSize: 'clamp(22px, 3vw, 42px)', margin: 0 }}>{item.q}</p>
                <p className="font-inter" style={{ fontWeight: 400, color: 'rgba(33,49,56,0.55)', fontSize: 'clamp(13px, 1vw, 15px)', letterSpacing: '0.04em', margin: 'clamp(20px, 2.4vw, 32px) 0 0' }}>{item.a}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 'clamp(36px, 4vw, 56px)' }}>
            {quotes.map((_, i) => (
              <button key={i} aria-label={`Quote ${i + 1}`} onClick={() => jump(i)} style={{
                width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0,
                background: active === i ? INK : 'rgba(33,49,56,0.25)', transition: 'background 0.3s ease',
              }} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= SECTION 11 — INQUIRE ================= */
function Section11({ innerRef }) {
  const [form, setForm] = useState({ name: '', email: '', budget: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const fieldStyle = {
    background: 'transparent', border: 'none', borderBottom: '1px solid rgba(245,240,234,0.2)',
    padding: '12px 0', color: BG, fontFamily: "'Inter', sans-serif", fontWeight: 400,
    fontSize: 'clamp(14px, 1.1vw, 16px)', outline: 'none', width: '100%',
    transition: 'border-color 0.4s ease',
  };
  const onFocus = (e) => (e.target.style.borderBottomColor = 'rgba(160,124,80,0.9)');
  const onBlur = (e) => (e.target.style.borderBottomColor = 'rgba(245,240,234,0.2)');

  return (
    <section id="inquire" ref={innerRef} className="s11-section px-6 md:px-10 lg:px-16" style={{
      background: DARK, position: 'relative', zIndex: 26, overflow: 'hidden',
      paddingTop: 'clamp(100px, 13vw, 190px)', paddingBottom: 'clamp(100px, 13vw, 190px)',
    }}>
      <div className="font-syne" aria-hidden="true" style={{
        position: 'absolute', bottom: '-0.18em', left: '50%', transform: 'translateX(-50%)',
        fontWeight: 800, fontSize: 'clamp(120px, 22vw, 320px)', color: 'rgba(245,240,234,0.04)',
        whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', zIndex: 0,
      }}>Velar.</div>

      <div className="s11-grid" style={{
        position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 6vw, 100px)', alignItems: 'start',
      }}>
        <div>
          <Reveal><div style={{ display: 'inline-flex' }}>
            <span className="font-inter" style={{ textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.22em', fontSize: 'clamp(11px, 0.85vw, 13px)', color: 'rgba(245,240,234,0.55)' }}>Inquire</span>
          </div></Reveal>
          <Reveal delay={100}>
            <h2 className="font-syne" style={{ fontWeight: 800, color: BG, letterSpacing: '-0.03em', lineHeight: 0.98, fontSize: 'clamp(34px, 5vw, 76px)', margin: 'clamp(14px, 1.6vw, 22px) 0 0' }}>Begin a<br />private<br />conversation.</h2>
          </Reveal>
          <Reveal delay={180}>
            <div style={{ marginTop: 'clamp(32px, 4vw, 56px)', display: 'flex', flexDirection: 'column' }}>
              {[
                { icon: <MailIcon size={16} color="rgba(160,124,80,0.9)" />, t: 'private@velar.estate' },
                { icon: <PhoneIcon size={16} color="rgba(160,124,80,0.9)" />, t: '+1 (212) 000 0000' },
                { icon: <MapPinIcon size={16} color="rgba(160,124,80,0.9)" />, t: 'New York · London · Como' },
              ].map((r, i) => (
                <div key={i} className="font-inter" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(245,240,234,0.7)', fontWeight: 400, fontSize: 'clamp(14px, 1vw, 16px)', lineHeight: 2 }}>
                  {r.icon}<span>{r.t}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          {!sent ? (
            <div className="s11-form" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 2vw, 28px)' }}>
              <input style={fieldStyle} placeholder="Full name" value={form.name} onChange={set('name')} onFocus={onFocus} onBlur={onBlur} />
              <input style={fieldStyle} placeholder="Email" value={form.email} onChange={set('email')} onFocus={onFocus} onBlur={onBlur} />
              <input style={fieldStyle} placeholder="Budget range" value={form.budget} onChange={set('budget')} onFocus={onFocus} onBlur={onBlur} />
              <textarea rows={3} style={{ ...fieldStyle, resize: 'none' }} placeholder="Tell us what you are looking for" value={form.message} onChange={set('message')} onFocus={onFocus} onBlur={onBlur} />
              <button className="s11-submit" onClick={() => setSent(true)} style={{
                marginTop: 'clamp(8px, 1vw, 16px)', alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: "'Syne', sans-serif", fontWeight: 700, color: DARK, background: BG, cursor: 'pointer',
                padding: 'clamp(14px, 1.4vw, 18px) clamp(28px, 3vw, 40px)', borderRadius: 999, border: 'none',
                fontSize: 'clamp(14px, 1.1vw, 16px)', transition: 'background 0.4s ease',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e8e0d6')}
                onMouseLeave={(e) => (e.currentTarget.style.background = BG)}>
                Send inquiry
                <span className="s11-arrow" style={{ display: 'inline-flex' }}><ArrowRight size={18} color={DARK} /></span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', animation: 's11fade 0.6s ease both' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(160,124,80,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <CheckIcon size={24} color="rgba(160,124,80,0.95)" stroke={1.8} />
              </div>
              <h3 className="font-syne" style={{ fontWeight: 700, color: BG, fontSize: 'clamp(26px, 3vw, 40px)', letterSpacing: '-0.02em', margin: 0 }}>Thank you.</h3>
              <p className="font-inter" style={{ fontWeight: 300, color: 'rgba(245,240,234,0.65)', fontSize: 'clamp(15px, 1.1vw, 17px)', lineHeight: 1.6, margin: '14px 0 0', maxWidth: 360 }}>A Velar advisor will be in touch within one business day.</p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ================= SECTION 12 — FOOTER ================= */
function Section12({ innerRef }) {
  const cols = [
    { h: 'Explore', links: ['Residences', 'Story', 'The Experience', 'Inquire'] },
    { h: 'Company', links: ['About Velar', 'Careers', 'Press', 'Journal'] },
    { h: 'Connect', links: ['Instagram', 'LinkedIn', 'Email', 'WeChat'] },
  ];
  const marqueeWord = 'Velar.\u2002·\u2002';
  return (
    <footer ref={innerRef} className="s12-footer px-6 md:px-10 lg:px-16" style={{
      background: DARK, position: 'relative', zIndex: 26, overflow: 'hidden',
      paddingTop: 'clamp(70px, 9vw, 130px)', paddingBottom: 'clamp(28px, 3vw, 44px)',
    }}>
      <div className="s12-top" style={{
        maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
        gap: 'clamp(28px, 4vw, 64px)', paddingBottom: 'clamp(48px, 6vw, 90px)', borderBottom: '1px solid rgba(245,240,234,0.12)',
      }}>
        <div>
          <span className="font-syne text-3xl" style={{ color: BG }}>
            <span style={{ fontWeight: 700 }}>Velar</span><span style={{ fontWeight: 900 }}>.</span>
          </span>
          <p className="font-inter" style={{ fontWeight: 300, color: 'rgba(245,240,234,0.55)', lineHeight: 1.6, fontSize: 'clamp(13px, 1vw, 15px)', maxWidth: 280, margin: 'clamp(14px, 1.4vw, 20px) 0 0' }}>Permanence, privately sourced. A curated portfolio of the world's most enduring homes.</p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <div className="font-inter" style={{ textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.18em', color: 'rgba(245,240,234,0.45)', fontSize: 'clamp(11px, 0.8vw, 12px)', marginBottom: 'clamp(14px, 1.4vw, 20px)' }}>{c.h}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {c.links.map((l) => (
                <a key={l} href="#" onClick={(e) => e.preventDefault()} className="s12-link font-inter" style={{
                  fontWeight: 400, color: 'rgba(245,240,234,0.7)', fontSize: 'clamp(13px, 1vw, 15px)', lineHeight: 2.1, textDecoration: 'none',
                }}>{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="s12-marquee" style={{ marginTop: 'clamp(40px, 5vw, 72px)', overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="s12-track" style={{ display: 'flex', width: 'max-content' }}>
          {[0, 1].map((k) => (
            <span key={k} className="font-syne" style={{ fontWeight: 800, fontSize: 'clamp(56px, 12vw, 160px)', color: 'rgba(245,240,234,0.06)', whiteSpace: 'nowrap', paddingRight: '0.4em' }}>{marqueeWord.repeat(6)}</span>
          ))}
        </div>
      </div>

      <div className="s12-bottom" style={{
        maxWidth: 1280, margin: 'clamp(28px, 3vw, 44px) auto 0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', fontSize: 'clamp(11px, 0.85vw, 13px)',
        color: 'rgba(245,240,234,0.45)', fontFamily: "'Inter', sans-serif", fontWeight: 400,
      }}>
        <span>© 2026 Velar Estates. All rights reserved.</span>
        <span style={{ display: 'flex', gap: 18 }}>
          <a href="#" onClick={(e) => e.preventDefault()} className="s12-link" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()} className="s12-link" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
        </span>
      </div>
    </footer>
  );
}

/* ================= EXPORT ================= */
Object.assign(window, {
  Section7, Section8, Section9, Section10, Section11, Section12,
});
})();
