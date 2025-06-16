import api from "@/shared/api/client";

export async function register(
  username: string,
  nickname: string,
  password: string
) {
  const { data } = await api.post("/auth/register", {
    username,
    nickname,
    password,
  });
  return data;
}
