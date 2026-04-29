export const ROUTES = {
  home: "/",
  vehicles: "/vehicles",
  compare: "/compare",
  energy: "/energy",
  charging: "/charging",
  discover: "/discover",
  shop: "/shop",
  vehicleDetails: (slug: string) => `/vehicles/${slug}`,
  order: (slug: string) => `/order/${slug}`,
  demoDrive: (slug: string) => `/demo-drive/${slug}`,
};
