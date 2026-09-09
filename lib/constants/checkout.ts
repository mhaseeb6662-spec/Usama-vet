export const SHIPPING_FEE = 0;

export const ORDER_PAYMENT_METHODS = ["COD", "ADVANCE"] as const;
export const ORDER_PAYMENT_STATUSES = ["UNPAID", "PAID"] as const;

export const ORDER_PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  ADVANCE: "Advance Payment (Bank / JazzCash)",
};
export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[number];
export type PaymentStatusValue = (typeof ORDER_PAYMENT_STATUSES)[number];
export type PaymentMethodValue = (typeof ORDER_PAYMENT_METHODS)[number];

export const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatusValue, OrderStatusValue[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export const TRACKING_STEPS: { status: OrderStatusValue; label: string }[] = [
  { status: "PENDING", label: "Order Placed" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "PROCESSING", label: "Processing" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "DELIVERED", label: "Delivered" },
];
