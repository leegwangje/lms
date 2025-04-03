"use client"
import React, { useState } from "react";
import "@/app/(auth)/login/Login.css";
import Link from 'next/link';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 로직 작성 (예: API 호출)
    alert(`Username: ${username}, Password: ${password}`);
  };

  const loginImage = "/image/back.png"; // 로그인 페이지 배경 이미지 경로 (public 폴더 내)
  const logoImage = "/image/logo.png"; // 로그인 페이지 배경 이미지 경로 (public 폴더 내)

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logoImage} alt="Logo" className="logo" /> {/* 로고 이미지 추가 */}
        <h1>로그인 화면</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="username">사용자 아이디</label>
            <input
              type="text"
              id="username"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <button type="submit" className="login-btn">로그인</button>
        </form>
        <Link href="/forgot-password" className="forgot-password">비밀번호를 잊으셨나요?</Link>
      </div>
      <div className="login-right" style={{ backgroundImage: `url(${loginImage})` }}>
        {/* 오른쪽 배경 이미지 */}
      </div>
    </div>
  );
};

export default Login;
