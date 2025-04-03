"use client"
import React from "react";
import Link from "next/link";
import "@/app/(dashboard)/mycourses/CurrentCourses.css";

const CurrentCourses = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>수강 강좌</h1>
      <p>현재 수강 중인 강좌 리스트입니다.</p>

      {/* 수강 중인 강좌 리스트 카드들 */}
      <div className="course-card">
        <div className="course-header">
          <span className="course-type">MOOC</span>
          <span className="course-status">진행 중</span>
        </div>
        <h3>2025학년도 동물보호법, 확장용</h3>
        <p>강의자: 이수민</p>
        <Link href="/mycourses/mycourses-view">
          <span className="view-details">상세보기</span> {/* <a> 제거 */}
        </Link>
      </div>

      <div className="course-card">
        <div className="course-header">
          <span className="course-type">MOOC</span>
          <span className="course-status">진행 중</span>
        </div>
        <h3>2025학년도 비상경계 심플 안전교육</h3>
        <p>강의자: 박은정</p>
        <Link href="/src/app/(dashboard)/mycourses/mycourses-submit">
          <span className="view-details">상세보기</span> {/* <a> 제거 */}
        </Link>
      </div>

      <div className="course-card">
        <div className="course-header">
          <span className="course-type">MOOC</span>
          <span className="course-status">진행 중</span>
        </div>
        <h3>2025학년도 스마트 자율 운영 교육</h3>
        <p>강의자: 김영호</p>
        <Link href="/pages/course/3">
          <span className="view-details">상세보기</span> {/* <a> 제거 */}
        </Link>
      </div>

      {/* 다른 강좌들 추가 가능 */}
    </div>
  );
};

export default CurrentCourses;
