"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";

export default function Header() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="w-full flex justify-between items-center p-4 bg-white shadow">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Image 
          src="/assets/icons/piko-logo.svg" 
          alt="Piko Logo" 
          width={73} 
          height={31}
        />
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
        {isLoggedIn ? (
          <>
            <Button asChild>
              <Link href="/create-board">퀴즈 만들기</Link>
            </Button>
            <Button onClick={handleLogout} variant="outline">
              로그아웃
            </Button>
          </>
        ) : (
          <Button asChild>
            <Link href="/login">로그인</Link>
          </Button>
        )}
      </div>
    </header>
  );
}