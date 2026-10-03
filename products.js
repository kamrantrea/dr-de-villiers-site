/* ============================================================
   SHOP (optional). Leave the list empty and no shop appears.

   To sell a product with no developer needed:
   1. In Stripe, create a "Payment Link" for the product.
   2. Copy the block below, fill it in, and paste it inside the [ ].
   3. Upload the product photo to the images/ folder.

   {
       name:  'Daily SPF 50',
       price: '€45',
       note:  'Lightweight daily protection',     // one short line
       image: 'images/spf.jpg',                    // optional
       link:  'https://buy.stripe.com/xxxxxxxx'    // Stripe Payment Link
   },

   Only list skincare and cosmetic products here. Prescription-only
   medicines (including anti-wrinkle injectables) cannot be advertised
   or sold online in Ireland.
   ============================================================ */
window.PRODUCTS = [];
