"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";

export default function QuizDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const quizTitle = "이탈리안 브레인롯 캐릭터 맞추기";
  const quizDescription = "*캐릭터의 이름은 나무위키를 기준으로 합니다";
  const quizThumbnail = "/thumbnails/poketmon.png";

  const handlePlay = () => {
    router.push(`/quiz/${id}/play`);
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-8 p-8 bg-background">
      <Image
        src={quizThumbnail}
        alt={quizTitle}
        width={400}
        height={400}
        className="rounded-lg"
      />

      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>{quizTitle}</CardTitle>
          <CardDescription>{quizDescription}</CardDescription>
        </CardHeader>
      </Card>

      <Button size="lg" onClick={handlePlay}>
        퀴즈 풀러가기
      </Button>
    </main>
  );
}
