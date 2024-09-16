import { auth } from "@/server/auth";
import {
  BarChart,
  Package,
  PenSquare,
  Settings,
  TruckIcon,
} from "lucide-react";

import DashboardNav from "@/components/navigation/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const userLinks = [
    {
      label: "Orders",
      path: "/dashboard/order",
      icon: <TruckIcon size={16} />,
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={16} />,
    },
  ] as const;

  const adminLinks =
    session?.user.role === "admin"
      ? [
          {
            label: "Analytics",
            path: "/dashboard/analytics",
            icon: <BarChart size={16} />,
          },
          {
            label: "Create",
            path: "/dashboard/add-product",
            icon: <PenSquare size={16} />,
          },
          {
            label: "Products",
            path: "/dashboard/products",
            icon: <Package size={16} />,
          },
        ]
      : [];

  // console.log("ROLE:::", session?.user.role);

  const allLinks = [...adminLinks, ...userLinks];

  return (
    <div>
      <DashboardNav allLinks={allLinks} />
      {children}
    </div>
  );
}
