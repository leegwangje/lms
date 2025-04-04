"use client";
import React from "react";
import Link from "next/link";
import "@/app/(dashboard)/mycourses/CurrentCourses.css";

const CurrentCourses = () => {
  const courses = [
    {
      id: 1,
      title: "2025학년도 동물보호법, 확장용",
      instructor: "이수민",
      watched: true,
      href: "/mycourses/mycourses-view"
    },
    {
      id: 2,
      title: "2025학년도 비상경계 심플 안전교육",
      instructor: "박은정",
      watched: false,
      href: "/src/app/(dashboard)/mycourses/mycourses-submit"
    },
    {
      id: 3,
      title: "2025학년도 스마트 자율 운영 교육",
      instructor: "김영호",
      watched: true,
      href: "/pages/course/3"
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>수강 강좌</h1>
      <p>현재 수강 중인 강좌 리스트입니다.</p>

      {courses.map((course) => (
        <div key={course.id} className="course-card">
          <div className="course-header">
            <span className="course-type">MOOC</span>
            <span className="course-status">진행 중</span>
          </div>
          <h3>{course.title}</h3>
          <p>강의자: {course.instructor}</p>

          {/* ✅ 시청 완료한 경우에만 표시 */}
          {course.watched && (
            <p className="watched-check">✔ 시청 완료</p>
          )}

          <Link href={course.href}>
            <span className="view-details">상세보기</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CurrentCourses;
