"use client";

import QuizCard from "@/entities/QuizCard/QuizCard";

const sampleData = [
    {
        id:1,
        title: "국기 보고 나라 맞추기",
        description: "국기를 보고 어느 나라 국기인지 맞추는 퀴즈입니다",
        thumbnail: "https://via.placeholder.com/300x200",
      },
      {
        id:2,
        title: "2024년 밈 맞추기",
        description: "강 재미로들 하세요",
        thumbnail: "https://via.placeholder.com/300x200",
      },
      {
        id:3,
        title: "국기 보고 나라 맞추기",
        description: "국기를 보고 어느 나라 국기인지 맞추는 퀴즈입니다",
        thumbnail: "https://via.placeholder.com/300x200",
      },
      {
        id:4,
        title: "2024년 밈 맞추기",
        description: "강 재미로들 하세요",
        thumbnail: "https://via.placeholder.com/300x200",
      },
      {
        id:5,
        title: "국기 보고 나라 맞추기",
        description: "국기를 보고 어느 나라 국기인지 맞추는 퀴즈입니다",
        thumbnail: "https://via.placeholder.com/300x200",
      },
      {
        id:6,
        title: "2024년 밈 맞추기",
        description: "강 재미로들 하세요",
        thumbnail: "https://via.placeholder.com/300x200",
      },
      {
        id:7,
        title: "국기 보고 나라 맞추기",
        description: "국기를 보고 어느 나라 국기인지 맞추는 퀴즈입니다",
        thumbnail: "https://via.placeholder.com/300x200",
      },
      {
        id:8,
        title: "2024년 밈 맞추기",
        description: "강 재미로들 하세요",
        thumbnail: "https://via.placeholder.com/300x200",
      },
      {
        id:9,
        title: "국기 보고 나라 맞추기",
        description: "국기를 보고 어느 나라 국기인지 맞추는 퀴즈입니다",
        thumbnail: "https://via.placeholder.com/300x200",
      },
      {
        id:10,
        title: "2024년 밈 맞추기",
        description: "강 재미로들 하세요",
        thumbnail: "https://via.placeholder.com/300x200",
      },
];

export default function QuizGrid() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {sampleData.map((quiz) => (
          <QuizCard
            key={quiz.id}
            id={quiz.id}
            title={quiz.title}
            description={quiz.description}
            thumbnail={quiz.thumbnail} 
          />
        ))}
      </div>
    );
  }