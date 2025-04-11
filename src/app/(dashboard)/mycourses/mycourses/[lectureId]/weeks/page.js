"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaUpload } from "react-icons/fa";
import YouTube from "react-youtube";
import "@/app/(dashboard)/mycourses/mycourses-view.css";

const CourseDetail = () => {
  const { lectureId } = useParams();

  const [token, setToken] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [contents, setContents] = useState({});
  const [assignments, setAssignments] = useState([]);

  // ✅ 토큰 꺼내기
  useEffect(() => {
    const accessToken = localStorage.getItem("jwt");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      location.href = "/login";
      return;
    }
    setToken(accessToken);
  }, []);

  // ✅ 데이터 불러오기
  useEffect(() => {
    if (!token || !lectureId) return;

    fetch(`http://localhost:8080/api/mycourses/${lectureId}/weeks`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setWeeks(data);

        data.forEach((week) => {
          fetch(
            `http://localhost:8080/api/mycourses/${lectureId}/week/${week.weekNumber}/contents`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((res) => res.json())
            .then((contentList) => {
              setContents((prev) => ({
                ...prev,
                [week.weekNumber]: contentList,
              }));
            });
        });
      });

    fetch(`http://localhost:8080/api/mycourses/${lectureId}/assignments`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAssignments(data));
  }, [token, lectureId]);

  // ✅ 출석 체크
  const handleWatchProgress = (e, content) => {
    if (e.data === 1 && token) {
      const duration = e.target.getDuration();
      let watched = 0;
      let marked = false;

      const interval = setInterval(() => {
        watched += 1;
        const ratio = watched / duration;

        if (ratio >= 0.8 && !marked) {
          marked = true;
          console.log("📡 출석 처리!");

          fetch("http://localhost:8080/api/attendance/video", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              lectureId,
              contentId: content.lectureManagementId,
            }),
          });
        }

        if (e.target.getPlayerState() !== 1 || marked) {
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
        <div key={`${week.weekNumber}`} className="week-section">
          <h3>{index + 1}주차</h3>

          {/* 🎥 동영상 */}
          <div>
            <h4>동영상</h4>
            {contents[week.weekNumber]?.map(
              (c, idx) =>
                c.youtubeVideoId && (
                  <div
                    key={`video-${week.weekNumber}-${idx}`}
                    style={{ marginBottom: "20px" }}
                  >
                    <h5>{c.chapterName}</h5>
                    <YouTube
                      videoId={c.youtubeVideoId}
                      id={`player-${week.weekNumber}-${idx}`}
                      opts={{
                        width: "560",
                        height: "315",
                        playerVars: { autoplay: 0 },
                      }}
                      onReady={() =>
                        console.log(`🎬 ${c.chapterName} 준비 완료`)
                      }
                      onStateChange={(e) => handleWatchProgress(e, c)}
                    />
                  </div>
                )
            )}
          </div>

          {/* 📝 과제 제출 */}
          <div>
            <h4>과제 제출</h4>
            <Link
              href={`/mycourses/mycourses/${lectureId}/weeks/${week.weekNumber}/submit`}
            >
              <button className="submit-assignment-btn">
                <FaUpload /> {index + 1}주차 과제 제출
              </button>
            </Link>
          </div>

          {/* 📚 학습 자료 */}
          <h4>학습 자료</h4>
          <ul>
            {contents[week.weekNumber]?.map((c, idx) => (
              <li key={`file-${week.weekNumber}-${idx}`} className="activity-item">
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
