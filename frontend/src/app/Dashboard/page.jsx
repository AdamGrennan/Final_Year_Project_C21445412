"use client"
import { FrequentTable } from "@/components/dashboard-components/FrequentTable";
import { DashboardCarousel } from "@/components/dashboard-components/DashboardCarousel";
import { DecisionStats } from "@/components/dashboard-components/DecisionStats";
import { useUser } from "@/context/UserContext";

export default function Page() {
  const { user } = useUser();

  const mockData = [
    { label: "Overconfidence Bias", percentage: 75 },
    { label: "Confirmation Bias", percentage: 68 },
    { label: "Anchoring Bias", percentage: 42 },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 w-full px-6 pt-4">
      <div className="col-span-1">
        <FrequentTable data={mockData} />
        <div className="mt-10">
          <DecisionStats user={user}/>
        </div>
      </div>

      <div className="col-span-1"></div>

      <div className="col-span-1 flex justify-end">
        <DashboardCarousel />
      </div>
    </div>
  );
};
