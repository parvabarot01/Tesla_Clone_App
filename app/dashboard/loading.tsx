import { LoadingSection } from "@/components/shared/LoadingSection";

export default function DashboardLoading() {
  return (
    <LoadingSection
      title="Loading dashboard..."
      description="Please wait while we prepare your account activity."
    />
  );
}
