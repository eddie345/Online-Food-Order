// src/app/kitchen/page.tsx
import { KdsDashboard } from "@/components/kds/KdsDashboard";

export const metadata = { title: "Kitchen Display — CEPE Grills" };

export default function KitchenPage(): React.JSX.Element {
  return <KdsDashboard />;
}
