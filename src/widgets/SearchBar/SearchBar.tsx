"use client";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex items-center justify-center p-4 gap-2">
      <Input placeholder="검색어를 입력하세요." className="max-w-lg w-full" />
      <Button size="icon">
          <Search className="w-5 h-5" />
      </Button>
    </div>
  );
}
