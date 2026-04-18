import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

interface FilterProps {
  search: string;
  setSearch: (search: string) => void;
  totalPosts: number;
}

export default function Filter({ search, setSearch, totalPosts }: FilterProps) {
  return (
    <div>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          <span className="text-muted-foreground text-sm">
            {totalPosts} results
          </span>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
