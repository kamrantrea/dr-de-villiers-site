/* ============================================================
   SHOP (optional). Leave the list empty and the shop shows
   sample products, marked clearly as samples. The Shop link in
   the main menu appears only once you add a real product here.

   Copy the block below, fill it in, paste it inside the [ ].
   Only name is required. Anything you leave out is simply not
   shown, and Fibro (the little guide) only talks about what
   you have written.

   {
       id:          'spf50',                       // short, no spaces
       name:        'Daily SPF 50',
       category:    'Protect',                     // Cleanse, Hydrate, Treat or Protect (or your own)
       price:       '€45',
       size:        '50 ml',
       badge:       'New',                         // optional small label
       note:        'Lightweight daily protection', // one short line on the card
       description: 'A longer paragraph shown when someone opens the product.',
       key:         'Broad spectrum filters, vitamin E',  // key ingredients, optional
       howTo:       ['Apply as the last step each morning.', 'Reapply every two hours in strong sun.'],
       goodFor:     ['Everyday protection', 'Wearing under make-up'],
       pairs:       ['serum'],                     // ids of products that go well with it
       shape:       'tube',                        // drawing used until you add a photo: pump, dropper, tube or jar
       tint:        'sand',                        // rose, sage, gold or sand
       image:       'images/spf.jpg',              // optional photo from the images folder
       link:        'https://buy.stripe.com/xxxx'  // optional Stripe Payment Link (adds a Buy now button)
   },

   No link? The product shows Enquire instead: the customer adds it
   to their list and the request is emailed to Dr De Villiers.
   With a link, they can pay straight away (Apple Pay and Google Pay
   work automatically on Stripe pages).

   Only list skincare and cosmetic products here. Prescription-only
   medicines (including anti-wrinkle injectables) cannot be advertised
   or sold online in Ireland.
   ============================================================ */
window.PRODUCTS = [];
