"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { Trash2, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { fetchMyBoards } from "@/features/board/fetchMyBoards";
import { deleteBoard } from "@/shared/api/deleteBoard";
import EditBoardForm from "@/widgets/EditBoardForm/index";

export default function MyBoardsPage() {
  const [boards, setBoards] = useState<any[]>([]);
  const [editingBoard, setEditingBoard] = useState<any>(null);

  useEffect(() => {
    async function loadBoards() {
      try {
        const boards = await fetchMyBoards();
        setBoards(boards);
      } catch (err) {
        console.error(err);
        setBoards([]);
      }
    }
    loadBoards();
  }, []);

  const handleDeleteBoard = async (boardId: string, boardTitle: string) => {
    if (!confirm(`"${boardTitle}" 보드를 정말 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteBoard(boardId);
      setBoards(prev => prev.filter(board => board.id !== boardId));
      alert('보드가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('보드 삭제 실패:', error);
      alert('보드 삭제에 실패했습니다.');
    }
  };

  const handleEditBoard = (board: any) => {
    setEditingBoard(board);
  };

  const handleEditSuccess = (updatedBoard: any) => {
    setBoards(prev => prev.map(board => 
      board.id === updatedBoard.id ? updatedBoard : board
    ));
    setEditingBoard(null);
  };

  const handleEditCancel = () => {
    setEditingBoard(null);
  };

  if (editingBoard) {
    return (
      <EditBoardForm
        board={editingBoard}
        onCancel={handleEditCancel}
        onSuccess={handleEditSuccess}
      />
    );
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">내 보드</h1>
        <Button asChild variant="outline">
          <Link href="/">홈으로</Link>
        </Button>
      </div>
      <div className="flex flex-wrap gap-4">
        {boards.map((b) => {
          const boardTitle =
            b.title && b.title.trim().length > 0 ? b.title : "제목이 없는 보드";
          const boardDescription =
            b.description && b.description.trim().length > 0
              ? b.description
              : "설명이 등록되지 않았습니다.";
          const thumbnailSrc =
            b.thumbnail && b.thumbnail.path
              ? `https://s3.alpa.dev/piko/${b.thumbnail.path}`
              : "/placeholder.png";

          return (
            <div key={b.id} className="relative w-60 group transition-all duration-300 hover:-translate-y-1">
              <Link href={`/create-board/${b.id}/create-quiz`}>
                <Card className="shadow-none border overflow-hidden">
                  <div className="relative">
                    <Image
                      src={thumbnailSrc}
                      alt={`${boardTitle}의 대표 이미지`}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">
                      {boardTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600 mb-2">
                      {boardDescription}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
              
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 bg-white"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditBoard(b);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteBoard(b.id, boardTitle);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}