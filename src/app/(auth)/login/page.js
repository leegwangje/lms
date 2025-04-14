"use client";

import React, { useState } from "react";
import "@/app/(auth)/login/Login.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  // 로그인 로딩 상태 관리
  const [error, setError] = useState("");  // 로그인 오류 메시지 관리
  const router = useRouter();

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("로그인 실패");

      const token = await response.json();
      localStorage.setItem("jwt", token.accessToken);

      // ✅ JWT 디코딩하여 역할 확인
      const payload = JSON.parse(atob(token.accessToken.split(".")[1]));
      const userRole = payload.role;

      alert("로그인 성공!");

      // ✅ 역할별 리디렉션
      if (userRole === "PROFESSOR") {
        window.location.href = "/prof/myLecture";
      } else {
        window.location.href = "/mycourses/mycourses";
      }
    } catch (err) {
      console.error("❌ 로그인 오류:", err);
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 수업 정보를 가져오는 함수
  const fetchCourses = async () => {
    const raw = localStorage.getItem("jwt");
    const token = raw ? JSON.parse(raw).accessToken : null;


    if (!token) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/mycourses", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // 받은 데이터 처리
      } else {
        throw new Error("수업 정보를 불러오는 데 실패했습니다.");
      }
    } catch (err) {
      console.error("❌ API 요청 오류:", err);
      alert("API 요청 오류");
    }
  };

  const loginImage = "/image/back.png";
  const logoImage = "/image/logo.png";

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logoImage} alt="Logo" className="logo" />
        <h1>로그인 화면</h1>

        {/* 로그인 오류 메시지 */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="username">사용자 아이디</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <Link href="/forgot-password" className="forgot-password">
          비밀번호를 잊으셨나요?
        </Link>
      </div>
      <div
        className="login-right"
        style={{ backgroundImage: `url(${loginImage})` }}
      ></div>
    </div>
  );
};

export default Login;
