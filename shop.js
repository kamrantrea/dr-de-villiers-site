(() => {
    'use strict';
    const C = window.SITE || {};
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const isPlaceholder = (v) => !v || /X{3,}|YOUR-|example\.ie/.test(v);
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const NS = 'http://www.w3.org/2000/svg';

    /* ---------- config links (Instagram in footer) ---------- */
    $$('[data-cfg="instagram"]').forEach((a) => {
        if (!C.instagram) return;
        a.hidden = false; a.href = 'https://instagram.com/' + C.instagram.replace('@', ''); a.target = '_blank'; a.rel = 'noopener';
    });

    /* ---------- products ---------- */
    const SAMPLE = [
        { id: 'cleanser', name: 'Gentle gel cleanser', category: 'Cleanse', price: '€32', size: '150 ml', shape: 'pump', tint: 'sage',
          note: 'A soft, non-stripping daily cleanse',
          description: 'A mild gel that lifts away make-up, sunscreen and the day without leaving skin tight. A good first step for every routine, morning or night.',
          key: 'Glycerin, panthenol, aloe',
          howTo: ['Massage a pump onto damp skin for 30 seconds.', 'Rinse with lukewarm water and pat dry.', 'Use morning and evening.'],
          goodFor: ['Every skin type', 'Skin that feels tight after washing', 'Removing sunscreen at night'],
          pairs: ['serum', 'spf'] },
        { id: 'serum', name: 'Hydrating serum', category: 'Hydrate', price: '€68', size: '30 ml', shape: 'dropper', tint: 'rose', badge: 'Doctor’s pick',
          note: 'Hyaluronic acid for plump, calm skin',
          description: 'A light, water-based serum that draws moisture into the skin and leaves it looking fresh and bouncy. It layers easily under moisturiser and sunscreen.',
          key: 'Hyaluronic acid, panthenol, glycerin',
          howTo: ['Apply two to three drops to clean, slightly damp skin.', 'Follow with moisturiser, then sunscreen in the morning.', 'Use morning and evening.'],
          goodFor: ['Dull or dehydrated skin', 'Fine dryness lines', 'Layering with other products'],
          pairs: ['cleanser', 'barrier', 'spf'] },
        { id: 'spf', name: 'Daily SPF 50', category: 'Protect', price: '€45', size: '50 ml', shape: 'tube', tint: 'sand',
          note: 'Lightweight daily protection',
          description: 'A fluid, broad-spectrum sunscreen that sits well under make-up and leaves no white cast. Daily sun protection is the single best habit for the long-term health of your skin.',
          key: 'Broad-spectrum filters, vitamin E',
          howTo: ['Apply generously as the last step of your morning routine.', 'Reapply every two hours in strong sun, and after swimming.', 'Use every day, including cloudy ones.'],
          goodFor: ['Everyday protection', 'Wearing under make-up', 'Protecting results after treatments'],
          pairs: ['cleanser', 'vitc'] },
        { id: 'barrier', name: 'Barrier repair cream', category: 'Hydrate', price: '€54', size: '50 ml', shape: 'jar', tint: 'gold',
          note: 'Rich comfort for dry, tired skin',
          description: 'A cushioning cream that helps skin hold on to moisture and feel comfortable again. Lovely at night, or morning and night in the colder months.',
          key: 'Ceramides, squalane, shea butter',
          howTo: ['Warm a pea-sized amount between your fingers.', 'Press over the face and neck as the final step at night.', 'Use morning too if skin is very dry.'],
          goodFor: ['Dry or tight skin', 'Winter and central heating', 'Skin that feels easily irritated'],
          pairs: ['serum', 'cleanser'] },
        { id: 'vitc', name: 'Vitamin C serum', category: 'Treat', price: '€72', size: '30 ml', shape: 'dropper', tint: 'gold', badge: 'New',
          note: 'A daily boost for brighter-looking skin',
          description: 'A stable vitamin C serum for a fresher, more even-looking complexion. Best used in the morning under sunscreen, where it works with your daily protection.',
          key: 'Vitamin C, vitamin E, ferulic acid',
          howTo: ['Apply a few drops to clean skin in the morning.', 'Let it settle for a minute, then add moisturiser and sunscreen.', 'If your skin tingles or stings, use it every second day.'],
          goodFor: ['Dull or uneven-looking skin', 'Morning routines', 'Adding to sunscreen'],
          pairs: ['spf', 'serum'] },
        { id: 'night', name: 'Renewal night cream', category: 'Treat', price: '€78', size: '50 ml', shape: 'jar', tint: 'rose',
          note: 'A richer cream for the evening',
          description: 'A nourishing night cream that supports your skin’s natural overnight renewal, so it looks smoother and feels softer by morning.',
          key: 'Peptides, squalane, glycerin',
          howTo: ['Apply to clean skin in the evening after your serum.', 'Smooth over face and neck.', 'Always follow with sunscreen the next morning.'],
          goodFor: ['Evening routines', 'Skin that feels dry by morning', 'Building a simple night-time habit'],
          pairs: ['cleanser', 'serum'] }
    ];
    const real = (window.PRODUCTS || []).filter((p) => p && p.name).map((p, i) => Object.assign({ id: p.id || 'p' + i, shape: 'jar', tint: 'rose', category: 'Skincare' }, p));
    const sample = !real.length;
    const products = sample ? SAMPLE : real;
    const byId = Object.fromEntries(products.map((p) => [p.id, p]));
    if (sample) $('#sampleNote').hidden = false;

    /* ---------- product drawing (until real photos are uploaded) ---------- */
    const TINTS = {
        rose: ['#f5e3dd', '#fdf6f3', '#c98f7e'],
        sage: ['#e4eadf', '#f7faf4', '#7f9677'],
        gold: ['#f3e6d3', '#fdf7ec', '#b8956a'],
        sand: ['#efe4d6', '#fbf6ef', '#9c7c58']
    };
    const art = (p) => {
        const [bg, body, ac] = TINTS[p.tint] || TINTS.rose;
        const label = `<rect x="76" y="{y}" width="48" height="{h}" rx="4" fill="#fff" opacity=".9"/><path d="M84 {l1}h32M84 {l2}h22" stroke="${ac}" stroke-width="2" stroke-linecap="round" opacity=".8"/>`;
        const lab = (y, h) => label.replace('{y}', y).replace('{h}', h).replace('{l1}', y + 14).replace('{l2}', y + 24);
        const stroke = `stroke="${ac}" stroke-opacity=".55" stroke-width="1.5"`;
        let g = '';
        if (p.shape === 'pump') {
            g = `<rect x="94" y="46" width="12" height="30" rx="3" fill="${ac}"/><path d="M82 46h46a6 6 0 010 10H82z" fill="${ac}"/><rect x="86" y="74" width="28" height="14" rx="3" fill="${ac}" opacity=".85"/>
                 <rect x="62" y="88" width="76" height="124" rx="16" fill="${body}" ${stroke}/><rect x="68" y="150" width="64" height="56" rx="10" fill="${ac}" opacity=".18"/>${lab(104, 40)}`;
        } else if (p.shape === 'dropper') {
            g = `<ellipse cx="100" cy="52" rx="15" ry="26" fill="${ac}"/><rect x="82" y="72" width="36" height="22" rx="4" fill="${ac}" opacity=".85"/><rect x="88" y="92" width="24" height="12" fill="${body}" ${stroke}/>
                 <rect x="64" y="102" width="72" height="110" rx="16" fill="${body}" ${stroke}/><rect x="70" y="150" width="60" height="56" rx="10" fill="${ac}" opacity=".2"/>${lab(116, 40)}`;
        } else if (p.shape === 'tube') {
            g = `<rect x="84" y="40" width="32" height="24" rx="5" fill="${ac}"/><path d="M80 64h40l12 140H68z" fill="${body}" ${stroke}/><path d="M68 204h64v10H68z" fill="${ac}" opacity=".85"/><path d="M70 196h60" stroke="${ac}" stroke-opacity=".4"/>
                 <rect x="82" y="104" width="36" height="46" rx="4" fill="#fff" opacity=".9"/><path d="M88 118h24M88 128h16" stroke="${ac}" stroke-width="2" stroke-linecap="round" opacity=".8"/>`;
        } else {
            g = `<rect x="46" y="118" width="108" height="34" rx="9" fill="${ac}"/><rect x="50" y="150" width="100" height="62" rx="14" fill="${body}" ${stroke}/><rect x="56" y="178" width="88" height="28" rx="8" fill="${ac}" opacity=".18"/>
                 <rect x="76" y="162" width="48" height="26" rx="4" fill="#fff" opacity=".9"/><path d="M84 171h32M84 179h20" stroke="${ac}" stroke-width="2" stroke-linecap="round" opacity=".8"/>`;
        }
        return `<svg class="art" viewBox="0 0 200 240" aria-hidden="true" focusable="false">
            <circle cx="100" cy="132" r="86" fill="#fff" opacity=".45"/>
            <ellipse cx="100" cy="216" rx="52" ry="7" fill="#2c2418" opacity=".1"/>${g}</svg>`;
    };
    const tile = (p) => `<div class="tile" style="background:${(TINTS[p.tint] || TINTS.rose)[0]}">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : ''}${art(p)}${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}</div>`;

    /* ---------- Fibro: a tiny scripted character ---------- */
    const MOUTH = {
        idle:  { d: 'M-8 14 Q0 20 8 14', fill: 'none' },
        happy: { d: 'M-10 11 Q0 28 10 11 Z', fill: '#8c4a40' },
        think: { d: 'M-3.5 16 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0', fill: '#8c4a40' },
        oops:  { d: 'M-9 18 Q-4.5 12 0 18 T9 18', fill: 'none' },
        care:  { d: 'M-7 16 Q0 19 7 16', fill: 'none' }
    };
    const makeFibro = () => {
        const s = document.createElementNS(NS, 'svg');
        s.setAttribute('viewBox', '-52 -50 104 96');
        s.setAttribute('aria-hidden', 'true');
        s.innerHTML = `<g class="fb-bob"><g class="fb-root">
            <path d="M-40 4C-46-24-20-42 4-40 32-42 46-18 42 8 40 30 16 42-6 40-30 40-38 28-40 4Z" fill="#f4dcd1" stroke="#b8956a" stroke-width="2"/>
            <ellipse cx="20" cy="-22" rx="10" ry="7" fill="#e7c3b0" opacity=".8" transform="rotate(-20 20 -22)"/>
            <ellipse cx="-27" cy="10" rx="6" ry="4" fill="#f0a9a0" opacity=".55"/><ellipse cx="27" cy="10" rx="6" ry="4" fill="#f0a9a0" opacity=".55"/>
            <g class="fb-eyes"><ellipse cx="-14" cy="-4" rx="7.5" ry="8.5" fill="#fff"/><ellipse cx="14" cy="-4" rx="7.5" ry="8.5" fill="#fff"/>
              <circle class="pl" cx="-14" cy="-3" r="3.8" fill="#2c2c2c"/><circle class="pr" cx="14" cy="-3" r="3.8" fill="#2c2c2c"/>
              <circle cx="-12.6" cy="-5" r="1.2" fill="#fff"/><circle cx="15.4" cy="-5" r="1.2" fill="#fff"/></g>
            <g class="fb-brows" opacity="0" stroke="#8a6d4b" stroke-width="1.8" stroke-linecap="round" fill="none"><path d="M-21-15l12-3"/><path d="M21-15l-12-3"/></g>
            <path class="fb-mouth" d="${MOUTH.idle.d}" fill="none" stroke="#8c4a40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </g></g>`;
        const mouth = $('.fb-mouth', s), eyes = $('.fb-eyes', s), brows = $('.fb-brows', s), pl = $('.pl', s), pr = $('.pr', s);
        const api = {
            el: s,
            set(state) {
                const m = MOUTH[state] || MOUTH.idle;
                mouth.setAttribute('d', m.d); mouth.setAttribute('fill', m.fill);
                brows.setAttribute('opacity', state === 'care' || state === 'oops' ? 1 : 0);
                s.dataset.state = state;
                const up = state === 'think' ? -3 : 0;
                pl.setAttribute('cy', -3 + up); pr.setAttribute('cy', -3 + up);
            },
            look(dx, dy) {
                if (s.dataset.state === 'think') return;
                pl.setAttribute('cx', -14 + dx); pr.setAttribute('cx', 14 + dx);
                pl.setAttribute('cy', -3 + dy); pr.setAttribute('cy', -3 + dy);
            },
            blink() {
                if (reduce) return;
                eyes.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(.1)' }, { transform: 'scaleY(1)' }], { duration: 180 });
            }
        };
        eyes.style.transformBox = 'fill-box'; eyes.style.transformOrigin = 'center';
        return api;
    };
    const fibros = [];
    const spawn = (host) => { const f = makeFibro(); host.appendChild(f.el); fibros.push(f); return f; };
    window.addEventListener('pointermove', (e) => {
        fibros.forEach((f) => {
            const r = f.el.getBoundingClientRect();
            if (!r.width) return;
            const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
            const k = Math.min(1, Math.hypot(dx, dy) / 240) * 3 / (Math.hypot(dx, dy) || 1);
            f.look(dx * k, dy * k * 0.8);
        });
    }, { passive: true });
    setInterval(() => fibros.forEach((f) => Math.random() < 0.7 && f.blink()), 3200);

    const hero = spawn($('#heroFibroSvg'));
    const heroSay = $('#heroSay');
    const heroLines = ['Pick a product and I will tell you about it', 'Psst, the serum is a good place to start', 'I am just a little cell, but I read the labels'];
    let hl = 0;
    hero.set('happy');
    setInterval(() => { hl = (hl + 1) % heroLines.length; heroSay.textContent = heroLines[hl]; heroSay.classList.remove('pop'); void heroSay.offsetWidth; heroSay.classList.add('pop'); }, 6000);
    if (!sample) heroLines[1] = 'Open anything and ask me about it';

    /* ---------- grid, filters, search ---------- */
    const grid = $('#grid'), empty = $('#empty'), cats = $('#cats'), q = $('#q');
    const catList = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];
    let cat = 'All';
    cats.innerHTML = catList.map((c) => `<button type="button" class="cat${c === 'All' ? ' on' : ''}" data-cat="${esc(c)}" aria-pressed="${c === 'All'}">${esc(c)}</button>`).join('');
    cats.hidden = catList.length < 3;

    const cardHTML = (p) => `
        <article class="pcard" data-id="${esc(p.id)}">
            <button class="open" type="button" aria-label="Open ${esc(p.name)}">
                ${tile(p)}
                <span class="pinfo"><span class="pcat">${esc(p.category || '')}${p.size ? ' · ' + esc(p.size) : ''}</span><span class="pname">${esc(p.name)}</span>${p.note ? `<span class="pnote">${esc(p.note)}</span>` : ''}</span>
            </button>
            <div class="pfoot">${p.price ? `<span class="price">${esc(p.price)}</span>` : '<span></span>'}
                ${p.link ? `<a class="btn btn-solid btn-sm" href="${esc(p.link)}" target="_blank" rel="noopener">Buy now</a>`
                         : `<button class="btn btn-ghost btn-sm" type="button" data-add="${esc(p.id)}">Enquire</button>`}</div>
        </article>`;
    const render = () => {
        const term = q.value.trim().toLowerCase();
        const list = products.filter((p) => (cat === 'All' || p.category === cat) && (!term || [p.name, p.note, p.category, p.key, p.description].join(' ').toLowerCase().includes(term)));
        grid.innerHTML = list.map(cardHTML).join('');
        empty.hidden = list.length > 0;
    };
    cats.addEventListener('click', (e) => {
        const b = e.target.closest('.cat'); if (!b) return;
        cat = b.dataset.cat;
        $$('.cat', cats).forEach((x) => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
        render();
    });
    q.addEventListener('input', render);
    document.addEventListener('keydown', (e) => { if (e.key === '/' && !openDrawer && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); q.focus(); } });
    q.placeholder = 'Search products  ( / )';
    $('#clearFilters').addEventListener('click', () => { q.value = ''; cat = 'All'; $$('.cat', cats).forEach((x) => { const on = x.dataset.cat === 'All'; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); }); render(); });
    render();

    /* ---------- drawers (shared open/close, focus, scroll lock) ---------- */
    let lastFocus = null, openDrawer = null;
    const lock = (on) => document.documentElement.classList.toggle('drawer-open', on);
    const show = (d) => {
        if (openDrawer && openDrawer !== d) hide(openDrawer, true);
        lastFocus = lastFocus || document.activeElement;
        d.hidden = false; void d.offsetWidth; d.classList.add('in'); lock(true); openDrawer = d;
        setTimeout(() => ($('.x', d) || d).focus({ preventScroll: true }), 30);
    };
    const hide = (d, keepFocus) => {
        d.classList.remove('in');
        const done = () => { d.hidden = true; };
        reduce ? done() : setTimeout(done, 320);
        if (openDrawer === d) { openDrawer = null; lock(false); }
        if (!keepFocus && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
        if (!keepFocus) lastFocus = null;
    };
    document.addEventListener('click', (e) => { const c = e.target.closest('[data-close]'); if (c) hide(c.closest('.drawer')); });
    document.addEventListener('keydown', (e) => {
        if (!openDrawer) return;
        if (e.key === 'Escape') { hide(openDrawer); return; }
        if (e.key === 'Tab') { // keep focus inside the open panel
            const f = $$('a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),textarea,select', openDrawer).filter((n) => n.offsetParent !== null);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    /* ---------- enquiry list ---------- */
    const KEY = 'dcv-enquiry-list';
    let list = {};
    try { list = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { list = {}; }
    Object.keys(list).forEach((id) => { if (!byId[id]) delete list[id]; });
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* private mode: fine */ } };
    const count = () => Object.values(list).reduce((a, b) => a + b, 0);
    const bc = $('#basketCount');
    const paintCount = () => { const n = count(); bc.textContent = n; bc.hidden = !n; };
    const flash = () => { const b = $('#basketBtn'); if (reduce) return; b.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }], { duration: 350 }); };
    const add = (id) => { if (window.Feel) Feel.tick(); list[id] = Math.min(9, (list[id] || 0) + 1); save(); paintCount(); paintBasket(); flash(); };

    const bItems = $('#bItems'), bEmpty = $('#bEmpty'), bForm = $('#bForm');
    function paintBasket() {
        const ids = Object.keys(list);
        bItems.innerHTML = ids.map((id) => { const p = byId[id]; return `
            <li data-id="${esc(id)}">${tile(p)}
                <div class="bi"><b>${esc(p.name)}</b><span>${esc(p.price || '')}${p.size ? ' · ' + esc(p.size) : ''}</span></div>
                <div class="qty"><button type="button" data-q="-1" aria-label="Fewer ${esc(p.name)}"><svg class="icon"><use href="#i-minus"/></svg></button><span aria-live="polite">${list[id]}</span><button type="button" data-q="1" aria-label="More ${esc(p.name)}"><svg class="icon"><use href="#i-plus"/></svg></button></div>
            </li>`; }).join('');
        bEmpty.hidden = ids.length > 0;
        bForm.hidden = ids.length === 0;
    }
    bItems.addEventListener('click', (e) => {
        const b = e.target.closest('[data-q]'); if (!b) return;
        const id = b.closest('li').dataset.id;
        list[id] = (list[id] || 0) + Number(b.dataset.q);
        if (list[id] <= 0) delete list[id];
        if (list[id] > 9) list[id] = 9;
        save(); paintCount(); paintBasket();
        if (!Object.keys(list).length) $('#basket .x').focus();
    });
    $('#basketBtn').addEventListener('click', () => { lastFocus = $('#basketBtn'); $('#bSent').hidden = true; bItems.hidden = false; paintBasket(); show($('#basket')); });
    paintCount(); paintBasket();

    $('#bLead').textContent = sample
        ? 'Sample mode: this is a preview, so nothing is sent. Once Dr De Villiers adds her range, your list will be emailed to her and she will reply to confirm availability and how to pay or collect.'
        : $('#bLead').textContent;

    const bStatus = $('#bStatus'), bSubmit = $('#bSubmit');
    const say = (k, t) => { bStatus.className = 'status ' + k; bStatus.textContent = t; };
    bForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!bForm.checkValidity()) { bForm.reportValidity(); return; }
        if (bForm.botcheck.value) return;
        if (sample) { say('ok', 'Preview only: nothing was sent. When the shop is live, this goes straight to Dr De Villiers.'); return; }
        if (isPlaceholder(C.web3formsKey)) { say('ok', 'Demo mode: the form is not connected yet. Add the Web3Forms key in config.js and enquiries will be emailed to Dr De Villiers.'); return; }
        const lines = Object.keys(list).map((id) => `${list[id]} x ${byId[id].name}${byId[id].size ? ' (' + byId[id].size + ')' : ''}${byId[id].price ? ' - ' + byId[id].price : ''}`);
        const data = {
            access_key: C.web3formsKey,
            subject: 'Product enquiry from ' + bForm.name.value,
            from_name: 'Website shop enquiry',
            name: bForm.name.value, email: bForm.email.value, phone: bForm.phone.value || 'not given',
            products: lines.join('\n'),
            message: bForm.message.value || 'No extra message'
        };
        const label = bSubmit.textContent;
        bSubmit.disabled = true; bSubmit.textContent = 'Sending...';
        try {
            const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
            const json = await res.json();
            if (!json.success) throw new Error(json.message || 'Failed');
            $('#bSentName').textContent = bForm.name.value.split(' ')[0];
            bStatus.className = 'status';
            list = {}; save(); paintCount(); paintBasket(); bForm.reset();
            $('#bItems').hidden = true; bEmpty.hidden = true; bForm.hidden = true;
            const sent = $('#bSent'); sent.hidden = false; sent.focus();
            if (window.Feel) { Feel.chime(); Feel.sparkle($('.icon-disc', sent)); }
        } catch (err) {
            say('err', 'Your enquiry did not send. Please try again' + (C.whatsapp && !isPlaceholder(C.whatsapp) ? ', or message directly on WhatsApp.' : '.'));
        } finally { bSubmit.disabled = false; bSubmit.textContent = label; }
    });

    /* ---------- product sheet ---------- */
    const sheet = $('#sheet'), sheetBody = $('#sheetBody');
    let guide = null;

    const open = (id, from) => {
        const p = byId[id]; if (!p) return;
        if (from) lastFocus = from;
        const pairs = (p.pairs || []).map((x) => byId[x]).filter(Boolean);
        const ul = (a) => a && a.length ? `<ul class="ticks">${a.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '';
        sheetBody.innerHTML = `
            <div class="p-top">${tile(p)}
                <div class="p-head">
                    <span class="pcat">${esc(p.category || '')}${p.size ? ' · ' + esc(p.size) : ''}</span>
                    <h2 id="pName">${esc(p.name)}</h2>
                    ${p.price ? `<div class="price big">${esc(p.price)}</div>` : ''}
                    ${p.description ? `<p>${esc(p.description)}</p>` : ''}
                    <div class="p-actions">
                        ${p.link ? `<a class="btn btn-solid" href="${esc(p.link)}" target="_blank" rel="noopener">Buy now</a>` : ''}
                        <button class="btn ${p.link ? 'btn-ghost' : 'btn-solid'}" type="button" id="addBtn"><svg class="icon"><use href="#i-plus"/></svg><span>Add to enquiry</span></button>
                    </div>
                    <p class="fine" id="addNote">${p.link ? 'Pay securely on the next page. Apple Pay and Google Pay are supported.' : 'No payment now. Dr De Villiers will reply by email to confirm.'}</p>
                </div>
            </div>
            ${p.howTo && p.howTo.length || p.goodFor && p.goodFor.length || p.key ? `<div class="p-details">
                ${p.howTo && p.howTo.length ? `<div><h3>How to use it</h3>${ul(p.howTo)}</div>` : ''}
                ${p.goodFor && p.goodFor.length ? `<div><h3>Good for</h3>${ul(p.goodFor)}</div>` : ''}
                ${p.key ? `<div><h3>Key ingredients</h3><p>${esc(p.key)}</p></div>` : ''}
            </div>` : ''}
            ${pairs.length ? `<div class="p-pairs"><h3>Goes well with</h3><div>${pairs.map((x) => `<button type="button" class="pair" data-open="${esc(x.id)}">${esc(x.name)}</button>`).join('')}</div></div>` : ''}
            <section class="guide" aria-label="Ask Fibro about this product">
                <div class="guide-head"><a class="g-av" id="gAv" href="collagen.html" aria-label="Meet Fibro: see how your skin builds collagen" title="See how Fibro builds collagen"></a><div><b>Ask Fibro</b><span>Quick answers from Dr De Villiers’ notes. A scripted guide, not medical advice.</span></div></div>
                <div class="chat" id="chat" role="log" aria-live="polite"></div>
                <div class="qchips" id="qchips"></div>
                <form class="ask" id="ask" autocomplete="off"><label class="sr" for="askIn">Ask Fibro a question</label><input id="askIn" class="control" type="text" placeholder="Ask about this product" maxlength="120"><button class="send" type="submit" aria-label="Send"><svg class="icon"><use href="#i-send"/></svg></button></form>
            </section>`;
        $('#addBtn').addEventListener('click', () => {
            add(p.id);
            $('#addNote').textContent = 'Added. Open your enquiry list to send it, or keep browsing.';
            const sp = $('#addBtn span'); sp.textContent = 'Added'; setTimeout(() => { if (sp) sp.textContent = 'Add one more'; }, 1400);
        });
        sheetBody.scrollTop = 0;
        if (openDrawer !== sheet) show(sheet);
        startGuide(p);
    };
    grid.addEventListener('click', (e) => {
        const a = e.target.closest('[data-add]');
        if (a) { add(a.dataset.add); a.textContent = 'Added'; setTimeout(() => { a.textContent = 'Enquire'; }, 1400); return; }
        const o = e.target.closest('.open');
        if (o) open(o.closest('.pcard').dataset.id, o);
    });
    sheetBody.addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (b) open(b.dataset.open); });

    /* ---------- the guide: scripted replies built from the product data ---------- */
    const BOOK = 'index.html?treatment=Medical-grade%20skincare#book';
    const MEDICAL = /pregnan|breastfeed|prescri|medicat|medicine|allerg|rash|eczema|rosacea|psoria|acne|infect|reaction|burn|pain|swell|cancer|mole|roaccutane|isotretinoin|retin|diagnos|condition|doctor|dr\b|treat(ment)? (me|my)|botox|filler|wrinkle|inject/;
    const reply = (p, text) => {
        const lc = text.toLowerCase();
        const has = (re) => re.test(lc);
        const name = p.name;
        if (has(/^(hi|hello|hey|hiya|howdy)\b/)) return { s: 'happy', t: `Hello! I am Fibro, a little fibroblast. Ask me anything about the ${name}.` };
        if (has(/thank|thanks|cheers|lovely|great/)) return { s: 'happy', t: 'Happy to help! If you would like to try it, add it to your enquiry list and Dr De Villiers will take it from there.' };
        if (has(MEDICAL)) return { s: 'care', t: 'That is a question for Dr De Villiers rather than me. Anything about your health or medical history is best talked through with her directly.', book: true };
        if (has(/how (do|should|to|often|much)|use|apply|routine|morning|night|evening|when|step|order|layer/) && p.howTo && p.howTo.length) return { s: 'happy', t: 'Here is how it is used. ' + p.howTo.join(' ') };
        if (has(/who|suit|skin|type|dry|oily|dull|sensitiv|good for|help|benefit|why|worth/) && p.goodFor && p.goodFor.length) return { s: 'happy', t: `The ${name} is good for: ${p.goodFor.map((x) => x.charAt(0).toLowerCase() + x.slice(1)).join(', ')}.` };
        if (has(/with|pair|combine|together|goes|alongside|routine|layer/)) {
            const ps = (p.pairs || []).map((x) => byId[x]).filter(Boolean);
            if (ps.length) return { s: 'happy', t: `It works nicely with ${ps.map((x) => x.name).join(' and ')}. You can tap them above to have a look.` };
        }
        if (has(/ingredient|contain|made of|inside|active|key/)) return p.key ? { s: 'happy', t: `The key ingredients are ${p.key}. Check the full ingredient list on the packaging if you have any sensitivities.` } : { s: 'oops', t: 'I do not have the ingredient list to hand. Dr De Villiers can go through it with you.', book: true };
        if (has(/price|cost|how much|expensive|euro|€|size|ml|big|last/)) return { s: 'happy', t: `${name}: ${[p.price, p.size].filter(Boolean).join(', ') || 'ask Dr De Villiers for pricing'}.` };
        if (has(/buy|order|get it|purchase|available|stock|enquir|collect|deliver|ship|pay|apple/)) return { s: 'happy', t: p.link ? 'Tap Buy now and you will pay securely on the next page. Apple Pay and Google Pay work there too.' : 'Tap Add to enquiry, then open your enquiry list and send it. Dr De Villiers will reply to confirm availability and how to pay or collect.' };
        if (has(/what|about|tell|describe|it\b/) && p.description) return { s: 'happy', t: p.description };
        return { s: 'oops', t: 'Hmm, I am only a little cell and that one is beyond me. Try one of the questions below, or ask Dr De Villiers.', book: true, chips: true };
    };
    const CHIPS = [['What is it?', 'tell me about it'], ['How do I use it?', 'how do i use it'], ['Who is it for?', 'who is it good for'], ['What goes with it?', 'what goes with it'], ['Is it right for me?', 'is it right for my condition']];

    function startGuide(p) {
        const chat = $('#chat'), qc = $('#qchips'), ask = $('#ask'), inp = $('#askIn');
        let busy = false, timer = null, skip = null;
        const av = $('#gAv'); av.replaceChildren();
        guide = spawn(av);
        // drop references to previous sheet's character
        for (let i = fibros.length - 1; i > 0; i--) if (!fibros[i].el.isConnected && fibros[i] !== guide) fibros.splice(i, 1);
        guide.set('happy');

        const chipsHTML = () => { qc.innerHTML = CHIPS.map(([l, v]) => `<button type="button" class="qc" data-v="${esc(v)}">${esc(l)}</button>`).join(''); };
        const bubble = (cls, html) => { if (cls === 'bot' && window.Feel) Feel.pop(); const d = document.createElement('div'); d.className = 'msg ' + cls; d.innerHTML = html; chat.appendChild(d); chat.scrollTop = chat.scrollHeight; return d; };
        const bot = (r) => new Promise((res) => {
            busy = true;
            guide.set('think');
            const typing = bubble('bot', '<span class="dots"><i></i><i></i><i></i></span>');
            timer = setTimeout(() => {
                typing.innerHTML = '';
                const span = document.createElement('span'); typing.appendChild(span);
                const text = r.t; let i = 0;
                guide.set(r.s === 'care' ? 'care' : 'happy');
                const finish = () => {
                    clearInterval(tick); span.textContent = text; skip = null; busy = false;
                    if (r.book) { const a = document.createElement('a'); a.className = 'inline-link'; a.href = BOOK; a.textContent = 'Ask Dr De Villiers'; typing.appendChild(document.createElement('br')); typing.appendChild(a); }
                    chat.scrollTop = chat.scrollHeight; if (r.s === 'oops') setTimeout(() => guide.set('happy'), 1500); res();
                };
                skip = finish;
                const tick = setInterval(() => { i += 2; span.textContent = text.slice(0, i); chat.scrollTop = chat.scrollHeight; if (i >= text.length) finish(); }, reduce ? 0 : 16);
                if (reduce) finish();
            }, reduce ? 0 : 650 + Math.random() * 350);
        });
        const send = async (txt) => {
            txt = txt.trim(); if (!txt) return;
            if (busy && skip) skip();
            const label = (CHIPS.find((c) => c[1] === txt) || [txt])[0];
            bubble('me', esc(label));
            await bot(reply(p, txt));
        };
        chipsHTML();
        qc.onclick = (e) => { const b = e.target.closest('.qc'); if (b && !busy) send(b.dataset.v); };
        ask.onsubmit = (e) => { e.preventDefault(); const v = inp.value; inp.value = ''; if (!busy) send(v); };
        chat.onclick = () => { if (busy && skip) skip(); };
        // opening line
        bot({ s: 'happy', t: `Hello, I am Fibro! Ask me anything about the ${p.name}, or tap a question below.` });
    }

    /* ---------- deep link: shop.html#serum opens that product ---------- */
    const fromHash = () => { const id = decodeURIComponent(location.hash.slice(1)); if (id && byId[id]) open(id); };
    fromHash();
})();
