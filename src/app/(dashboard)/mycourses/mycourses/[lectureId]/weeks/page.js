"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaUpload } from "react-icons/fa";
import YouTube from "react-youtube";
import "@/app/(dashboard)/mycourses/mycourses-view.css";

const CourseDetail = () => {
  const [userInfo, setUserInfo] = useState({});
  const { lectureId } = useParams();
  const [weeks, setWeeks] = useState([]);
  const [contents, setContents] = useState({});
  const [assignments, setAssignments] = useState([]);


  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ 토큰 꺼내기
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

    // ✅ 주차 목록 가져오기
    fetch(`http://localhost:8080/api/mycourses/${lectureId}/weeks`, {
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
        setWeeks(data);



        // ✅ 주차별 콘텐츠 가져오기
        data.forEach((week) => {
          fetch(`http://localhost:8080/api/mycourses/${lectureId}/week/${week.weekNumber}/contents`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((contentList) => {
              setContents((prev) => ({
                ...prev,
                [week.weekNumber]: contentList,
              }));
            });
        });
      });

    // ✅ 과제 목록 가져오기
    fetch(`http://localhost:8080/api/mycourses/${lectureId}/assignments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAssignments(data));
  }, [lectureId]);

  // ✅ 출석 체크
  const handleWatchProgress = (e, content) => {
    if (e.data === 1) {
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
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              lectureId,
              contentId: content.lectureManagementId,
              stdtId: 20250001, // 추후 JWT에서 파싱하여 넣도록 변경 가능
            }),
          });
        }

        if (e.target.getPlayerState() !== 1) {
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
            {contents[week.weekNumber]?.map((c, idx) => (
              c.youtubeVideoId && (
                <div key={`video-${week.weekNumber}-${idx}`} style={{ marginBottom: "20px" }}>
                  <h5>{c.chapterName}</h5>
                  <YouTube
                    videoId={c.youtubeVideoId}
                    id={`player-${week.weekNumber}-${idx}`}
                    opts={{ width: "560", height: "315", playerVars: { autoplay: 0 } }}
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
            <Link href={`/mycourses/mycourses/${lectureId}/weeks/${week.weekNumber}/submit`}>
              <button className="submit-assignment-btn">
                <FaUpload /> {index + 1}주차 과제 제출
              </button>
            </Link>
          </div>

          {/* 📚 학습자료 */}
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
