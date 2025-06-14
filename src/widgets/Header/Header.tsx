"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center p-4 bg-white shadow">
      <div className="text-2xl font-bold">📷 로고</div>
      <div className="space-x-2">
        <Button variant="outline">공지사항</Button>
        <Button asChild>
          <Link href="/login">로그인</Link>
        </Button>
      </div>
    </header>
  );
}
