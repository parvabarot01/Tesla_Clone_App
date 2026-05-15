const dashboardPath = "/dashboard";
const adminPath = "/admin";
const adminOrdersPath = `${adminPath}/orders`;
const adminDemoDrivesPath = `${adminPath}/demo-drives`;
const adminVehiclesPath = `${adminPath}/vehicles`;
const signInPath = "/sign-in";

export const ROUTES = {
  home: "/",
  vehicles: "/vehicles",
  compare: "/compare",
  energy: "/energy",
  charging: "/charging",
  discover: "/discover",
  shop: "/shop",
  dashboard: dashboardPath,
  admin: adminPath,
  adminOrders: adminOrdersPath,
  adminDemoDrives: adminDemoDrivesPath,
  adminVehicles: adminVehiclesPath,
  signIn: signInPath,
  signInWithCallback: (callbackUrl: string = dashboardPath) =>
    `${signInPath}?callbackUrl=${encodeURIComponent(callbackUrl)}`,
  authSignIn: (callbackUrl: string = dashboardPath) =>
    `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
  authSignOut: (callbackUrl: string = "/") =>
    `/api/auth/signout?callbackUrl=${encodeURIComponent(callbackUrl)}`,
  vehicleDetails: (slug: string) => `/vehicles/${slug}`,
  order: (slug: string) => `/order/${slug}`,
  checkout: (orderId: string) => `/checkout/${orderId}`,
  demoDrive: (slug: string) => `/demo-drive/${slug}`,
};
