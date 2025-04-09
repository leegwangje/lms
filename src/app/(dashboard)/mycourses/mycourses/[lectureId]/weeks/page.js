"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaUpload } from "react-icons/fa";
import YouTube from "react-youtube";
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

        // ✅ 각 주차 콘텐츠 불러오기
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

    // ✅ 과제 목록 불러오기
    fetch(`http://localhost:8080/api/mycourses/${lectureId}/assignmnets`)
      .then((res) => res.json())
      .then((data) => setAssignments(data));
  }, [lectureId]);

  // ✅ 출석 체크
  const handleWatchProgress = (e, content) => {
    if (e.data === 1) { // PLAYING
      const duration = e.target.getDuration();
      let watched = 0;
      let marked = false;

      const interval = setInterval(() => {
        watched += 1;
        const ratio = watched / duration;

        if (ratio >= 0.8 && !marked) {
          marked = true;
          console.log("📡 출석 처리!");

          fetch("http://localhost:8080/api/attendance", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              lectureId,
              contentId: content.lectureManagementId,
              stdtId: 20250001, // 로그인 된 유저 ID로 추후 교체
            }),
          });
        }

        if (e.target.getPlayerState() !== 1) { // 재생 중이 아니면 종료
          clearInterval(interval);
        }
      }, 1000);
    }
  };

  return (
    <div className="course-detail-container">
      <h1>강좌 상세보기</h1>
      <h2>주차별 학습 활동</h2>

      {weeks.map((week, index) => (
        <div key={week.weekId} className="week-section">
          <h3>{index + 1}주차</h3>

          {/* 🎥 동영상 */}
          <div>
            <h4>동영상</h4>
            {contents[week.weekId]?.map((c, idx) => (
              c.youtubeVideoId && (
                <div key={idx} style={{ marginBottom: "20px" }}>
                  <h5>{c.chapterName}</h5>
                  <YouTube
                    videoId={c.youtubeVideoId}
                    id={`player-${week.weekId}-${idx}`}
                    opts={{
                      width: "560",
                      height: "315",
                      playerVars: { autoplay: 0 },
                    }}
                    onReady={() => console.log(`🎬 ${c.chapterName} 준비 완료`)}
                    onStateChange={(e) => handleWatchProgress(e, c)}
                  />
                </div>
              )
            ))}
          </div>

          {/* 📝 과제 제출 */}
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
                {c.fileName ? (
                  <a
                    href={`http://localhost/cdn/${c.fileName}`}
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
