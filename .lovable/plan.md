

## Plan: Add unread notification count badge to My Stay sidebar

### Approach
Create a small component or hook that fetches the unread notification count for the current user, then display a badge next to the "Notifications" item in the `MyStayLayout` sidebar (both desktop and mobile).

### Changes

**1. Create `src/hooks/useUnreadNotifications.ts`**
- Custom hook using `useQuery` to fetch `SELECT count` from `notifications` where `read = false` and `user_id = current user`
- Add real-time subscription to auto-refresh on new notifications or read status changes
- Returns the unread count number

**2. Update `src/components/MyStayLayout.tsx`**
- Import the hook and the `Badge` component
- Call `useUnreadNotifications()` in the layout
- For the "Notifications" sidebar item (both desktop and mobile nav), render a small badge showing the count when > 0

**3. Bonus: Add badge to GuestNav mobile menu**
- Optionally show the unread count on the notifications-related navigation if applicable

The badge will use the existing `Badge` component with a small circular style (e.g., `h-5 w-5 rounded-full` with primary background).

