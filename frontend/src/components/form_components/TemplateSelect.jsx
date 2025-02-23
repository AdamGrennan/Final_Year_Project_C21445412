import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TemplateSelect = ({ onSelect }) => {
  const [templates] = useState(["None", "Personal", "Work"]);

  return (
    <div className="w-[250px]">
      <Select onValueChange={(value) => onSelect(value)}>
        <SelectTrigger className="bg-white w-full font-urbanist text-gray-700">
          <SelectValue placeholder="Enter a theme" />
        </SelectTrigger>
        <SelectContent className="bg-white font-urbanist text-gray-700">
          {templates.map((template) => (
            <SelectItem key={template} value={template}>
              {template}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateSelect;
