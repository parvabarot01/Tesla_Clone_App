import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrderConfigurator } from "@/components/order/OrderConfigurator";
import { siteConfig } from "@/config/site";
import { vehicleService } from "@/services/vehicleService";

type OrderPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const vehicleSlugs = await vehicleService.getVehicleSlugs();

  return vehicleSlugs.map((vehicleSlug) => ({
    slug: vehicleSlug,
  }));
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await vehicleService.getVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: `Order Vehicle | ${siteConfig.name}`,
      description: "Configure a Tesla-inspired electric vehicle.",
    };
  }

  return {
    title: `Order ${vehicle.name} | ${siteConfig.name}`,
    description: `Configure your ${vehicle.name} with paint, wheels, and interior options.`,
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { slug } = await params;
  const vehicle = await vehicleService.getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  return <OrderConfigurator vehicle={vehicle} />;
}
