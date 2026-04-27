import type { Vehicle } from "@/types";

export type OrderOption = {
  id: string;
  label: string;
  price: number;
  previewImages?: Partial<Record<Vehicle["slug"], string>>;
};

export const paintOptions: OrderOption[] = [
  {
    id: "pearl-white",
    label: "Pearl White",
    price: 0,
    previewImages: {
      "model-3": "/images/order/model-3/pearl-white.jpeg",
      "model-y": "/images/order/model-y/pearl-white.jpeg",
    },
  },
  {
    id: "stealth-grey",
    label: "Stealth Grey",
    price: 1000,
    previewImages: {
      "model-3": "/images/order/model-3/stealth-grey.jpeg",
      "model-y": "/images/order/model-y/stealth-grey.jpeg",
      cybertruck: "/images/order/cybertruck/grey.avif",
    },
  },
  {
    id: "diamond-black",
    label: "Diamond Black",
    price: 1500,
    previewImages: {
      "model-3": "/images/order/model-3/diamond-black.jpeg",
      "model-y": "/images/order/model-y/diamond-black.jpeg",
    },
  },
];

export function getPaintOptionsForVehicle(vehicleSlug: Vehicle["slug"]) {
  return paintOptions.filter((option) => option.previewImages?.[vehicleSlug]);
}

export const wheelOptions: OrderOption[] = [
  { id: "standard-wheels", label: "Standard Wheels", price: 0 },
  { id: "sport-wheels", label: "Sport Wheels", price: 1500 },
  { id: "performance-wheels", label: "Performance Wheels", price: 2500 },
];

export const interiorOptions: OrderOption[] = [
  { id: "black-interior", label: "Black Interior", price: 0 },
  { id: "white-interior", label: "White Interior", price: 1000 },
  { id: "cream-interior", label: "Cream Interior", price: 1000 },
];
