"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ 서버 호출 제거! 대신 프론트에서 token 저장
    localStorage.setItem("token", "fake-token");

    // ✅ 홈으로 이동
    router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 flex flex-col gap-4 border rounded-lg shadow-sm"
    >
      <h1 className="text-2xl font-bold text-center">로그인</h1>

      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit">로그인</Button>

      <Button variant="outline" asChild>
        <Link href="/register">회원가입</Link>
      </Button>
    </form>
  );
}
