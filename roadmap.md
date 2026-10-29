# Roadmap — VYRO Phase 1

## Done
- [x] Lovable Cloud connected; `enquiries` table with RLS (server-only write path) + /api/public/enquiries route
- [x] Design system (ivory/charcoal/bronze, Cormorant Garamond + Jost), header/footer/enquiry form
- [x] Pages: home, saunas, cold plunge, red light therapy, commercial wellness, philosophy, contact, privacy, terms
- [x] 10 stand-in photography assets generated (replace with real photography later)
- [x] Art directions confirmed: homepage = architectural luxury; product pages = wellness-tech precision; recovery sessions (future) = warm retreat

## In progress
(none)

## Next
- [x] Refine product pages toward "wellness technology" precision (numbered details, hairline dividers) while keeping brand identity
- [x] Art-direction pass: varied section rhythms, mobile recomposition, spacing/typography polish across all pages
- [x] End-to-end enquiry verification: form -> /api/public/enquiries -> enquiries table (test row submitted, verified, deleted)
- [ ] Create brand favicon (currently default template icon)
- [x] Saunas page: SAWO model catalogue + room/heater/accessories builder

## Waiting on user
- [ ] Real product photography to replace src/assets stand-ins
- [ ] Final Privacy Policy & Terms copy (pages contain clearly labelled placeholders)
- [ ] Confirm sales@/support@vyrowellness.in receive mail; confirm Instagram account is live at @vyrowellness.in
- [ ] Connect custom domain vyrowellness.in
- [ ] Real product photography to replace src/assets stand-ins
- [ ] Final Privacy Policy & Terms copy (pages contain clearly labelled placeholders)

## Phase 2 (behind feature flag; user sets up Razorpay themselves)
- [ ] Shop, cart, Razorpay checkout; recovery sessions at partner wellness centre (hidden until user enables; partner name/logo configurable); accounts (email+password, Google; admins sales@/support@vyro.in); admin panel; RLS everywhere
