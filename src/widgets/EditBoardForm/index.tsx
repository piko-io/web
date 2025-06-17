"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { updateBoard } from "@/shared/api/updateBoard";
import { updateBoardThumbnail } from "@/shared/api/updateBoardThumbnail";

interface EditBoardFormProps {
  board: {
    id: string;
    title: string;
    description: string;
    thumbnail?: {
      path: string;
    };
  };
  onCancel: () => void;
  onSuccess: (updatedBoard: any) => void;
}

export default function EditBoardForm({ board, onCancel, onSuccess }: EditBoardFormProps) {
  const [title, setTitle] = useState(board.title || "");
  const [description, setDescription] = useState(board.description || "");
  const [preview, setPreview] = useState<string | null>(
    board.thumbnail?.path ? `https://s3.alpa.dev/piko/${board.thumbnail.path}` : null
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setFile(null);
      setPreview(
        board.thumbnail?.path ? `https://s3.alpa.dev/piko/${board.thumbnail.path}` : null
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateBoard(board.id, {
        title,
        description
      });

      // 2. 썸네일이 변경된 경우 썸네일 업데이트
      if (file) {
        await updateBoardThumbnail(board.id, file);
      }

      // 3. 성공 시 업데이트된 보드 정보 전달
      const updatedBoard = {
        ...board,
        title,
        description,
        thumbnail: file ? { path: preview } : board.thumbnail
      };

      onSuccess(updatedBoard);
      alert('보드가 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('보드 수정 실패:', error);
      alert('보드 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-6 bg-card rounded-xl shadow flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold">보드 수정</h1>
        
        <div className="flex flex-col gap-1">
          <label className="font-medium">제목</label>
          <Input
            placeholder="제목 입력"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium">설명</label>
          <textarea
            placeholder="설명 입력"
            className="border border-input rounded w-full p-3 focus:outline-none focus:ring-2"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">썸네일</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/20"
          >
            {preview ? (
              <img
                src={preview}
                alt="썸네일"
                className="mx-auto max-h-48 rounded"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">+</span>
                <span className="text-sm">썸네일을 추가해보세요.</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="hidden"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
            disabled={loading}
          >
            취소
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            disabled={loading}
          >
            {loading ? "수정 중..." : "수정 완료"}
          </Button>
        </div>
      </form>
    </main>
  );
}