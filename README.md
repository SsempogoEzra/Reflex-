# Reflex — Front End

Delivery Visibility & Coordination System — React + Vite implementation of the
Entropy 84 UI/UX spec (role-based dashboards for Retailer, Dispatcher, and Rider).

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Try it out

There's no real backend — this is a front-end prototype with realistic mock
data and in-memory state (per spec: "Fast to Build", MVP scope). On launch you
pick a role:

- **Retailer** ("Jane W.") — Dashboard, New Delivery, My Deliveries, delivery detail with cancel.
- **Dispatcher** ("Mark O.") — Open/Unassigned orders (assign a rider), Active deliveries monitoring.
- **Rider** (pick David K. / Grace N. / James M.) — My Deliveries, status updates, Scan to Deliver.

Your role selection is remembered in `localStorage` so refreshing keeps you
logged in; "Logout" in the sidebar clears it. Delivery data resets on a full
page reload since it lives only in React state (there's no backend yet — see
"Notes" below).

## Status model

Enforced in `src/context/DataContext.jsx`, matching Spec §7:

```
CREATED (Retailer) → ASSIGNED (Dispatcher) → PICKED UP (Rider) → IN TRANSIT (Rider) → DELIVERED
```

- Only an unassigned (`CREATED`) order can be assigned a rider.
- Status only moves forward — never backward or skipped.
- `DELIVERED` can only be reached through the Scan to Deliver flow (simulated
  QR scan), never a plain button click.
- `CANCELLED` is reachable from any non-`DELIVERED` state.

## Project structure

```
src/
  index.css            Design tokens (colors, type, radii) + base styles
  app.css              Layout & component styles (sidebar, cards, timeline, scanner…)
  lib/mockData.js       Status model, seed data, role/rider constants
  context/DataContext.jsx  App state + status-rule-enforced actions
  components/          Shared building blocks (StatusBadge, DeliveryList, Scanner, StatusTimeline, Sidebar, TopBar, MobileNav, RoleLayout)
  pages/
    RoleSelect.jsx       Landing / simulated login
    retailer/           Dashboard, New Delivery, My Deliveries, Delivery Detail
    dispatcher/          Dashboard (assign + monitor), Delivery Detail
    rider/               My Deliveries, Delivery Detail (status controls), Scan to Deliver
```

## Design system

Dark theme per the spec's "Notes" (reduced eye strain), Inter typeface, and
the spec's token palette (`--color-primary #2563EB`, `--color-success
#10B981`, `--color-warning #F59E0B`, `--color-danger #EF4444`). Each role gets
a tinted sidebar/accent (Retailer blue, Dispatcher violet, Rider green) to
make the active role obvious at a glance, mirroring the "DISPATCHER
DASHBOARD" / "RIDER DASHBOARD" mockup headers in the spec.

Layout is mobile-first: the sidebar collapses into a bottom tab bar under
860px, and delivery tables collapse into stacked cards.

## Wiring up a real backend later

The spec's architecture (`Node.js/Express API + MongoDB`, §7) maps cleanly
onto `DataContext.jsx` — swap the in-memory `useState` + mock actions for
`fetch`/`socket.io` calls without touching any page or component, since pages
only ever talk to `useData()`.

## Not yet implemented (see spec §10 Future Enhancements)

Push notifications, live rider map tracking, delivery proof photo upload,
reports/analytics dashboard, multi-branch/outlet support.
