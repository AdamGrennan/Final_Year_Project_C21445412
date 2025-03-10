import { FrequentTable } from "@/components/dashboard-components/FrequentTable";

export default function Page(){
    const mockData = [
        { label: "Overconfidence Bias", percentage: 75 },
        { label: "Confirmation Bias", percentage: 68 },
        { label: "Anchoring Bias", percentage: 60 },
      ];

    return(
        <div>
            <FrequentTable data={mockData}/>
        </div>
    );

}