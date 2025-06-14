import api from "@/shared/api/client";

// 실제 서버 연결 준비된 login 함수
export async function login(username: string, password: string) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
  });
  return data; // { token: string }
}
