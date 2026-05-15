export const API_ROUTES = {
  vehicles: "/api/vehicles",
  vehicleBySlug: (slug: string) => `/api/vehicles/${slug}`,
  orders: "/api/orders",
  orderPayment: (orderId: string) => `/api/orders/${orderId}/payment`,
  demoDrive: "/api/demo-drive",
  session: "/api/session",
} as const;
