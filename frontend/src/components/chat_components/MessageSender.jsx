import { FaArrowUpLong } from "react-icons/fa6";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const MessageSender = ({ input, setInput, isLastStage, onSend, buttonDisable}) => {

      const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          onSend();
        }
      };

    return (
        <div className="flex p-2.5 bg-GRAAY">
            <Input
                type="text"
                value={input}
                disabled={isLastStage || buttonDisable}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter Your Message..."
                className="font-urbanist flex-1 p-2.5 rounded-lg shadow-sm mr-2.5 bg-white border-none"
            />
            <Button className="bg-PRIMARY text-white rounded-md"
                onClick={() => onSend(input)}
                disabled={buttonDisable}>
                <FaArrowUpLong />
            </Button>
        </div>);
}

export default MessageSender;