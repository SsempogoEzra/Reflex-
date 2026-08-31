# Reflex Backend

Backend API for **Reflex — Delivery Visibility & Coordination System**.

Reflex helps small retailers manage deliveries by allowing them to create delivery requests, assign riders, track delivery status, and verify completed deliveries.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Socket.io
- CORS
- Nodemon

## Project Structure

```text
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── deliveryController.js
│   ├── userController.js
│   └── verificationController.js
├── models/
│   ├── Delivery.js
│   └── User.js
├── routes/
│   ├── deliveryRoutes.js
│   └── userRoutes.js
├── tests/
│   └── testSocket.js
├── socket.js
├── server.js
├── package.json
└── .env
```

## Setup

Install the dependencies:

```bash
npm install
```

Create a `.env` file and add your MongoDB connection string:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

## Run the Backend

For development:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

Test the API:

```text
GET http://localhost:5000/
```

Expected response:

```json
{
  "message": "Reflex API is running"
}
```

## API Endpoints

### Deliveries

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/deliveries` | Get all deliveries |
| POST | `/api/deliveries` | Create a delivery |
| PATCH | `/api/deliveries/:id/assign` | Assign a rider |
| PATCH | `/api/deliveries/:id/status` | Update delivery status |
| POST | `/api/deliveries/:id/verify` | Verify and complete delivery |

### Users

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/riders` | Get all riders |
| GET | `/api/users/dispatchers` | Get all dispatchers |

## Delivery Workflow

The backend follows this delivery workflow:

```text
CREATED
   ↓
ASSIGNED
   ↓
PICKED_UP
   ↓
DELIVERED
```

A delivery cannot skip valid status transitions.

Delivery verification uses a generated verification code. The assigned rider must provide the correct code after the delivery has reached `PICKED_UP`.

## Real-Time Synchronization

Socket.io provides real-time delivery updates.

The backend emits these events:

```text
delivery:created
delivery:assigned
delivery:statusUpdated
delivery:delivered
```

Connected clients can listen for these events and update their interfaces without manually refreshing the page.

## Socket.io Test

Start the backend:

```bash
npm run dev
```

In another terminal, run:

```bash
node tests/testSocket.js
```

The test client should connect and display:

```text
Socket.io test client connected
Socket ID: ...
Waiting for delivery events...
```

When a delivery is created or updated, the corresponding Socket.io event is displayed in the test terminal.

## Validation and Protection

The backend includes checks for:

- Missing required delivery information
- Duplicate order references
- Invalid rider IDs
- Invalid dispatcher IDs
- Incorrect user roles
- Unauthorized rider actions
- Invalid delivery status transitions
- Incorrect verification codes
- Duplicate delivery verification
- Verification before pickup
- Assigning deliveries that are no longer in `CREATED` status

## Current Status

Backend development and integration testing are complete for the current MVP scope.

The backend has been tested through the complete workflow:

```text
Create Delivery
      ↓
Assign Rider
      ↓
Pick Up Delivery
      ↓
Verify Delivery
      ↓
Mark as Delivered
```

The corresponding Socket.io real-time events have also been tested successfully.

## Next Step

The next phase is connecting the React frontend to this backend.

The frontend will consume the REST API and Socket.io events to provide the retailer, dispatcher, and rider workflows.