"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export default function MyBoardsPage() {
  const [boards, setBoards] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("myBoards") || "[]";
    const parsed = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
    setBoards(parsed);
  }, []);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">내 보드</h1>
        <Button asChild variant="outline">
          <Link href="/">홈으로</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        {boards.map((b) => (
          <Link
            key={b.id}
            href={`/create-board/${b.id}/create-quiz`}
            className="w-60 group transition-all duration-300 hover:-translate-y-1"
          >
            <Card className="shadow-none border overflow-hidden">
              <div className="relative">
                <Image
                  src={b.thumbnail}
                  alt={b.title || "Untitled"}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover transition-transform duration-300"
                />
              </div>

              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  {b.title || "Untitled"}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription className="text-sm text-gray-600 mb-2">
                  {b.description || "No description"}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
