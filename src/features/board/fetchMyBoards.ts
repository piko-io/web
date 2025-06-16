import api from "@/shared/api/client";

export async function fetchMyBoards() {
  const { data } = await api.get("/board/mine");
  return data.data;
}
