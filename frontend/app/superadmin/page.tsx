// app/superadmin/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // You can add any additional client-side checks here if needed
  }, [router]);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default DashboardPage;
