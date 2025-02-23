import { FaArrowUpLong } from "react-icons/fa6";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BiSolidMicrophone } from "react-icons/bi";

const MessageSender = ({ input, setInput, onSend, buttonDisable }) => {

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div className="flex p-3 bg-GRAAY">
      <Input
        type="text"
        value={input}
        disabled={buttonDisable}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Enter Your Message..."
        className="font-urbanist flex-1 p-2.5 rounded-lg shadow-sm mr-2.5 bg-white border-none focus:border-SECONDARY focus:ring-SECONDARY focus:outline-none"
      />
      <Button className="bg-PRIMARY text-white w-8 h-8 rounded-full hover:bg-opacity-80 mr-2"
        onClick={() => onSend(input)}
        disabled={buttonDisable}>
        <FaArrowUpLong />
      </Button>

      <Button className="bg-PRIMARY text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-80"
      disabled={buttonDisable}>
        <BiSolidMicrophone className="text-xl" />
      </Button>

    </div>);
}

export default MessageSender;