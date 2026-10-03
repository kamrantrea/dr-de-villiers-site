/* How your skin builds collagen: an interactive, simplified illustration.
   No libraries. The skin and Fibro are SVG, redrawn from one number, t (0 to 1 = time).
   t is driven by scrolling the story, the timeline slider, or the stage buttons. */
(() => {
    'use strict';
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const NS = 'http://www.w3.org/2000/svg';
    const svg = $('#cf');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // footer Instagram link (same config.js as the main site)
    const ig = $('[data-cfg="instagram"]');
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
    const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const rnd = rng(11);

    // the slider has four evenly spaced stops; time moves unevenly between them
    const ANCH = [0, 0.12, 0.55, 1];
    const sToT = (s) => { const k = clamp(s) * 3, i = Math.min(2, Math.floor(k)); return lerp(ANCH[i], ANCH[i + 1], k - i); };
    const tToS = (t) => { let i = 0; while (i < 2 && t > ANCH[i + 1]) i++; return (i + (t - ANCH[i]) / (ANCH[i + 1] - ANCH[i])) / 3; };
    const stageOf = (t) => (t < 0.06 ? 0 : t < 0.35 ? 1 : t < 0.8 ? 2 : 3);
    const STAGE_NAMES = ['Before', 'Treatment Day', 'Weeks Later', 'Months Later'];

    /* ---------- skin scene ---------- */
    const defs = el('defs', {}, svg);
    const grad = (id, stops) => {
        const g = el('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
        stops.forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, g));
    };
    grad('gDermis', [[0, '#f8ede3'], [1, '#f1e0cf']]);
    grad('gEpi', [[0, '#f4d9cf'], [1, '#ecc7b9']]);
    grad('gFat', [[0, '#f2e4c9'], [1, '#ecd9b6']]);
    const blur = el('filter', { id: 'soft', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    el('feGaussianBlur', { stdDeviation: 7 }, blur);

    el('rect', { x: 0, y: 118, width: 800, height: 290, fill: 'url(#gDermis)' }, svg);
    el('rect', { x: 0, y: 400, width: 800, height: 100, fill: 'url(#gFat)' }, svg);
    for (let i = 0; i < 16; i++) el('ellipse', { cx: 30 + i * 50 + rnd() * 20, cy: 440 + rnd() * 40, rx: 26 + rnd() * 10, ry: 18 + rnd() * 8, fill: '#fff', opacity: 0.35 }, svg);
    el('path', { d: 'M0 398 Q200 386 400 398 T800 396', fill: 'none', stroke: '#e0c9a6', 'stroke-width': 1.5, opacity: 0.8 }, svg);

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

    const partLayer = el('g', {}, svg);
    const parts = [];
    for (let i = 0; i < 34; i++) {
        const r = 3 + rnd() * 1.6;
        parts.push({ c: el('circle', { cx: 60 + rnd() * 680, cy: 300 + rnd() * 70, r, fill: '#fff', stroke: '#b8956a', 'stroke-width': 1.4 }, partLayer), r });
    }

    const cellLayer = el('g', {}, svg);
    const spots = [[120, 215, -8], [290, 285, 10], [440, 200, 6], [560, 320, -12], [690, 240, 8], [200, 350, 4], [630, 175, -4]];
    const cells = spots.map(([x, y, r], i) => {
        const g = el('g', { class: 'cell', transform: `translate(${x} ${y}) rotate(${r})`, tabindex: 0, role: 'button', 'aria-label': 'Fibroblast ' + (i + 1) + '. Tap to see it make collagen.' }, cellLayer);
        const halo = el('ellipse', { class: 'halo', rx: 46, ry: 22, fill: '#d4b896', filter: 'url(#soft)', opacity: 0 }, g);
        const body = el('path', { class: 'body', d: 'M-34 0 Q-16 -11 0 -9 Q16 -11 34 0 Q16 11 0 9 Q-16 11 -34 0Z', stroke: '#fff', 'stroke-width': 1.2 }, g);
        const nuc = el('ellipse', { cx: 2, cy: 0, rx: 8.5, ry: 4.6 }, g);
        if (i === 2) el('ellipse', { class: 'ring', rx: 40, ry: 22 }, g);
        el('circle', { r: 46, fill: 'transparent' }, g); // generous tap target
        return { g, halo, body, nuc, x, y, r };
    });

    const epi = el('path', { fill: 'url(#gEpi)' }, svg);
    const edge = el('path', { fill: 'none', stroke: '#d9a999', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, svg);
    [['Epidermis', 28, 108], ['Dermis', 28, 168], ['Deeper tissue', 28, 424]].forEach(([t, x, y]) => { el('text', { x, y, class: 'lbl' }, svg).textContent = t; });
    const burstLayer = el('g', { fill: 'none', 'stroke-linecap': 'round' }, svg);

    // labels that point at what is happening at each stage: [stage, text, pill x, pill y, target x, target y]
    const NOTES = [
        [0, 'Tired fibroblast', 540, 150, 440, 200], [0, 'Thin, broken fibres', 330, 372, 380, 322],
        [1, 'Biostimulator particles', 300, 262, 330, 318],
        [2, 'Fibroblast at work', 250, 236, 290, 285], [2, 'New collagen forming', 520, 262, 540, 300],
        [3, 'Denser collagen network', 320, 222, 360, 268], [3, 'Smoother surface', 560, 100, 520, 66]
    ];
    const noteEls = NOTES.map(([stage, text, px, py, tx, ty]) => {
        const g = el('g', { class: 'note', 'pointer-events': 'none' }, svg);
        el('line', { x1: px, y1: py, x2: tx, y2: ty, stroke: '#b8956a', 'stroke-width': 1.6 }, g);
        el('circle', { cx: tx, cy: ty, r: 4.5, fill: '#b8956a', stroke: '#fff', 'stroke-width': 1.5 }, g);
        const w = text.length * 11.4 + 32;
        el('rect', { x: px - w / 2, y: py - 17, width: w, height: 34, rx: 17, fill: '#fff', stroke: '#b8956a', 'stroke-width': 1.4 }, g);
        const label = el('text', { x: px, y: py + 7, 'text-anchor': 'middle', class: 'pill' }, g);
        label.textContent = text;
        return { g, stage };
    });

    /* ---------- Fibro, the character ---------- */
    const fsvg = $('#fibroSvg');
    const fd = el('defs', {}, fsvg);
    const fblur = el('filter', { id: 'fsoft', x: '-60%', y: '-60%', width: '220%', height: '220%' }, fd);
    el('feGaussianBlur', { stdDeviation: 8 }, fblur);
    [-15, 15].forEach((cx, i) => {
        const cp = el('clipPath', { id: 'eyeClip' + i }, fd);
        el('ellipse', { cx, cy: -4, rx: 8.6, ry: 9.6 }, cp);
    });
    const F = {};
    el('ellipse', { cx: 0, cy: 47, rx: 36, ry: 5, fill: 'rgba(44,36,28,.09)' }, fsvg);
    F.halo = el('ellipse', { class: 'fhalo', cx: 0, cy: 0, rx: 60, ry: 44, fill: '#d4b896', filter: 'url(#fsoft)', opacity: 0 }, fsvg);
    F.root = el('g', { class: 'fb-root' }, fsvg);
    F.armL = el('ellipse', { cx: -50, cy: 12, rx: 9, ry: 5.5 }, F.root);
    F.armR = el('ellipse', { cx: 50, cy: 12, rx: 9, ry: 5.5 }, F.root);
    F.body = el('path', { d: 'M-52 0 Q-30 -42 0 -42 Q30 -42 52 0 Q30 42 0 42 Q-30 42 -52 0Z', stroke: '#fff', 'stroke-width': 3 }, F.root);
    el('ellipse', { cx: -18, cy: -24, rx: 15, ry: 6, fill: '#fff', opacity: 0.28, transform: 'rotate(-18 -18 -24)' }, F.root);
    F.nuc = el('ellipse', { cx: 25, cy: -22, rx: 9, ry: 5, transform: 'rotate(28 25 -22)' }, F.root);
    F.cheekL = el('ellipse', { cx: -27, cy: 10, rx: 8.5, ry: 5, fill: '#ee8c92' }, F.root);
    F.cheekR = el('ellipse', { cx: 27, cy: 10, rx: 8.5, ry: 5, fill: '#ee8c92' }, F.root);
    F.eyes = el('g', {}, F.root);
    F.pupils = [];
    F.lids = [];
    [-15, 15].forEach((cx, i) => {
        el('ellipse', { cx, cy: -4, rx: 8.6, ry: 9.6, fill: '#fff' }, F.eyes);
        const pg = el('g', {}, F.eyes);
        el('circle', { cx, cy: -3, r: 5.2, fill: '#3b2f2a' }, pg);
        el('circle', { cx: cx + 1.8, cy: -5.4, r: 1.9, fill: '#fff' }, pg);
        F.pupils.push(pg);
        F.lids.push(el('rect', { x: cx - 10, y: -14, width: 20, height: 0, 'clip-path': `url(#eyeClip${i})` }, F.eyes));
    });
    F.happy = el('g', { fill: 'none', stroke: '#3b2f2a', 'stroke-width': 3.2, 'stroke-linecap': 'round' }, F.root);
    el('path', { d: 'M-23 -2 Q-15 -13 -7 -2' }, F.happy);
    el('path', { d: 'M7 -2 Q15 -13 23 -2' }, F.happy);
    F.brows = el('path', { fill: 'none', stroke: '#6b4e43', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, F.root);
    F.mFlat = el('path', { d: 'M-6 19 L6 19', fill: 'none', stroke: '#5a3a36', 'stroke-width': 2.8, 'stroke-linecap': 'round' }, F.root);
    F.mOh = el('ellipse', { cx: 0, cy: 20, rx: 4.5, ry: 5.8, fill: '#7a3b3f' }, F.root);
    F.mOpen = el('path', { fill: '#7a3b3f' }, F.root);
    F.mSmile = el('path', { fill: 'none', stroke: '#5a3a36', 'stroke-width': 3, 'stroke-linecap': 'round' }, F.root);
    F.zzz = el('g', { class: 'zzz', fill: '#8a6d4b', 'font-family': 'Montserrat, sans-serif', 'font-weight': 500 }, fsvg);
    [['z', 40, -34, 15], ['Z', 49, -46, 19], ['z', 57, -58, 23]].forEach(([c, x, y, s], i) => { const t = el('text', { x, y, 'font-size': s, class: 'zz zz' + i }, F.zzz); t.textContent = c; });
    F.bang = el('text', { x: 44, y: -34, 'font-size': 30, fill: '#8a6d4b', 'font-family': 'Montserrat, sans-serif', 'font-weight': 500, class: 'bang' }, fsvg);
    F.bang.textContent = '!';
    F.sparks = el('g', { fill: '#d4b896', class: 'sparks' }, fsvg);
    [[-56, -30, 1], [58, -22, 1.2], [-46, 34, 0.8]].forEach(([x, y, s], i) => el('path', { d: 'M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z', transform: `translate(${x} ${y}) scale(${s})`, class: 'sp sp' + i }, F.sparks));

    const bubble = $('#fibroSay');
    const stageSay = ['Zzz... I\'m a bit tired', 'Ooh! A signal!', 'Back to work!', 'Feeling fabulous!'];
    const sleepyTaps = ['Mmm? Five more minutes...', 'Zzz... who\'s there?'];
    const awakeTaps = ['Hee hee!', 'That tickles!', 'Collagen coming right up!', 'Hello there!'];
    let tapIx = 0, sayTimer = 0, curStage = -1, lastT = 0;
    const say = (txt) => { bubble.textContent = txt; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); };

    let blink = 0; // 0 open ... 1 closed
    let look = [0, 0];
    const drawFibro = (t) => {
        const ramp = (a, b) => clamp((t - a) / (b - a));
        const s0 = 1 - ramp(0.03, 0.08);
        const s1 = ramp(0.04, 0.09) * (1 - ramp(0.3, 0.37));
        const s2 = ramp(0.3, 0.37) * (1 - ramp(0.82, 0.9));
        const s3 = ramp(0.82, 0.9);
        const wake = clamp((t - 0.1) / 0.3);
        const body = mix('#d3c2b6', '#dca4a0', wake);
        [F.body, F.armL, F.armR].forEach((n) => n.setAttribute('fill', body));
        F.nuc.setAttribute('fill', mix('#a8967f', '#8a6d4b', wake));
        F.halo.setAttribute('opacity', (wake * 0.7).toFixed(2));
        F.halo.classList.toggle('on', wake > 0.4 && !reduce);

        const open = (s0 * 0.14 + s1 * 1 + s2 * 0.88) / Math.max(0.001, s0 + s1 + s2);
        const lid = clamp(1 - open + blink * open, 0, 1);
        F.lids.forEach((r) => { r.setAttribute('height', (lid * 19.2).toFixed(1)); r.setAttribute('fill', body); });
        F.eyes.setAttribute('opacity', (1 - s3).toFixed(2));
        F.happy.setAttribute('opacity', s3.toFixed(2));
        F.pupils.forEach((p) => p.setAttribute('transform', `translate(${(look[0] * 3.2).toFixed(2)} ${(look[1] * 2.6).toFixed(2)})`));

        const lift = s0 * -14 + s1 * -24 + s2 * -19 + s3 * -22;
        const tilt = s0 * 3 + s1 * -1 + s2 * -1 + s3 * -2;
        F.brows.setAttribute('d', `M-23 ${lift + tilt} L-8 ${lift - tilt} M8 ${lift - tilt} L23 ${lift + tilt}`);
        F.brows.setAttribute('opacity', (s0 * 0.7 + s1 + s2 + s3).toFixed(2));

        const k = s2 * 0.55 + s3 * 1;
        F.mFlat.setAttribute('opacity', s0.toFixed(2));
        F.mOh.setAttribute('opacity', s1.toFixed(2));
        F.mSmile.setAttribute('d', `M-12 14 Q0 ${(14 + k * 17).toFixed(1)} 12 14`);
        F.mSmile.setAttribute('opacity', clamp(s2 + s3 * (1 - ramp(0.86, 0.92))).toFixed(2));
        F.mOpen.setAttribute('d', 'M-13 13 Q0 36 13 13 Z');
        F.mOpen.setAttribute('opacity', ramp(0.86, 0.92).toFixed(2));
        const cheek = s1 * 0.25 + s2 * 0.55 + s3 * 0.9;
        F.cheekL.setAttribute('opacity', cheek.toFixed(2)); F.cheekR.setAttribute('opacity', cheek.toFixed(2));
        const arm = s1 + s2 * 0.2 + s3;
        F.armL.setAttribute('transform', `rotate(${(-lerp(18, -55, arm)).toFixed(0)} -44 10)`);
        F.armR.setAttribute('transform', `rotate(${lerp(18, -55, arm).toFixed(0)} 44 10)`);
        F.zzz.setAttribute('opacity', s0.toFixed(2));
        F.bang.setAttribute('opacity', s1.toFixed(2));
        F.sparks.setAttribute('opacity', s3.toFixed(2));
        fsvg.parentElement.classList.toggle('asleep', s0 > 0.5);
        fsvg.parentElement.classList.toggle('happy', s3 > 0.5);
    };

    // blink every few seconds, and eyes follow the pointer
    if (!reduce) {
        const doBlink = () => {
            blink = 1; drawFibro(lastT);
            setTimeout(() => { blink = 0; drawFibro(lastT); setTimeout(doBlink, 2600 + Math.random() * 3200); }, 130);
        };
        setTimeout(doBlink, 2200);
        window.addEventListener('pointermove', (e) => {
            const r = fsvg.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
            const d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 260);
            look = [dx / d * m, dy / d * m];
            drawFibro(lastT);
        }, { passive: true });
    }

    /* ---------- drawing from t ---------- */
    const surfaceY = (x, t) => {
        const fine = lerp(5, 1.2, t);
        const fold = (cx, k) => lerp(18, 3, t) * k * Math.exp(-Math.pow((x - cx) / 34, 2));
        return lerp(74, 64, t) + Math.sin(x * 0.085) * fine + Math.sin(x * 0.17 + 1) * fine * 0.5 + fold(400, 1) + fold(185, 0.6) + fold(625, 0.7);
    };

    const cellNote = $('#cellNote');
    const slider = $('#time');
    const beats = $$('.beat');
    const ticks = $$('.tick-row button');
    let t = 0;

    const render = (v) => {
        t = clamp(v); lastT = t;
        const pts = [];
        for (let x = -10; x <= 810; x += 4) pts.push([x, surfaceY(x, t)]);
        const top = pts.map(([x, y], i) => (i ? 'L' : 'M') + x + ' ' + y.toFixed(1)).join(' ');
        const junction = [];
        for (let x = 810; x >= -10; x -= 20) junction.push('L' + x + ' ' + (132 + Math.sin(x * 0.045) * 5).toFixed(1));
        epi.setAttribute('d', top + ' ' + junction.join(' ') + 'Z');
        edge.setAttribute('d', top);

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

        const appear = clamp(t / 0.08), absorb = clamp((t - 0.62) / 0.38);
        parts.forEach((p) => {
            p.c.setAttribute('opacity', (appear * (1 - absorb * 0.85)).toFixed(2));
            p.c.setAttribute('r', (p.r * (1 - absorb * 0.5)).toFixed(2));
        });

        const wake = clamp((t - 0.1) / 0.3);
        cells.forEach((c) => {
            c.body.setAttribute('fill', mix('#d3c2b6', '#dca4a0', wake));
            c.nuc.setAttribute('fill', mix('#a8967f', '#8a6d4b', wake));
            c.g.style.opacity = lerp(0.7, 1, wake).toFixed(2);
            c.halo.setAttribute('opacity', (wake * 0.75).toFixed(2));
            c.halo.classList.toggle('on', wake > 0.4 && !reduce);
        });

        drawFibro(t);

        const s = stageOf(t);
        if (s !== curStage) {
            curStage = s;
            beats.forEach((b, i) => b.classList.toggle('is-on', i === s));
            ticks.forEach((b, i) => b.classList.toggle('on', i === s));
            noteEls.forEach((n) => n.g.classList.toggle('on', n.stage === s));
            slider.setAttribute('aria-valuetext', STAGE_NAMES[s]);
            cellNote.hidden = true;
            clearTimeout(sayTimer);
            say(stageSay[s]);
        }
        slider.value = Math.round(tToS(t) * 100);
    };

    /* ---------- moving through time ---------- */
    let raf = 0;
    let follow = 0;
    const tween = (to, ms) => {
        cancelAnimationFrame(raf); cancelAnimationFrame(follow); follow = 0;
        const from = t;
        if (reduce || ms <= 0) { render(to); return; }
        const start = performance.now();
        const step = (now) => {
            const k = clamp((now - start) / ms);
            render(lerp(from, to, ease(k)));
            raf = k < 1 ? requestAnimationFrame(step) : 0;
        };
        raf = requestAnimationFrame(step);
    };
    let touched = false;
    const touch = () => { if (!touched) { touched = true; $$('.ring').forEach((r) => r.classList.add('gone')); } };

    slider.addEventListener('input', () => { cancelAnimationFrame(raf); cancelAnimationFrame(follow); follow = 0; holdFor(1600); render(sToT(slider.value / 100)); touch(); });
    ticks.forEach((b) => b.addEventListener('click', () => {
        const i = +b.dataset.stage;
        touch();
        holdFor(1500);
        tween(ANCH[i], 1000);
        alignBeat(i); // bring the matching text into view too
    }));
    // when the slider is released, bring the matching text into view
    slider.addEventListener('change', () => { holdFor(1500); alignBeat(stageOf(t)); });

    // scrolling the story moves time forward and back
    const single = window.matchMedia('(max-width: 960px)');
    const refLine = () => (single.matches ? ($('.stage').getBoundingClientRect().bottom + innerHeight) / 2 : innerHeight * 0.5);
    const alignBeat = (i) => {
        const r = beats[i].getBoundingClientRect();
        window.scrollBy({ top: (r.top + r.bottom) / 2 - refLine(), behavior: reduce ? 'auto' : 'smooth' });
    };
    // scrolling scrubs time smoothly: the picture follows your finger between the four stages
    let hold = 0; // button and slider jumps drive time themselves, so scrubbing pauses briefly after them
    const holdFor = (ms) => { hold = performance.now() + ms; setTimeout(() => onScroll(), ms + 40); };
    const scrubTarget = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        if (scrollY >= max - 4) return 1;
        const ref = refLine();
        const c = beats.map((b) => { const r = b.getBoundingClientRect(); return (r.top + r.bottom) / 2; });
        if (ref <= c[0]) return 0;
        for (let i = 0; i < 3; i++) if (ref < c[i + 1]) return lerp(ANCH[i], ANCH[i + 1], ease((ref - c[i]) / (c[i + 1] - c[i])));
        return 1;
    };
    let goal = 0;
    const chase = () => {
        const d = goal - t;
        if (Math.abs(d) < 0.0008) { render(goal); follow = 0; return; }
        render(t + d * 0.22);
        follow = requestAnimationFrame(chase);
    };
    let ticking = false;
    function onScroll() {
        if (ticking || performance.now() < hold) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            if (performance.now() < hold) return;
            goal = scrubTarget();
            cancelAnimationFrame(raf);
            if (reduce) { render(goal); return; }
            if (!follow) follow = requestAnimationFrame(chase);
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    /* ---------- tap a cell: it releases collagen ---------- */
    const notes = [
        'A fibroblast: the cell that builds collagen and elastin.',
        'Fibroblasts respond to signals. A biostimulator is one.',
        'Each one builds new collagen, rebuilding skin from within.'
    ];
    let noteIx = 0, noteTimer = 0;
    const burst = (c) => {
        touch();
        const awake = clamp((t - 0.1) / 0.3);
        const n = awake > 0.3 ? 7 : 3;
        for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2 + rnd();
            const r1 = 30, r2 = 62 + rnd() * 40;
            const x1 = c.x + Math.cos(a) * r1, y1 = c.y + Math.sin(a) * r1 * 0.6;
            const x2 = c.x + Math.cos(a) * r2, y2 = c.y + Math.sin(a) * r2 * 0.6;
            const mx = (x1 + x2) / 2 + (rnd() - 0.5) * 24, my = (y1 + y2) / 2 + (rnd() - 0.5) * 24;
            const p = el('path', { d: `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, pathLength: 100, stroke: awake > 0.3 ? '#b8956a' : '#bfae9b', 'stroke-width': awake > 0.3 ? 2.6 : 1.6, 'stroke-dasharray': '100 100' }, burstLayer);
            const anim = p.animate([{ strokeDashoffset: 100, opacity: 1 }, { strokeDashoffset: 0, opacity: 1, offset: 0.55 }, { strokeDashoffset: 0, opacity: 0 }], { duration: reduce ? 400 : 1500, easing: 'ease-out' });
            anim.onfinish = () => p.remove();
        }
        if (!reduce) c.g.animate([{ transform: `translate(${c.x}px,${c.y}px) rotate(${c.r}deg) scale(1)` }, { transform: `translate(${c.x}px,${c.y}px) rotate(${c.r}deg) scale(1.18)` }, { transform: `translate(${c.x}px,${c.y}px) rotate(${c.r}deg) scale(1)` }], { duration: 450, easing: 'ease-out' });
        cellNote.hidden = false;
        cellNote.textContent = awake > 0.3 ? notes[1 + (noteIx++ % 2)] : notes[0] + ' This one is working slowly.';
        clearTimeout(noteTimer);
        noteTimer = setTimeout(() => { cellNote.hidden = true; }, 4500);
    };
    cells.forEach((c) => {
        c.g.addEventListener('click', () => burst(c));
        c.g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); burst(c); } });
    });

    // tap Fibro: a squish and a giggle
    $('#fibro').addEventListener('click', () => {
        touch();
        const asleep = t < 0.06;
        const pool = asleep ? sleepyTaps : awakeTaps;
        say(pool[tapIx++ % pool.length]);
        clearTimeout(sayTimer);
        sayTimer = setTimeout(() => say(stageSay[curStage]), 2600);
        if (!reduce) F.root.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.1,0.84)' }, { transform: 'scale(0.95,1.1)' }, { transform: 'scale(1,1)' }], { duration: 520, easing: 'ease-out' });
    });

    render(0);
    onScroll();
})();
