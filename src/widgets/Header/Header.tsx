"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";

export default function Header() {
  const { isLoggedIn } = useAuth();

  return (
    <header className="w-full flex justify-between items-center p-4 bg-white shadow">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Camera className="w-6 h-6" />
        <span>piko</span>
      </div>

      <div className="space-x-2">
        <Button asChild variant="outline">
          <Link href="/notice">공지사항</Link>
        </Button>

        {isLoggedIn && (
          <Button asChild variant="outline">
            <Link href="/my-boards">내 퀴즈</Link>
          </Button>
        )}

        <Button asChild>
          <Link href={isLoggedIn ? "/create-board" : "/login"}>
            {isLoggedIn ? "퀴즈 만들기" : "로그인"}
          </Link>
        </Button>
      </div>
    </header>
  );
}
