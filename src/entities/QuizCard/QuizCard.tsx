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
    <Card className="group transition-all duration-300 hover:-translate-y-1 shadow-none border overflow-hidden w-100 max-w-sm">
      <div className="relative w-full aspect-[2/1]">
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="320px"
          className="object-cover"
        />
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-3">
          {description}
        </CardDescription>
        <Button asChild className="w-full">
          <Link href={`/quiz/${id}`}>
            <Play className="w-4 h-4 mr-2" />
            시작하기
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}