

## Plan: Make Admin Dashboard Use Real Data

Replace all hardcoded/mock data in the Admin Dashboard and Admin Reservations pages with live data queried from the database.

### Database Changes

**1. Add RLS policy for admin to view all bookings**
- The `bookings` table currently only allows users to view their own bookings. Add a SELECT policy so admins can view all bookings.

### Code Changes

**2. Rewrite `AdminDashboard.tsx` with real data queries**
- Use `useQuery` to fetch from `bookings`, `service_requests`, and `profiles` tables
- **KPIs** (computed from real data):
  - **Total Bookings**: count of all bookings
  - **Occupancy Rate**: bookings with check_in <= today <= check_out, divided by total rooms (6 from rooms data)
  - **Revenue Today**: sum of `total_price` from bookings created today (or checked-in today)
  - **Available Rooms**: total rooms (6) minus currently occupied
  - **Pending Tasks**: count of service_requests with status = 'pending'
  - **Upcoming Check-ins**: count of bookings where check_in is in the next 7 days
- **Weekly Revenue Chart**: group bookings by day of week (last 7 days), sum `total_price`
- **Weekly Occupancy Chart**: count bookings per day where that day falls between check_in and check_out
- **Recent Bookings Table**: fetch latest 5 bookings joined with profile names (same pattern used in AdminServiceRequests)

**3. Rewrite `AdminReservations.tsx` with real data**
- Use `useQuery` to fetch all bookings with guest profile names
- Display real booking IDs, guest names, room names, dates, statuses, and amounts
- Keep existing search/filter UI structure
- Add real-time subscription for live updates

### Technical Notes
- Reuse the profile-fetching pattern from AdminServiceRequests (batch fetch profiles for unique user_ids)
- Use `date-fns` for date grouping and formatting
- Show loading skeletons while data loads
- Total room count derived from `rooms` array in `src/data/rooms.ts` (6 rooms)

