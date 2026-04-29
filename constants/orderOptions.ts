import type { Vehicle } from "@/types";

export type OrderOption = {
  description?: string;
  id: string;
  label: string;
  price: number;
  previewImages?: Partial<Record<Vehicle["slug"], string>>;
  swatchClassName?: string;
};

export const paintOptions: OrderOption[] = [
  {
    id: "pearl-white",
    label: "Pearl White",
    description: "Clean multi-coat finish with a bright premium look.",
    price: 0,
    previewImages: {
      "model-3": "/images/order/model-3/pearl-white.jpeg",
      "model-y": "/images/order/model-y/pearl-white.jpeg",
    },
    swatchClassName: "bg-neutral-100 ring-1 ring-inset ring-black/10",
  },
  {
    id: "stealth-grey",
    label: "Stealth Grey",
    description: "A darker metallic tone with a restrained, modern feel.",
    price: 1000,
    previewImages: {
      "model-3": "/images/order/model-3/stealth-grey.jpeg",
      "model-y": "/images/order/model-y/stealth-grey.jpeg",
      cybertruck: "/images/order/cybertruck/grey.avif",
    },
    swatchClassName: "bg-neutral-500",
  },
  {
    id: "diamond-black",
    label: "Diamond Black",
    description: "Deep gloss paint for the most dramatic exterior presence.",
    price: 1500,
    previewImages: {
      "model-3": "/images/order/model-3/diamond-black.jpeg",
      "model-y": "/images/order/model-y/diamond-black.jpeg",
    },
    swatchClassName: "bg-neutral-950",
  },
];

export function getPaintOptionsForVehicle(vehicleSlug: Vehicle["slug"]) {
  return paintOptions.filter((option) => option.previewImages?.[vehicleSlug]);
}

export const wheelOptions: OrderOption[] = [
  {
    id: "standard-wheels",
    label: "Standard Wheels",
    description: "Balanced daily setup tuned for range and comfort.",
    price: 0,
  },
  {
    id: "sport-wheels",
    label: "Sport Wheels",
    description: "Sharper visual stance with a more athletic character.",
    price: 1500,
  },
  {
    id: "performance-wheels",
    label: "Performance Wheels",
    description: "Most aggressive wheel package for a more focused look.",
    price: 2500,
  },
];

export const interiorOptions: OrderOption[] = [
  {
    id: "black-interior",
    label: "Black Interior",
    description: "A dark minimalist cabin with a clean everyday feel.",
    price: 0,
  },
  {
    id: "white-interior",
    label: "White Interior",
    description: "High-contrast interior finish with a brighter modern look.",
    price: 1000,
  },
  {
    id: "cream-interior",
    label: "Cream Interior",
    description: "Soft premium tone for a warmer, more relaxed cabin.",
    price: 1000,
  },
];
