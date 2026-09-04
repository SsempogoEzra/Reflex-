# Reflex — Delivery Visibility & Coordination System

Reflex is a role-based delivery coordination app connecting three kinds of users:

- **Retailer** — creates delivery requests and tracks them through to completion
- **Dispatcher** — assigns riders to open requests and monitors active deliveries
- **Rider** — updates delivery status and confirms final delivery via a verification code

Real-time updates are pushed to all connected clients over Socket.io, so status changes made by one role appear live for the others without a page refresh.

## Delivery Lifecycle

```
CREATED → ASSIGNED → PICKED_UP → IN_TRANSIT → DELIVERED
    ↓         ↓            ↓            ↓
                  CANCELLED (from any non-terminal state)
```

- Only a **dispatcher** can assign a rider, and only while a delivery is `CREATED`.
- Only the **assigned rider** can advance a delivery's status, one step forward at a time — no skipping.
- `DELIVERED` can only be reached through verification (a code check), not through the plain status-update endpoint — this prevents a rider from marking something delivered without confirmation.
- `CANCELLED` is reachable from any state except `DELIVERED`/`CANCELLED` itself.

## Tech Stack

**Backend**
- Node.js / Express
- MongoDB with Mongoose
- Socket.io (real-time delivery events)

**Frontend**
- React (Vite)
- react-router-dom
- lucide-react (icons)
- Native `fetch` + `socket.io-client` for talking to the backend

## Project Structure

```
Reflex/
├── backend/
│   ├── config/          # db.js — MongoDB connection
│   ├── controllers/      # deliveryController.js, userController.js, verificationController.js
│   ├── models/           # Delivery.js, User.js
│   ├── routes/           # deliveryRoutes.js, userRoutes.js
│   ├── socket.js          # Socket.io setup and event emitters
│   ├── tests/             # testModels.js (seed script), testSocket.js (event listener)
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/    # DeliveryList, Sidebar, StatusBadge, Scanner, etc.
    │   ├── context/        # DataContext.jsx — session state + API/socket integration
    │   ├── lib/            # api.js (backend calls), mockData.js (status/role constants)
    │   └── pages/          # retailer/, dispatcher/, rider/ route pages
    └── vite.config.js
```

## Getting Started

### Backend

```
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run it:

```
npm run dev
```

The API will be available at `http://localhost:5000`, with routes under `/api/deliveries` and `/api/users`.

### Frontend

```
cd frontend
npm install
npm install socket.io-client
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000
```

Run it:

```
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`).

### Seeding test users

There's no signup flow yet — users are created directly in the database. Run:

```
node tests/testModels.js
```

This creates one retailer, one dispatcher, and one rider test user (and a one-time `TEST-001` test delivery — this part fails harmlessly on repeat runs since order references must be unique).

### Watching real-time events

```
node tests/testSocket.js
```

Connects a plain Socket.io client and logs every delivery event (`created`, `assigned`, `statusUpdated`, `delivered`, `cancelled`) as it happens — useful for confirming the backend is broadcasting correctly while testing the frontend.

## API Reference

| Method | Route | Body | Notes |
|---|---|---|---|
| POST | `/api/deliveries` | `{orderReference, customer:{name,phone,address}, itemDescription, amount, notes}` | Creates a delivery |
| GET | `/api/deliveries` | — | Lists all deliveries |
| PATCH | `/api/deliveries/:id/assign` | `{riderId, dispatcherId}` | Assigns a rider |
| PATCH | `/api/deliveries/:id/status` | `{status, riderId}` | `status`: `PICKED_UP` or `IN_TRANSIT` |
| POST | `/api/deliveries/:id/verify` | `{verificationCode, riderId}` | Confirms delivery, sets status to `DELIVERED` |
| PATCH | `/api/deliveries/:id/cancel` | `{actorId, reason}` | Cancels a delivery |
| GET | `/api/users` | — | Lists all users |
| GET | `/api/users/riders` | — | Lists rider users |
| GET | `/api/users/dispatchers` | — | Lists dispatcher users |

## Known Limitations

- **No authentication.** The role-select screen logs in as an existing seeded user with no password — fine for a prototype, not for production.
- **No signup routes.** New retailer/dispatcher/rider accounts must be inserted directly into MongoDB (see `tests/testModels.js`).
- **Verification codes aren't delivered to customers.** There's no SMS/email step yet, so codes are only visible within the app itself.
- **Sockets aren't scoped per user/role.** Every connected client receives every delivery event; fine at small scale, not ideal once there are many concurrent users.
- **Cancellation isn't role-restricted.** Any valid user ID can currently cancel a delivery.

## License

Internal project — license terms not yet defined.
