// src/lib/api.js
//
// Central place for every call to the Reflex backend, plus the Socket.io
// client. Set VITE_API_URL in a .env file (Vite convention) — falls back to
// localhost:5000 for local dev.
//
//   VITE_API_URL=http://localhost:5000

import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ---------------------------------------------------------------------------
// Low-level fetch wrapper
// ---------------------------------------------------------------------------

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (shouldn't normally happen — backend always returns JSON)
  }

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.body = data;
    throw error;
  }

  return data;
}

// ---------------------------------------------------------------------------
// Shape mapping: backend Delivery document -> frontend delivery shape
// (the shape DeliveryList.jsx / Scanner.jsx / etc. already expect)
// ---------------------------------------------------------------------------

export function mapDelivery(d) {
  return {
    id: d._id,
    orderReference: d.orderReference,
    customer: d.customer?.name,
    phone: d.customer?.phone,
    address: d.customer?.address,
    item: d.itemDescription,
    notes: d.notes,
    amount: d.amount,
    status: d.status,
    riderId: d.assignedRider?._id || d.assignedRider || null,
    riderName: d.assignedRider?.name,
    verificationCode: d.verification?.verificationCode,
    verified: d.verification?.verified,
    requestedAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

// ---------------------------------------------------------------------------
// Deliveries
// ---------------------------------------------------------------------------

export async function fetchDeliveries() {
  const data = await request('/api/deliveries');
  return data.deliveries.map(mapDelivery);
}

// input: { orderReference, customer: {name, phone, address}, itemDescription, amount, notes }
export async function apiCreateDelivery(input) {
  const data = await request('/api/deliveries', { method: 'POST', body: input });
  return mapDelivery(data.delivery);
}

export async function apiAssignDelivery(orderId, riderId, dispatcherId) {
  const data = await request(`/api/deliveries/${orderId}/assign`, {
    method: 'PATCH',
    body: { riderId, dispatcherId },
  });
  return mapDelivery(data.delivery);
}

// status: "PICKED_UP" | "IN_TRANSIT"
export async function apiUpdateStatus(orderId, status, riderId) {
  const data = await request(`/api/deliveries/${orderId}/status`, {
    method: 'PATCH',
    body: { status, riderId },
  });
  return mapDelivery(data.delivery);
}

export async function apiVerifyDelivery(orderId, verificationCode, riderId) {
  const data = await request(`/api/deliveries/${orderId}/verify`, {
    method: 'POST',
    body: { verificationCode, riderId },
  });
  return mapDelivery(data.delivery);
}

export async function apiCancelDelivery(orderId, actorId, reason) {
  const data = await request(`/api/deliveries/${orderId}/cancel`, {
    method: 'PATCH',
    body: { actorId, reason },
  });
  return mapDelivery(data.delivery);
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function fetchUsers() {
  const data = await request('/api/users');
  return data.users;
}

export async function fetchRiders() {
  const data = await request('/api/users/riders');
  return data.users;
}

export async function fetchDispatchers() {
  const data = await request('/api/users/dispatchers');
  return data.users;
}

// NOTE: there's no dedicated /api/users/retailers route on the backend yet.
// Filtering the full user list client-side as a stand-in — add a real route
// if the retailer list grows.
export async function fetchRetailers() {
  const users = await fetchUsers();
  return users.filter((u) => u.role === 'retailer');
}

// ---------------------------------------------------------------------------
// Socket.io client
// ---------------------------------------------------------------------------

let socket = null;

// Events: delivery:created, delivery:assigned, delivery:statusUpdated,
// delivery:delivered, delivery:cancelled — each payload is a raw delivery
// document (map it with mapDelivery before using it in UI state).
export function getSocket() {
  if (!socket) {
    socket = io(BASE_URL, { autoConnect: true });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}