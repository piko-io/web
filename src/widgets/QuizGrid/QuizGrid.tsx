"use client";

import QuizCard from "@/entities/QuizCard/QuizCard";

interface Quiz {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  difficulty?: string;
}

interface QuizGridProps {
  quizzes: Quiz[];
}

export default function QuizGrid(props: QuizGridProps) {
  const { quizzes } = props;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          id={quiz.id}
          title={quiz.title}
          description={quiz.description}
          thumbnail={quiz.thumbnail}
          difficulty={quiz.difficulty}
        />
      ))}
    </div>
  );
}
