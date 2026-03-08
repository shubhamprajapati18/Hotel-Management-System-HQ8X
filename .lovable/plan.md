

## Plan: Add "Book Your Stay" Button to Guest Dashboard

Add a prominent call-to-action button on the My Stay (`/my-stay`) page that links to the Rooms page (`/rooms`), encouraging guests to explore and book rooms.

### Changes

**`src/pages/GuestDashboard.tsx`**
- Add a styled CTA card/button section below the welcome heading (before Quick Actions)
- Include a "Book Your Stay" button linking to `/rooms` with supporting text like "Explore our rooms & suites"
- Use the existing `luxury` button variant and `framer-motion` animation for consistency
- Import `Link` from `react-router-dom`

