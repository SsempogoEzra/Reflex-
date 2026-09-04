// Delivery lifecycle per Spec §7 System Architecture / Status Model:
// CREATED (Retailer) -> ASSIGNED (Dispatcher) -> PICKED_UP (Rider) -> IN_TRANSIT (Rider) -> DELIVERED
// CANCELLED can occur from any state.

export const STATUS = {
  CREATED: 'CREATED',
  ASSIGNED: 'ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

// Forward-only order, per Sample Status Rule: "Status moves forward only (cannot skip backward)"
export const STATUS_ORDER = [
  STATUS.CREATED,
  STATUS.ASSIGNED,
  STATUS.PICKED_UP,
  STATUS.IN_TRANSIT,
  STATUS.DELIVERED,
];

export const STATUS_CONFIG = {
  [STATUS.CREATED]: { label: 'Created', color: 'var(--color-warning)', soft: 'var(--color-warning-soft)' },
  [STATUS.ASSIGNED]: { label: 'Assigned', color: 'var(--color-primary)', soft: 'var(--color-primary-soft)' },
  [STATUS.PICKED_UP]: { label: 'Picked Up', color: 'var(--color-orange)', soft: 'var(--color-orange-soft)' },
  [STATUS.IN_TRANSIT]: { label: 'In Transit', color: 'var(--color-orange)', soft: 'var(--color-orange-soft)' },
  [STATUS.DELIVERED]: { label: 'Delivered', color: 'var(--color-success)', soft: 'var(--color-success-soft)' },
  [STATUS.CANCELLED]: { label: 'Cancelled', color: 'var(--color-danger)', soft: 'var(--color-danger-soft)' },
};

export const ROLES = {
  RETAILER: 'RETAILER',
  DISPATCHER: 'DISPATCHER',
  RIDER: 'RIDER',
};

export const RIDERS = [
  { id: 'rider-1', name: 'David K.', phone: '0712 345 678' },
  { id: 'rider-2', name: 'Grace N.', phone: '0701 220 981' },
  { id: 'rider-3', name: 'James M.', phone: '0733 998 214' },
];

export const RETAILER_USER = { id: 'retailer-1', name: 'Jane W.', role: ROLES.RETAILER };
export const DISPATCHER_USER = { id: 'dispatcher-1', name: 'Mark O.', role: ROLES.DISPATCHER };

let seedCounter = 8925;
export function nextOrderId() {
  seedCounter += 1;
  return `ORD-${seedCounter}`;
}

export const INITIAL_DELIVERIES = [
  {
    id: 'ORD-8921',
    customer: 'John Doe',
    phone: '0712 000 111',
    address: 'Westlands, Block B',
    item: 'Pharmacy items',
    notes: 'Leave with the security guard if unavailable.',
    amount: 'KSh 4,500',
    status: STATUS.IN_TRANSIT,
    riderId: 'rider-1',
    requestedAt: '10:20 AM',
    updatedAt: '10:30 AM',
  },
  {
    id: 'ORD-8920',
    customer: 'Mary Wanjiku',
    phone: '0722 456 890',
    address: 'Kilimani, Ring Rd',
    item: 'Hardware · assorted',
    notes: '',
    amount: 'KSh 120',
    status: STATUS.PICKED_UP,
    riderId: 'rider-2',
    requestedAt: '10:05 AM',
    updatedAt: '10:16 AM',
  },
  {
    id: 'ORD-8919',
    customer: 'Peter Mwangi',
    phone: '0700 112 233',
    address: 'Ngong Rd, Nairobi',
    item: 'Electronics · charger + cables',
    notes: 'Call before arriving.',
    amount: 'KSh 8,300',
    status: STATUS.CREATED,
    riderId: null,
    requestedAt: '9:45 AM',
    updatedAt: '9:45 AM',
  },
  {
    id: 'ORD-8918',
    customer: 'Alice Achieng',
    phone: '0711 887 665',
    address: 'South B, Nairobi',
    item: 'Groceries',
    notes: '',
    amount: 'KSh 2,150',
    status: STATUS.DELIVERED,
    riderId: 'rider-1',
    requestedAt: 'Yesterday',
    updatedAt: 'Yesterday',
  },
  {
    id: 'ORD-8916',
    customer: 'Alice Achieng',
    phone: '0711 887 665',
    address: 'South B, Nairobi',
    item: 'Stationery',
    notes: '',
    amount: 'KSh 650',
    status: STATUS.CANCELLED,
    riderId: null,
    requestedAt: 'Yesterday',
    updatedAt: 'Yesterday',
  },
  {
    id: 'ORD-8924',
    customer: 'Mary Wanjiku',
    phone: '0722 456 890',
    address: 'Kilimani, Ring Rd',
    item: 'Pharmacy items',
    notes: '',
    amount: 'KSh 980',
    status: STATUS.ASSIGNED,
    riderId: 'rider-1',
    requestedAt: '8:50 AM',
    updatedAt: '9:02 AM',
  },
];

export function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
