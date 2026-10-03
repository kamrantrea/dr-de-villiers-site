(() => {
    'use strict';
    const C = window.SITE || {};
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const isPlaceholder = (v) => !v || /X{3,}|YOUR-|example\.ie/.test(v);

    /* ---------- contact details from config.js ---------- */
    const tel = (C.phone || '').replace(/[^\d+]/g, '');
    const has = {
        email: !isPlaceholder(C.email),
        phone: !isPlaceholder(C.phone),
        whatsapp: !isPlaceholder(C.whatsapp),
        instagram: !!C.instagram,
        googleReviews: !!C.googleReviews
    };
    const waText = encodeURIComponent('Hi Dr De Villiers, I would like to book an appointment.');

    $$('[data-cfg]').forEach((el) => {
        const k = el.dataset.cfg;
        el.hidden = !has[k];
        if (!has[k]) return;
        if (k === 'email')     { el.href = 'mailto:' + C.email; if (el.dataset.show !== 'false') el.textContent = C.email; }
        if (k === 'phone')     { el.href = 'tel:' + tel;        if (el.dataset.show !== 'false') el.textContent = C.phone; }
        if (k === 'whatsapp')  { el.href = 'https://wa.me/' + C.whatsapp + '?text=' + waText; el.target = '_blank'; el.rel = 'noopener'; }
        if (k === 'googleReviews') { el.href = C.googleReviews; el.target = '_blank'; el.rel = 'noopener'; }
        if (k === 'instagram') { el.href = 'https://instagram.com/' + C.instagram.replace('@', ''); el.target = '_blank'; el.rel = 'noopener'; }
    });
    // hide list rows / groups whose every contact link is hidden
    $$('[data-hide-if-empty]').forEach((box) => {
        if ($$('[data-cfg]', box).every((a) => a.hidden)) box.hidden = true;
    });

    /* ---------- optional address + directions ---------- */
    if (C.address) {
        $('#addressText').textContent = C.address;
        const dir = $('#dirLink');
        dir.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(C.address);
        dir.hidden = false;
    }

    /* ---------- optional intro video (loads only when played) ---------- */
    if (C.introVideo) {
        $('#video').hidden = false;
        const yt = String(C.introVideo).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
        $('#videoPlay').addEventListener('click', () => {
            const frame = $('#videoFrame');
            const media = yt
                ? Object.assign(document.createElement('iframe'), {
                    src: 'https://www.youtube-nocookie.com/embed/' + yt[1] + '?autoplay=1&rel=0',
                    allow: 'autoplay; encrypted-media; picture-in-picture', allowFullscreen: true, title: 'Meet Dr De Villiers'
                })
                : Object.assign(document.createElement('video'), { src: C.introVideo, controls: true, autoplay: true, playsInline: true });
            frame.replaceChildren(media);
        });
    }

    /* ---------- Shop link: appears in the menu only once real products exist ---------- */
    if ((window.PRODUCTS || []).some((p) => p && p.name)) $$('[data-shop-link]').forEach((li) => { li.hidden = false; });

    /* ---------- header + mobile menu ---------- */
    const header = $('#siteHeader');
    const menuBtn = $('#menuBtn');
    const desktop = window.matchMedia('(min-width: 961px)');

    const setMenu = (open) => {
        if (window.Feel && open !== header.classList.contains('open')) Feel.tap();
        header.classList.toggle('open', open);
        document.documentElement.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', () => setMenu(!header.classList.contains('open')));
    $$('.nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && header.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
    // rotating a phone or resizing the window must never leave the page locked
    desktop.addEventListener('change', (e) => { if (e.matches) setMenu(false); });

    let anchoring = false; // true while a menu/anchor jump is scrolling, so the header stays put
    let lastY = window.scrollY;
    let run = 0; // pixels scrolled in the current direction
    const onScroll = () => {
        const y = window.scrollY;
        const d = y - lastY;
        lastY = y;
        header.classList.toggle('scrolled', y > 24);
        run = (d > 0) === (run > 0) ? run + d : d;
        if (header.classList.contains('open') || anchoring) return;
        // tuck the header away when reading down, bring it back as soon as they scroll up
        if (run > 40 && y > 500) header.classList.add('tucked');
        else if (run < -12 || y < 200) header.classList.remove('tucked');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- anchor links: land on the heading, every time ---------- */
    const GAP = 28;
    const landing = (el) => {
        if (el.id === 'top') return 0;
        const first = el.querySelector('.wrap > *') || el;
        const hh = header.getBoundingClientRect().height || 76;
        return Math.max(0, first.getBoundingClientRect().top + window.scrollY - hh - GAP);
    };
    let animId = 0;
    const goTo = (el, instant) => new Promise((done) => {
        const id = ++animId;
        const root = document.documentElement;
        header.classList.remove('tucked');
        anchoring = true; run = 0;
        root.style.scrollBehavior = 'auto';
        let cancelled = false;
        const finish = () => { root.style.scrollBehavior = ''; lastY = window.scrollY; run = 0; anchoring = false; cleanup(); done(); };
        const stop = () => { cancelled = true; };
        const cleanup = () => ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((t) => window.removeEventListener(t, stop));
        ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((t) => window.addEventListener(t, stop, { passive: true }));
        const from = window.scrollY;
        const t0 = performance.now();
        const dur = instant || reduceMotion ? 0 : Math.min(1100, 450 + Math.abs(landing(el) - from) * 0.25);
        let settled = 0;
        const step = (now) => {
            if (id !== animId) { cleanup(); done(); return; }      // a newer jump took over
            if (cancelled) { finish(); return; }                   // the person grabbed the scroll themselves
            const target = landing(el);                            // re-measured each frame, so late layout shifts cannot throw it off
            const k = dur ? Math.min(1, (now - t0) / dur) : 1;
            const e = 1 - Math.pow(1 - k, 3);
            const y = k < 1 ? from + (target - from) * e : target;
            window.scrollTo(0, y);
            if (k >= 1 && Math.abs(window.scrollY - target) < 1.5) settled++; else settled = 0;
            if (settled >= 8 || now - t0 > dur + 1500) { finish(); return; } // hold for a few frames so images and fonts finishing late are absorbed
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
    const hashTarget = (h) => { try { return h.length > 1 ? document.getElementById(decodeURIComponent(h.slice(1))) : null; } catch (e) { return null; } };
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
        const el = hashTarget(a.getAttribute('href'));
        if (!el) return;
        e.preventDefault();
        history.pushState(null, '', a.getAttribute('href'));
        // wait one frame so a closing mobile menu has released the scroll lock
        requestAnimationFrame(() => goTo(el).then(() => {
            if (el.id === 'book' && a.matches('a[href="#book"]')) $('#firstName').focus({ preventScroll: true });
        }));
    });
    window.addEventListener('popstate', () => { const el = hashTarget(location.hash); if (el) goTo(el); else if (!location.hash) goTo($('#top')); });
    // arriving with #book in the address (from another page), or fonts changing the layout: align once everything has settled
    if (hashTarget(location.hash)) {
        const el = hashTarget(location.hash);
        const align = () => goTo(el, true);
        if (document.readyState === 'complete') align(); else window.addEventListener('load', align, { once: true });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(align);
    }

    /* ---------- which section is on screen (underlines its menu link) ---------- */
    if ('IntersectionObserver' in window) {
        const links = new Map($$('.nav a[href^="#"]:not(.btn)').map((a) => [a.getAttribute('href').slice(1), a]));
        const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
            const a = links.get(en.target.id);
            if (!a) return;
            if (en.isIntersecting) { links.forEach((x) => x.removeAttribute('aria-current')); a.setAttribute('aria-current', 'true'); }
            else if (a.getAttribute('aria-current')) a.removeAttribute('aria-current');
        }), { rootMargin: '-35% 0px -60% 0px' });
        links.forEach((a, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
    }

    /* ---------- photos fade in when ready ---------- */
    $$('.photo img').forEach((img) => {
        if (img.complete && img.naturalWidth) return;
        img.classList.add('fade');
        img.addEventListener('load', () => img.classList.add('loaded'));
    });

    /* ---------- back to top ---------- */
    const toTop = $('#toTop');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const toggleTop = () => toTop.classList.toggle('show', window.scrollY > 700);
    toggleTop();
    window.addEventListener('scroll', toggleTop, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

    /* ---------- gentle reveal for content below the fold (never hides anything without JS) ---------- */
    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver((entries) => entries.forEach((en) => {
            if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
        $$('.head, .about-copy, .about-media, .creds li, .path li, .treat, .pillar, .quote, .step, .faq, .cta .wrap > *, .book-copy, .book-form').forEach((el) => {
            if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('reveal'); io.observe(el); }
        });
    }

    /* ---------- booking: every Book button lands on the form ---------- */
    const form = $('#enquiryForm');
    const select = $('#treatment');
    $$('a[href="#book"]').forEach((a) => a.addEventListener('click', () => {
        if (a.dataset.treatment) select.value = a.dataset.treatment;
        if (a.dataset.message) $('#message').value = a.dataset.message;
    }));

    // links from other pages can pre-select a treatment: index.html?treatment=Biostimulators#book
    const wanted = new URLSearchParams(location.search).get('treatment');
    if (wanted && [...select.options].some((o) => o.value === wanted || o.text === wanted)) select.value = wanted;

    // dock (mobile bar) hides while the form itself is on screen
    const dock = $('#dock');
    if (dock && 'IntersectionObserver' in window) {
        new IntersectionObserver(([en]) => dock.classList.toggle('away', en.isIntersecting), { threshold: 0.15 })
            .observe($('#book'));
    }

    /* ---------- date picker: tomorrow onwards ---------- */
    const dateInput = $('#date');
    const pad = (n) => String(n).padStart(2, '0');
    const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const latest = new Date();   latest.setMonth(latest.getMonth() + 6);
    dateInput.min = iso(tomorrow);
    dateInput.max = iso(latest);

    /* ---------- enquiry form (emailed to the doctor via Web3Forms) ---------- */
    const statusBox = $('#formStatus');
    const submitBtn = $('#formSubmit');
    const submitLabel = submitBtn.textContent;
    const sentPanel = $('#sentPanel');
    $('#sentAgain').addEventListener('click', () => { sentPanel.hidden = true; form.hidden = false; $('#firstName').focus(); });
    const say = (kind, text) => { statusBox.className = 'status ' + kind; statusBox.textContent = text; };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        if (form.botcheck.value) return; // spam trap

        if (isPlaceholder(C.web3formsKey)) {
            say('ok', 'Demo mode: the form is not connected yet. Once the Web3Forms key is added in config.js, requests will be emailed straight to Dr De Villiers.');
            return;
        }

        const data = Object.fromEntries(new FormData(form).entries());
        delete data.consent;
        if (data.preferred_date) {
            const [y, m, d] = data.preferred_date.split('-');
            data.preferred_date = d + '/' + m + '/' + y;
        }
        data.access_key = C.web3formsKey;
        data.subject = 'New appointment request: ' + data.first_name + ' ' + data.last_name + ' (' + data.treatment + ')';
        data.from_name = 'Website enquiry';

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message || 'Failed');
            statusBox.className = 'status';
            $('#sentName').textContent = data.first_name;
            form.hidden = true;
            sentPanel.hidden = false;
            sentPanel.focus();
            if (window.Feel) { Feel.chime(); Feel.sparkle($('.icon-disc', sentPanel)); }
            form.reset();
        } catch (err) {
            say('err', 'Your request did not send. Please try again' + (has.whatsapp || has.phone ? ', or message or call directly.' : '.'));
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
        }
    });
})();
