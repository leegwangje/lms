"use client";

import { useEffect, useState } from "react";
import { FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa";
import Link from "next/link";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // ✅ 토큰 검사 + 유저 정보 파싱
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.sub); // 사용자 ID
        setIsLoggedIn(true);
      } catch (e) {
        console.error("토큰 파싱 실패:", e);
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
      }
    }
  }, []);

  // ✅ 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setUsername("");
    location.href = "/login";
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link href="/mycourses/mycourses" passHref>
          <img src="/image/logo.png" alt="My Dashboard" className="logo" />
        </Link>
      </div>
      <div className="header-right">
        <FaBell className="icon" />
        <FaEnvelope className="icon" />
        <FaUserCircle className="icon" />

        {isLoggedIn ? (
          <>
            <span className="username">{username}님</span>
            <button onClick={handleLogout} className="login-btn">
              로그아웃
            </button>
          </>
        ) : (
          <Link href="/login" passHref>
            <button className="login-btn">로그인</button>
          </Link>
        )}
      </div>
    </header>
  );
}
