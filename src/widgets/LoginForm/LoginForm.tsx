"use client";

import { useState } from "react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", { email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-sm p-6 flex flex-col gap-4 border rounded-lg shadow-sm"
    >
      <h1 className="text-2xl font-bold text-center">로그인</h1>

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
      />

      <Input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
      />

      <Button type="submit" className="w-full">
        로그인
      </Button>
    </form>
  );
}
