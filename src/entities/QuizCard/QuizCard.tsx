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
    <Card className="group transition-all duration-300 hover:-translate-y-1 shadow-none border overflow-hidden">
      <div className="relative">
        <Image
          src={thumbnail}
          alt={title}
          width={400}
          height={200}
          className="w-full h-48 object-cover transition-transform duration-300"
        />
      </div>

      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription className="text-sm text-gray-600 mb-4">
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
