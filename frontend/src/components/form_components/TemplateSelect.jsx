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
    <div className="w-[300px]">
      <Select onValueChange={(value) => onSelect(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a template" />
        </SelectTrigger>
        <SelectContent className="bg-white">
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
