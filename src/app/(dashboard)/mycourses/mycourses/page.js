"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "@/app/(dashboard)/mycourses/CurrentCourses.css";

const CurrentCourses = () => {
  const [userInfo, setUserInfo] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return; // 서버 사이드에서 실행되면 무시

    const raw = localStorage.getItem("jwt");
    let token = null;

    try {
      token = raw ;

    } catch (e) {
      console.error("❌ JWT 파싱 오류:", e);
      alert("토큰 파싱 오류");
      location.href = "/login";
      return;
    }

    if (!token) {
      alert("로그인이 필요합니다.");
      location.href = "/login";
      return;
    }

    fetch("http://localhost:8080/api/mycourses/mycourses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("인증 실패");
        return res.json();
      })
      .then((data) => {
        console.log("📦 수신된 강의 목록:", data);
        setUserInfo(data);
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ 수강 목록 조회 실패:", err);
        alert("세션이 만료되었거나 인증이 필요합니다.");
        location.href = "/login";
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>수강 강좌</h1>
      <p>현재 수강 중인 강좌 리스트입니다.</p>

      {courses.map((course) => (
        <div key={course.lectureId} className="course-card">
          <div className="course-header">
            <span className="course-type">MOOC</span>
            <span className="course-status">진행 중</span>
          </div>
          <h3>{course.subjectName}</h3>
          <p>학과: {course.department}</p>

          {course.watched && (
            <p className="watched-check">✔ 시청 완료</p>
          )}

          <Link href={`/mycourses/mycourses/${course.lectureId}/weeks`}>
            <span className="view-details">상세보기</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CurrentCourses;
