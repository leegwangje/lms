"use client";

import React, { useState, useEffect } from "react";
import "@/app/(dashboard)/mycourses/Attendance.css";

const Attendance = () => {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  // ✅ 출석 정보 불러오기
  useEffect(() => {
    fetch("http://localhost:8080/api/attendance/status/20250001")
      .then((res) => res.json())
      .then((data) => {
        setAttendanceData(data);
      })
      .catch((err) => {
        console.error("출석 정보 불러오기 실패:", err);
      });
  }, []);

  const selectedCourse = attendanceData.find(
    (c) => c.lectureId === selectedCourseId
  );

  return (
    <div className="attendance-wrapper">
      {/* 왼쪽: 강의 리스트 */}
      <div className="attendance-container">
        <h1>출석률 확인</h1>
        <p>나의 수강 강의 출석률 현황입니다.</p>

        {attendanceData.map((course) => (
          <div
            key={course.lectureId}
            className={`attendance-card ${
              selectedCourseId === course.lectureId ? "selected" : ""
            }`}
            onClick={() => setSelectedCourseId(course.lectureId)}
          >
            <h3 className="clickable">{course.courseName}</h3>
            <p>강의자: {course.instructor}</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${course.attendanceRate}%` }}
              >
                {course.attendanceRate}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽: 주차별 출석 상세 (항상 존재) */}
      <div className="weekly-view">
        {selectedCourse ? (
          <>
            <h2>{selectedCourse.courseName} - 주차별 출석</h2>
            <ul>
              {selectedCourse.weeklyStatus.map((week, idx) => (
                <li key={idx}>
                  {week.weekTitle
                    ? `${idx + 1}주차 - ${week.weekTitle}`
                    : `${idx + 1}주차`}
                  {" "}
                  <span
                    className={week.status === "출석" ? "present" : "absent"}
                  >
                    {week.status}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="empty-text">
            강좌를 선택하면 주차별 출석현황이 표시됩니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default Attendance;
