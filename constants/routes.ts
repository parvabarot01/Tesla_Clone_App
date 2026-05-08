const dashboardPath = "/dashboard";
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
  signIn: signInPath,
  signInWithCallback: (callbackUrl: string = dashboardPath) =>
    `${signInPath}?callbackUrl=${encodeURIComponent(callbackUrl)}`,
  authSignIn: (callbackUrl: string = dashboardPath) =>
    `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
  authSignOut: (callbackUrl: string = "/") =>
    `/api/auth/signout?callbackUrl=${encodeURIComponent(callbackUrl)}`,
  vehicleDetails: (slug: string) => `/vehicles/${slug}`,
  order: (slug: string) => `/order/${slug}`,
  demoDrive: (slug: string) => `/demo-drive/${slug}`,
};
