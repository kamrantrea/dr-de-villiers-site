/* Small human touches, all optional and light:
   soft sounds (with a mute switch in the footer), a touch of haptics on phones,
   a gold reading-progress line, instant page loads, and a sparkle when something is sent. */
(() => {
    'use strict';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let muted = false;
    try { muted = localStorage.getItem('dcv-sound') === 'off'; } catch (e) { /* fine */ }

    /* ---- sounds: tiny synthesised notes, no audio files ---- */
    let ctx = null;
    const audio = () => {
        if (muted) return null;
        try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); } catch (e) { return null; }
        return ctx;
    };
    const note = (freq, start, dur, vol, type, glideTo) => {
        const a = audio(); if (!a) return;
        const t = a.currentTime + start;
        const o = a.createOscillator(), g = a.createGain();
        o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
        if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
    };
    const buzz = (ms) => { try { if (!muted && navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* not supported */ } };
    const Feel = window.Feel = {
        tap()   { note(330, 0, 0.05, 0.025, 'triangle'); buzz(6); },
        tick()  { note(880, 0, 0.09, 0.04, 'sine', 1320); buzz(10); },
        pop()   { note(520, 0, 0.07, 0.03, 'sine', 700); },
        chime() { note(784, 0, 0.5, 0.045); note(1175, 0.11, 0.7, 0.04); buzz([12, 40, 18]); },
        sparkle(host) {
            if (reduce || !host || !host.animate) return;
            const r = host.getBoundingClientRect();
            for (let i = 0; i < 12; i++) {
                const d = document.createElement('i');
                d.setAttribute('aria-hidden', 'true');
                d.style.cssText = `position:fixed;z-index:3000;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;width:6px;height:6px;border-radius:50%;background:${i % 3 ? '#d4b896' : '#b8956a'};pointer-events:none`;
                document.body.appendChild(d);
                const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.4, dist = 46 + Math.random() * 40;
                d.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * dist}px), calc(-50% + ${Math.sin(a) * dist}px)) scale(0)`, opacity: 0 }],
                    { duration: 700 + Math.random() * 250, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => d.remove();
            }
        }
    };

    /* ---- mute switch, added to every footer ---- */
    const list = document.querySelector('.footer-links ul:last-child');
    if (list) {
        const li = document.createElement('li');
        li.innerHTML = '<button type="button" class="sound-btn"></button>';
        const btn = li.firstChild;
        const paint = () => { btn.textContent = muted ? 'Sounds: off' : 'Sounds: on'; btn.setAttribute('aria-pressed', String(!muted)); };
        btn.addEventListener('click', () => { muted = !muted; try { localStorage.setItem('dcv-sound', muted ? 'off' : 'on'); } catch (e) { /* fine */ } paint(); Feel.tap(); });
        paint(); list.appendChild(li);
    }

    /* ---- reading progress: a hairline of gold under the header ---- */
    const header = document.querySelector('.site-header');
    if (header && !reduce) {
        const bar = document.createElement('i');
        bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
        header.appendChild(bar);
        let ticking = false;
        const upd = () => {
            const max = document.documentElement.scrollHeight - innerHeight;
            bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
            ticking = false;
        };
        addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
        upd();
    }

    /* ---- pages open instantly: prefetch a link as soon as a finger or pointer is about to use it ---- */
    const seen = new Set();
    const warm = (e) => {
        const a = e.target.closest && e.target.closest('a[href]');
        if (!a || a.origin !== location.origin || a.target === '_blank') return;
        const u = a.pathname + a.search;
        if (u === location.pathname + location.search || seen.has(u) || /\.(png|jpg|svg|pdf)$/i.test(u)) return;
        seen.add(u);
        const l = document.createElement('link'); l.rel = 'prefetch'; l.href = a.href; document.head.appendChild(l);
    };
    document.addEventListener('pointerover', warm, { passive: true });
    document.addEventListener('touchstart', warm, { passive: true });

    /* ---- a soft tap on the main buttons ---- */
    document.addEventListener('click', (e) => {
        if (e.target.closest('.menu-btn, .cat, .tick-row button, .pair, .qty button, .chip')) Feel.tap();
    });
})();
