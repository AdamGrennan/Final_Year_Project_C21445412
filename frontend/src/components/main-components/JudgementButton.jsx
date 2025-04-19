import { Button } from "../ui/button";
import { MdBubbleChart } from "react-icons/md";

const JudgementButton = ({ onClick }) => {
    return (
      <Button onClick={onClick}
        className="relative px-6 py-3 bg-white text-PRIMARY rounded-lg overflow-hidden group w-96 h-[175px]">
        <span className="absolute inset-0 hover:text-white bg-gradient-to-br from-PRIMARY via-MERGE to-SECONDARY w-0 group-hover:w-full transition-all duration-200 ease-out"></span>
        <span className="absolute group-hover:text-white left-2 top-2 text-4xl text-left font-urbanist font-semibold">New<br/>
           Decision</span>
        <span className="absolute group-hover:text-white left-2 top-24 text-2xl font-urbansit font-light">Make a Smarter Choice</span>
        <MdBubbleChart style={{ width: '3.75rem', height: '3.75rem' }} className="absolute right-3 top-2 group-hover:text-white"/>
      </Button>
    );
  };
  
  export default JudgementButton;
  