/* The collagen factory: an interactive, simplified illustration.
   No libraries. Everything is drawn as SVG and redrawn from one number, t (0 to 1 = time). */
(() => {
    'use strict';
    const $ = (s, r = document) => r.querySelector(s);
    const NS = 'http://www.w3.org/2000/svg';
    const svg = $('#cf');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // footer Instagram link (same config.js as the main site)
    const ig = document.querySelector('[data-cfg="instagram"]');
    if (ig && window.SITE && window.SITE.instagram) {
        ig.href = 'https://instagram.com/' + window.SITE.instagram.replace('@', '');
        ig.target = '_blank'; ig.rel = 'noopener'; ig.hidden = false;
    }

    /* ---------- helpers ---------- */
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const el = (name, attrs = {}, parent) => {
        const n = document.createElementNS(NS, name);
        for (const k in attrs) n.setAttribute(k, attrs[k]);
        if (parent) parent.appendChild(n);
        return n;
    };
    const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const mix = (a, b, t) => {
        const A = hex(a), B = hex(b);
        return 'rgb(' + A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',') + ')';
    };
    // seeded random so the picture is identical every visit
    const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const rnd = rng(11);

    /* ---------- static scene ---------- */
    const defs = el('defs', {}, svg);
    const grad = (id, stops, x2 = 0, y2 = 1) => {
        const g = el('linearGradient', { id, x1: 0, y1: 0, x2, y2 }, defs);
        stops.forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, g));
    };
    grad('gDermis', [[0, '#f8ede3'], [1, '#f1e0cf']]);
    grad('gEpi', [[0, '#f4d9cf'], [1, '#ecc7b9']]);
    grad('gFat', [[0, '#f2e4c9'], [1, '#ecd9b6']]);
    const blur = el('filter', { id: 'soft', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    el('feGaussianBlur', { stdDeviation: 7 }, blur);

    el('rect', { x: 0, y: 118, width: 800, height: 290, fill: 'url(#gDermis)' }, svg);
    el('rect', { x: 0, y: 400, width: 800, height: 100, fill: 'url(#gFat)' }, svg);
    for (let i = 0; i < 16; i++) {
        el('ellipse', { cx: 30 + i * 50 + rnd() * 20, cy: 440 + rnd() * 40, rx: 26 + rnd() * 10, ry: 18 + rnd() * 8, fill: '#fff', opacity: 0.35 }, svg);
    }
    el('path', { d: 'M0 398 Q200 386 400 398 T800 396', fill: 'none', stroke: '#e0c9a6', 'stroke-width': 1.5, opacity: 0.8 }, svg);

    // collagen fibres
    const fibreLayer = el('g', { fill: 'none', 'stroke-linecap': 'round' }, svg);
    const fibres = [];
    const N = 84, AGED = 26;
    for (let i = 0; i < N; i++) {
        const x = rnd() * 840 - 20, y = 150 + rnd() * 230, len = 110 + rnd() * 130, ang = (rnd() - 0.5) * 0.9;
        const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len * 0.55;
        const cx = (x + x2) / 2 + (rnd() - 0.5) * 44, cy = (y + y2) / 2 + (rnd() - 0.5) * 56;
        const p = el('path', { d: `M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`, pathLength: 100 }, fibreLayer);
        fibres.push({ p, aged: i < AGED, th: i < AGED ? -1 : 0.1 + ((i - AGED) / (N - AGED)) * 0.82 + rnd() * 0.04, w: 1.6 + rnd() * 1.3 });
    }

    // biostimulator particles, deeper in the dermis
    const partLayer = el('g', {}, svg);
    const parts = [];
    for (let i = 0; i < 34; i++) {
        const c = el('circle', { cx: 60 + rnd() * 680, cy: 300 + rnd() * 70, r: 3 + rnd() * 1.6, fill: '#fff', stroke: '#b8956a', 'stroke-width': 1.4 }, partLayer);
        parts.push({ c, r: 3 + rnd() * 1.6 });
    }

    // fibroblasts (spindle-shaped cells)
    const cellLayer = el('g', {}, svg);
    const spots = [[120, 215, -8], [290, 285, 10], [440, 200, 6], [560, 320, -12], [690, 240, 8], [200, 350, 4], [630, 175, -4]];
    const cells = spots.map(([x, y, r], i) => {
        const g = el('g', { class: 'cell', transform: `translate(${x} ${y}) rotate(${r})`, tabindex: 0, role: 'button', 'aria-label': 'Fibroblast ' + (i + 1) + '. Tap to see it make collagen.' }, cellLayer);
        const halo = el('ellipse', { class: 'halo', rx: 46, ry: 22, fill: '#d4b896', filter: 'url(#soft)', opacity: 0 }, g);
        const body = el('path', { class: 'body', d: 'M-34 0 Q-16 -11 0 -9 Q16 -11 34 0 Q16 11 0 9 Q-16 11 -34 0Z', stroke: '#fff', 'stroke-width': 1.2 }, g);
        const nuc = el('ellipse', { cx: 2, cy: 0, rx: 8.5, ry: 4.6 }, g);
        el('circle', { r: 46, fill: 'transparent' }, g); // generous tap target
        return { g, halo, body, nuc, x, y, r };
    });

    // surface of the skin (epidermis) drawn last so it sits on top
    const epi = el('path', { fill: 'url(#gEpi)' }, svg);
    const edge = el('path', { fill: 'none', stroke: '#d9a999', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, svg);
    const burstLayer = el('g', { fill: 'none', 'stroke-linecap': 'round' }, svg);

    const labels = [['Epidermis', 28, 108], ['Dermis', 28, 168], ['Deeper tissue', 28, 424]];
    labels.forEach(([t, x, y]) => {
        const tx = el('text', { x, y, class: 'lbl' }, svg);
        tx.textContent = t;
    });

    /* ---------- drawing from t ---------- */
    const surfaceY = (x, t) => {
        const fine = lerp(5, 1.2, t);
        const fold = (cx, k) => lerp(18, 3, t) * k * Math.exp(-Math.pow((x - cx) / 34, 2));
        return lerp(74, 64, t) + Math.sin(x * 0.085) * fine + Math.sin(x * 0.17 + 1) * fine * 0.5 + fold(400, 1) + fold(185, 0.6) + fold(625, 0.7);
    };

    const stages = [
        { max: 0.06, title: 'Skin that has slowed down', text: 'From our twenties, fibroblasts, the cells that build collagen, gradually slow down. Fibres thin out and break up, and fine lines and loss of volume begin to show.' },
        { max: 0.35, title: 'Treatment day', text: 'Dr de Villiers places a biostimulator in the deeper layers of the skin. It is not an instant filler. It is a signal to your own cells.' },
        { max: 0.8, title: 'Weeks later', text: 'Your fibroblasts respond and start building new collagen. The change is gradual and subtle, which is why it looks natural.' },
        { max: 1.01, title: 'Months later', text: 'New collagen keeps building while the biostimulator is slowly absorbed. For many people, skin quality and firmness improve over time. Your plan and timing are set at your consultation.' }
    ];
    const anchors = [0, 0.12, 0.55, 1];
    let stage = -1;

    const render = (t) => {
        // skin surface
        const pts = [];
        for (let x = -10; x <= 810; x += 4) pts.push([x, surfaceY(x, t)]);
        const top = pts.map(([x, y], i) => (i ? 'L' : 'M') + x + ' ' + y.toFixed(1)).join(' ');
        const junction = [];
        for (let x = 810; x >= -10; x -= 20) junction.push('L' + x + ' ' + (132 + Math.sin(x * 0.045) * 5).toFixed(1));
        epi.setAttribute('d', top + ' ' + junction.join(' ') + 'Z');
        edge.setAttribute('d', top);

        // collagen fibres: existing ones reconnect, new gold ones grow in
        fibres.forEach((f) => {
            if (f.aged) {
                f.p.setAttribute('stroke', mix('#bfae9b', '#a98f72', t));
                f.p.setAttribute('stroke-width', lerp(f.w * 0.7, f.w * 1.15, t).toFixed(2));
                f.p.setAttribute('stroke-dasharray', lerp(9, 100, t).toFixed(1) + ' ' + lerp(9, 0, t).toFixed(1));
                f.p.setAttribute('opacity', lerp(0.55, 0.85, t).toFixed(2));
            } else {
                const k = clamp((t - f.th) / 0.2);
                f.p.setAttribute('stroke', '#b8956a');
                f.p.setAttribute('stroke-width', (f.w * 1.1).toFixed(2));
                f.p.setAttribute('stroke-dasharray', '100 100');
                f.p.setAttribute('stroke-dashoffset', (100 * (1 - ease(k))).toFixed(1));
                f.p.setAttribute('opacity', k > 0 ? 0.95 : 0);
            }
        });

        // biostimulator particles appear at treatment and are slowly absorbed
        const appear = clamp(t / 0.08);
        const absorb = clamp((t - 0.62) / 0.38);
        parts.forEach((p) => {
            p.c.setAttribute('opacity', (appear * (1 - absorb * 0.85)).toFixed(2));
            p.c.setAttribute('r', (p.r * (1 - absorb * 0.5)).toFixed(2));
        });

        // fibroblasts wake up
        const wake = clamp((t - 0.1) / 0.3);
        cells.forEach((c) => {
            c.body.setAttribute('fill', mix('#d3c2b6', '#dca4a0', wake));
            c.nuc.setAttribute('fill', mix('#a8967f', '#8a6d4b', wake));
            c.g.style.opacity = lerp(0.7, 1, wake).toFixed(2);
            c.halo.setAttribute('opacity', (wake * 0.75).toFixed(2));
            c.halo.classList.toggle('on', wake > 0.4 && !reduce);
        });

        // text + controls
        const s = stages.findIndex((st) => t < st.max);
        if (s !== stage) {
            stage = s;
            $('#stageTitle').textContent = stages[s].title;
            $('#stageText').textContent = stages[s].text;
            document.querySelectorAll('.stages button').forEach((b, i) => b.classList.toggle('on', i === s));
            $('#time').setAttribute('aria-valuetext', stages[s].title);
        }
    };

    /* ---------- controls ---------- */
    const slider = $('#time');
    const playBtn = $('#play');
    let t = 0, raf = 0;

    const set = (v) => { t = clamp(v); slider.value = Math.round(t * 100); render(t); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; playBtn.querySelector('use').setAttribute('href', '#i-play'); playBtn.setAttribute('aria-label', 'Play the animation'); };
    const tween = (to, ms) => {
        stop();
        const from = t;
        if (reduce || ms <= 0) { set(to); return; }
        const start = performance.now();
        const step = (now) => {
            const k = clamp((now - start) / ms);
            set(lerp(from, to, ease(k)));
            raf = k < 1 ? requestAnimationFrame(step) : 0;
            if (k >= 1) stop();
        };
        raf = requestAnimationFrame(step);
    };

    slider.addEventListener('input', () => { stop(); t = slider.value / 100; render(t); hideHint(); });
    document.querySelectorAll('.stages button').forEach((b) => b.addEventListener('click', () => { tween(anchors[+b.dataset.stage], 900); hideHint(); }));
    playBtn.addEventListener('click', () => {
        if (raf) { stop(); return; }
        const from = t >= 0.99 ? 0 : t;
        set(from);
        tween(1, 9000 * (1 - from) + 600);
        if (!reduce) { playBtn.querySelector('use').setAttribute('href', '#i-pause'); playBtn.setAttribute('aria-label', 'Pause the animation'); }
        hideHint();
    });

    const hint = $('#labHint');
    const hideHint = () => hint.classList.add('gone');

    /* ---------- tap a cell: it releases collagen ---------- */
    const notes = [
        'A fibroblast: the cell that builds collagen, elastin and the gel that keeps skin hydrated.',
        'Fibroblasts respond to signals from their surroundings. A biostimulator is one such signal.',
        'Each fibroblast makes new collagen fibres, so the skin is rebuilt from within.'
    ];
    let noteIx = 0;
    const burst = (c) => {
        const awake = clamp((t - 0.1) / 0.3);
        const n = awake > 0.3 ? 7 : 3;
        for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2 + rnd();
            const r1 = 30, r2 = 62 + rnd() * 40;
            const x1 = c.x + Math.cos(a) * r1, y1 = c.y + Math.sin(a) * r1 * 0.6;
            const x2 = c.x + Math.cos(a) * r2, y2 = c.y + Math.sin(a) * r2 * 0.6;
            const mx = (x1 + x2) / 2 + (rnd() - 0.5) * 24, my = (y1 + y2) / 2 + (rnd() - 0.5) * 24;
            const p = el('path', { d: `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, pathLength: 100, stroke: awake > 0.3 ? '#b8956a' : '#bfae9b', 'stroke-width': awake > 0.3 ? 2.6 : 1.6, 'stroke-dasharray': '100 100' }, burstLayer);
            const anim = p.animate(
                [{ strokeDashoffset: 100, opacity: 1 }, { strokeDashoffset: 0, opacity: 1, offset: 0.55 }, { strokeDashoffset: 0, opacity: 0 }],
                { duration: reduce ? 400 : 1500, easing: 'ease-out' }
            );
            anim.onfinish = () => p.remove();
        }
        if (!reduce) c.g.animate([{ transform: `translate(${c.x}px,${c.y}px) rotate(${c.r}deg) scale(1)` }, { transform: `translate(${c.x}px,${c.y}px) rotate(${c.r}deg) scale(1.18)` }, { transform: `translate(${c.x}px,${c.y}px) rotate(${c.r}deg) scale(1)` }], { duration: 450, easing: 'ease-out' });
        const note = $('#cellNote');
        note.hidden = false;
        note.textContent = awake > 0.3 ? notes[1 + (noteIx++ % 2)] : notes[0] + ' Right now it is working slowly.';
        hideHint();
    };
    cells.forEach((c) => {
        c.g.addEventListener('click', () => burst(c));
        c.g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); burst(c); } });
    });

    render(0);
})();
