export type NavItem = {
  label: string;
  href: string;
};

export type CtaButton = {
  label: string;
  href?: string;
};

export type HeroContent = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  description?: string;
  backgroundImage: string;
  primaryCta: CtaButton;
  secondaryCta: CtaButton;
};

export type PromoCard = {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  href?: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  href?: string;
};

export type EnergyCard = {
  title: string;
  subtitle: string;
  image: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  primaryHref?: string;
  secondaryHref?: string;
};

export type Vehicle = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  image: string;
  range: string;
  topSpeed: string;
  acceleration: string;
  startingPrice: string;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type OrderSelection = {
  vehicleSlug: string;
  paintId: string;
  wheelId: string;
  interiorId: string;
};

export type OrderPriceBreakdown = {
  basePrice: number;
  paintPrice: number;
  wheelPrice: number;
  interiorPrice: number;
  totalPrice: number;
};

export type UserRole = "USER" | "ADMIN";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export type MockPaymentResultStatus = Exclude<PaymentStatus, "PENDING">;

export type MockPaymentMethod =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "UPI"
  | "NET_BANKING";

export type OrderPayload = {
  vehicleSlug: string;
  vehicleName: string;
  selection: OrderSelection;
  pricing: OrderPriceBreakdown;
  submittedAt: string;
};

export type OrderConfirmation = {
  accepted: true;
  orderId: string;
  paymentStatus: PaymentStatus;
  vehicleSlug: string;
  vehicleName: string;
  totalPrice: number;
  submittedAt: string;
};

export type PaymentUpdatePayload = {
  orderId: string;
  paymentMethod: MockPaymentMethod;
  paymentReference?: string;
  paidAt?: string;
  paymentStatus: MockPaymentResultStatus;
};

export type PaymentConfirmation = {
  accepted: true;
  orderId: string;
  paymentMethod?: MockPaymentMethod;
  paymentReference?: string;
  paidAt?: string;
  paymentStatus: PaymentStatus;
  vehicleName: string;
};

export type OrderValidationError = {
  field: string;
  message: string;
};

export type DemoDriveFormValues = {
  vehicleSlug: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  preferredDate: string;
  preferredTimeSlot: string;
};

export type DemoDrivePayload = {
  vehicleSlug: string;
  vehicleName: string;
  form: DemoDriveFormValues;
  submittedAt: string;
};

export type DemoDriveValidationError = {
  field: string;
  message: string;
};

export type DemoDriveConfirmation = {
  accepted: true;
  referenceId: string;
  vehicleSlug: string;
  vehicleName: string;
  preferredDate: string;
  preferredTimeSlot: string;
  location: string;
  submittedAt: string;
};

export type PersistedBuildSelection = {
  interiorId: string;
  paintId: string;
  wheelsId: string;
};

export type PersistedDemoDriveDraft = Omit<DemoDriveFormValues, "vehicleSlug">;

export type PageHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  primaryCta: CtaButton;
  secondaryCta: CtaButton;
};

export type PageStat = {
  value: string;
  label: string;
  detail?: string;
};

export type PageFeature = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  action: CtaButton;
  theme?: "light" | "dark";
  imageSide?: "left" | "right";
};

export type PageCollectionCard = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  action: CtaButton;
};

export type ShowcasePage = {
  title: string;
  description: string;
  hero: PageHero;
  stats: PageStat[];
  features: PageFeature[];
  collection: PageCollectionCard[];
  cta: {
    title: string;
    description: string;
    primaryCta: CtaButton;
    secondaryCta: CtaButton;
  };
};
