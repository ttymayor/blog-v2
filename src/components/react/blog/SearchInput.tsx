import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "尋",
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);

  // Sync external value changes (e.g., when clearing filters)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSearch = () => {
    onChange(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <InputGroup>
          <InputGroupInput
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Search blog posts"
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <Button onClick={handleSearch} aria-label="Search">
        找
      </Button>
    </div>
  );
}
