"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";

export default function Header() {
  const { isLoggedIn } = useAuth();

  return (
    <header className="w-full flex justify-between items-center p-4 bg-white shadow">
      <div className="text-2xl font-bold">📷 로고</div>

      <div className="space-x-2">
        <Button variant="outline">공지사항</Button>

        {/* ✅ SSR-safe: useAuth가 false라면 로그인으로 */}
        <Button asChild>
          <Link href={isLoggedIn ? "/create-quiz" : "/login"}>
            {isLoggedIn ? "퀴즈 만들기" : "로그인"}
          </Link>
        </Button>
      </div>
    </header>
  );
}
