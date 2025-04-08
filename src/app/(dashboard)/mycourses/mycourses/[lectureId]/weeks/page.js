"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaPlay, FaUpload } from "react-icons/fa";
import "@/app/(dashboard)/mycourses/mycourses-view.css";

const CourseDetail = () => {
  const { lectureId } = useParams();

  const [weeks, setWeeks] = useState([]);
  const [contents, setContents] = useState({});
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // ✅ 주차 불러오기
    fetch(`http://localhost:8080/api/mycourses/${lectureId}/weeks`)
      .then((res) => res.json())
      .then((data) => {
        setWeeks(data);

        // ✅ 각 주차별 콘텐츠 미리 불러오기
        data.forEach((week) => {
          fetch(`http://localhost:8080/api/mycourses/weeks/${week.weekId}/contents`)
            .then((res) => res.json())
            .then((contentList) => {
              setContents((prev) => ({
                ...prev,
                [week.weekId]: contentList,
              }));
            });
        });
      });

    // ✅ 과제 불러오기
    fetch(`http://localhost:8080/api/mycourses/${lectureId}/assignmnets`)
      .then((res) => res.json())
      .then((data) => setAssignments(data));
  }, [lectureId]);

  return (
    <div className="course-detail-container">
      <h1>강좌 상세보기</h1>
      <h2>주차별 학습 활동</h2>

      {weeks.map((week, index) => (
        <div key={week.weekId} className="week-section">
          <h3>{index + 1}주차</h3>

          {/* 🎥 콘텐츠 */}
          <div>
            <h4>동영상</h4>
            {contents[week.weekId]?.map((c, idx) => (
              <div key={idx}>
                <a href={`https://youtube.com/watch?v=${c.youtubeVideoId}`} target="_blank" rel="noopener noreferrer">
                  <button className="view-video-btn">
                    <FaPlay /> {c.chapterName}
                  </button>
                </a>
              </div>
            ))}
          </div>

          <div>
            <h4>과제 제출</h4>
            <Link href={`/mycourses/mycourses/${lectureId}/weeks/${week.weekId}/submit`}>
              <button className="submit-assignment-btn">
                <FaUpload /> {index + 1}주차 과제 제출
              </button>
            </Link>
          </div>

          {/* 📚 학습자료 */}
          <h4>학습 자료</h4>
          <ul>
            {contents[week.weekId]?.map((c, idx) => (
              <li key={idx} className="activity-item">
                {c.fileId && c.fileName ? (
                  <a
                    href={`http://localhost:8080/api/files/download/${c.fileId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="activity-link"
                  >
                    {c.fileName}
                  </a>
                ) : (
                  <span className="activity-link">자료 없음</span>
                )}
              </li>
            ))}
          </ul>

        </div>
      ))}
    </div>
  );
};

export default CourseDetail;
