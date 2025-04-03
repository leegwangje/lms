"use client"
import { FaBell, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import Link from 'next/link'; // Link 임포트
import { useState } from 'react'; // useState 임포트

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn); // 로그인 상태 토글
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* 이미지로 대체 */}
        <Link href="/" passHref>
          <img src="/image/logo.png" alt="My Dashboard" className="logo" />
        </Link>
      </div>
      <div className="header-right">
        <FaBell className="icon" />
        <FaEnvelope className="icon" />
        <FaUserCircle className="icon" />

        {/* 로그인 상태에 따라 버튼 변경 */}
        {isLoggedIn ? (
          <button onClick={handleLoginLogout} className="login-btn">로그아웃</button>
        ) : (
          <Link href="/login" passHref>
            <button className="login-btn">로그인</button>
          </Link>
        )}
      </div>
    </header>
  );
}
