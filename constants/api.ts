export const API_ROUTES = {
  vehicles: "/api/vehicles",
  vehicleBySlug: (slug: string) => `/api/vehicles/${slug}`,
  orders: "/api/orders",
  demoDrive: "/api/demo-drive",
  session: "/api/session",
} as const;
