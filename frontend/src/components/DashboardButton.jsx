import { Button } from "./ui/button";
import { FaChartSimple } from "react-icons/fa6";

const DashboardButton = () => {
    return (
      <Button className="relative px-6 py-3 bg-GRAAY text-PRIMARY rounded-lg overflow-hidden group w-96 h-[175px]">
        <span className="absolute inset-0 hover:text-white bg-gradient-to-br from-PRIMARY via-MERGE to-SECONDARY w-0 group-hover:w-full transition-all duration-200 ease-out"></span>
        <span className="absolute group-hover:text-white left-2 top-2 text-4xl font-urbanist font-bold">Dashboard</span>
        <span className="absolute group-hover:text-white left-2 top-16 text-2xl font-urbansit ">Factors affecting your judgements</span>
        <FaChartSimple className="absolute group-hover:text-white"/>
      </Button>
    );
  };
  
  export default DashboardButton;
  