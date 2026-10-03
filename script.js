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
        instagram: !!C.instagram
    };
    const waText = encodeURIComponent('Hi Dr de Villiers, I would like to book an appointment.');

    $$('[data-cfg]').forEach((el) => {
        const k = el.dataset.cfg;
        if (!has[k]) { el.hidden = true; return; }
        if (k === 'email')     { el.href = 'mailto:' + C.email; if (el.dataset.show !== 'false') el.textContent = C.email; }
        if (k === 'phone')     { el.href = 'tel:' + tel;        if (el.dataset.show !== 'false') el.textContent = C.phone; }
        if (k === 'whatsapp')  { el.href = 'https://wa.me/' + C.whatsapp + '?text=' + waText; el.target = '_blank'; el.rel = 'noopener'; }
        if (k === 'instagram') { el.href = 'https://instagram.com/' + C.instagram.replace('@', ''); el.target = '_blank'; el.rel = 'noopener'; }
    });
    // hide list rows / groups whose every contact link is hidden
    $$('[data-hide-if-empty]').forEach((box) => {
        if ($$('[data-cfg]', box).every((a) => a.hidden)) box.hidden = true;
    });

    /* ---------- shop: built from products.js, hidden when empty ---------- */
    const products = (window.PRODUCTS || []).filter((p) => p && p.name && p.link);
    if (products.length) {
        const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        $('#shopGrid').innerHTML = products.map((p) => `
            <article class="card product">
                <div class="photo">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : ''}</div>
                <div class="product-body">
                    <h3>${esc(p.name)}</h3>
                    ${p.note ? `<p>${esc(p.note)}</p>` : ''}
                    ${p.price ? `<span class="price">${esc(p.price)}</span>` : ''}
                    <a class="btn btn-solid btn-sm" href="${esc(p.link)}" target="_blank" rel="noopener">Buy now</a>
                </div>
            </article>`).join('');
        $('#shop').hidden = false;
        $$('[data-shop-link]').forEach((li) => { li.hidden = false; });
    }

    /* ---------- header + mobile menu ---------- */
    const header = $('#siteHeader');
    const menuBtn = $('#menuBtn');
    const desktop = window.matchMedia('(min-width: 961px)');

    const setMenu = (open) => {
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

    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- booking: every Book button lands on the form ---------- */
    const form = $('#enquiryForm');
    const select = $('#treatment');
    $$('a[href="#book"]').forEach((a) => a.addEventListener('click', () => {
        if (a.dataset.treatment) select.value = a.dataset.treatment;
        // let the smooth scroll finish, then put the cursor in the first field
        setTimeout(() => $('#firstName').focus({ preventScroll: true }), 700);
    }));

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
    const say = (kind, text) => { statusBox.className = 'status ' + kind; statusBox.textContent = text; };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        if (form.botcheck.value) return; // spam trap

        if (isPlaceholder(C.web3formsKey)) {
            say('ok', 'Demo mode: the form is not connected yet. Once the Web3Forms key is added in config.js, requests will be emailed straight to Dr de Villiers.');
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
            say('ok', 'Thank you. Your request has been sent and Dr de Villiers will reply personally to confirm your appointment.');
            form.reset();
        } catch (err) {
            say('err', 'Your request did not send. Please try again' + (has.whatsapp || has.phone ? ', or message or call directly.' : '.'));
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
        }
    });
})();
