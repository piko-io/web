"use client";

import { useEffect, useState } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 클라이언트에서만 localStorage 사용!
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return { isLoggedIn };
}
