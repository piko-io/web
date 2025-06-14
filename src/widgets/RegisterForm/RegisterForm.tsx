"use client";

import { useState } from "react";
import { register } from "@/features/auth/register";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, nickname, password);
      alert("회원가입 성공!");
      router.push("/login");
    } catch (err) {
      console.error("회원가입 실패:", err);
      alert("회원가입 실패!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 flex flex-col gap-4 border rounded-lg shadow-sm"
    >
      <h1 className="text-2xl font-bold text-center">회원가입</h1>

      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Input
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit">회원가입</Button>
    </form>
  );
}
