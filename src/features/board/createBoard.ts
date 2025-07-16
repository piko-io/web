import api from "@/shared/api/client";

export async function createBoard({
  title,
  description,
  difficulty,
  file,
}: {
  title: string;
  description: string;
  difficulty: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", description);
  formData.append("difficulty", difficulty);
  formData.append("file", file);
  
  console.log('=== 보드 생성 요청 데이터 ===');
  console.log('title:', title);
  console.log('content:', description);
  console.log('difficulty:', difficulty);
  console.log('file:', file.name, file.size, 'bytes');
  
  const response = await api.post("/board", formData);
  
  console.log('=== 보드 생성 응답 ===');
  console.log('Response:', response.data);
  
  return response.data.data;
}