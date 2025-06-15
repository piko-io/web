"use client";

import Link from "next/link";
import { Megaphone, Info } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function NoticePage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto py-12 px-4">
      <h1 className="flex items-center text-3xl font-bold mb-6 gap-2">
        <Megaphone className="w-8 h-8 text-primary" />
        공지사항
      </h1>

      <article className="space-y-4">
        <section className="p-4 border rounded flex items-start gap-3">
          <Info className="w-6 h-6 mt-1" />
          <div>
            <h2 className="text-xl font-semibold">공지사항 1</h2>
            <p className="text-gray-700">
              앙 기모띠
            </p>
          </div>
        </section>

        <section className="p-4 border rounded flex items-start gap-3">
          <Info className="w-6 h-6 mt-1" />
          <div>
            <h2 className="text-xl font-semibold">공지사항 2</h2>
            <p className="text-gray-700">
              ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ
            </p>
          </div>
        </section>
      </article>

      <div className="mt-8">
        <Button asChild>
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    </main>
  );
}
