"use client";
import React, { useEffect, useState } from "react";

const HeaderTimer = () => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const rawToken = localStorage.getItem("jwt");
    if (!rawToken) return;

    try {
      const payload = JSON.parse(atob(rawToken.split(".")[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      const remaining = exp - now;

      if (remaining <= 0) {
        handleLogout();
        return;
      }

      setTimeLeft(remaining);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } catch (e) {
      console.error("❌ 토큰 파싱 실패:", e);
      handleLogout();
    }
  }, []);

  const handleLogout = () => {
    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (timeLeft === null) return null;

  // ✅ 남은 시간이 5분 이하이면 빨간색 적용
  const timeColor = timeLeft <= 300 ? "#ff4d4f" : "#333";

  return (
    <div style={{ fontSize: "12px", textAlign: "center", color: "#333" }}>
      <div>남은시간</div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "16px",
          color: timeColor,
        }}
      >
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default HeaderTimer;
