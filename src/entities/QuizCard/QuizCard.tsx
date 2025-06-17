"use client";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

interface QuizCardProps {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
}

export default function QuizCard({
  id,
  title,
  description,
  thumbnail,
}: QuizCardProps) {
  return (
    <Card className="group transition-all duration-300 hover:-translate-y-1 shadow-none border overflow-hidden w-full max-w-sm mx-auto">
      <div className="relative w-full aspect-[2/1] sm:aspect-[3/2] lg:aspect-[2/1]">
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <CardHeader className="pb-3 px-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg font-bold line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
        <CardDescription className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-3">
          {description}
        </CardDescription>
        <Button asChild className="w-full text-sm sm:text-base">
          <Link href={`/quiz/${id}`}>
            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            시작하기
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}