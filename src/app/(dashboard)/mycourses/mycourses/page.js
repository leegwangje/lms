"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "@/app/(dashboard)/mycourses/CurrentCourses.css";

const CurrentCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const stdtId = 20250001;
    fetch(`http://localhost:8080/api/mycourses/mycourses?stdtId=${stdtId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 수신된 강의 목록:", data);
        setCourses(data);
      });
  }, []);

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
