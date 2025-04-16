"use client";

import { useEffect, useState } from "react";
import { FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import HeaderTimer from "@/components/courses/HeaderTimer"; // ✅ 추가!

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.sub);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("토큰 파싱 실패:", e);
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setUsername("");
    location.href = "/login";
  };

  return (
    <header className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
      <div className="header-left">
        <Link href="/mycourses/mycourses" passHref>
          <img src="/image/logo.png" alt="My Dashboard" className="logo" />
        </Link>
      </div>

      <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <HeaderTimer /> {/* ✅ 여기에 붙이면 오른쪽에 뜸 */}

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
