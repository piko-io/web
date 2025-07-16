"use client";
import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
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
  difficulty?: string;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-800";
    case "NORMAL":
      return "bg-yellow-100 text-yellow-800";
    case "HARD":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "쉬움";
    case "NORMAL":
      return "보통";
    case "HARD":
      return "어려움";
    default:
      return "알 수 없음";
  }
};

export default function QuizCard({
  id,
  title,
  description,
  thumbnail,
  difficulty = "EASY",
}: QuizCardProps) {
  return (
    <Card className="group transition-all duration-300 hover:-translate-y-1 shadow-none border overflow-hidden w-full max-w-sm mx-auto flex flex-col h-full p-0">
      <div className="relative w-full h-full aspect-[5/3] sm:aspect-[4/3] lg:aspect-[5/3] overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover object-center rounded-t-lg"
        />
      </div>
      <CardHeader className="px-4 sm:px-6 pt-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-lg font-bold line-clamp-2 flex-1">{title}</CardTitle>
          <Badge className={`text-xs flex-shrink-0 ${getDifficultyColor(difficulty)}`}>
            {getDifficultyText(difficulty)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6 flex flex-col flex-grow">
        <CardDescription className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 flex-grow">
          {description}
        </CardDescription>
        <Button asChild className="w-full text-sm sm:text-base mt-auto">
          <Link href={`/quiz/${id}`}>
            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            시작하기
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}