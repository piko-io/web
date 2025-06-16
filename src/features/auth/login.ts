import api from "@/shared/api/client";

export async function login(username: string, password: string) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
  });
  return data; 
}
