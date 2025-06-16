import api from "@/shared/api/client";

export async function createBoard({
  title,
  description,
  file,
}: {
  title: string;
  description: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "body",
    JSON.stringify({
      title,
      content: description,
    }),
  );

  const response = await api.post("/board", formData);
  return response.data.data; 
}
