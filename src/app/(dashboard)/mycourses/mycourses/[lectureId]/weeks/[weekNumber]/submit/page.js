"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaFileUpload } from "react-icons/fa";
import "@/app/(dashboard)/mycourses/Submit.css";

const SubmitAssignment = () => {
  const { lectureId, weekNumber } = useParams();

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [assignment, setAssignment] = useState(null);
  const [token, setToken] = useState(null);

// ✅ 토큰 꺼내기
  useEffect(() => {
    if (typeof window === "undefined") return;

    const accessToken = localStorage.getItem("jwt"); // 👈 그냥 꺼내기 (JSON 파싱 ❌)

    if (!accessToken) {
      console.error("❌ 토큰 없음");
      alert("로그인이 필요합니다.");
      location.href = "/login";
      return;
    }

    setToken(accessToken); // ✅ 상태에 저장
  }, []);

  // ✅ 과제 정보 및 제출 상태 불러오기
  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:8080/api/mycourses/${lectureId}/week/${weekNumber}/assignment`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAssignment(data);

        if (data?.assignmentId) {
          fetch(`http://localhost:8080/api/mycourses/assignments/${data.assignmentId}/submit`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then((submitData) => {
              if (submitData?.submitted) {
                setStatus("제출됨");
              }
            });
        }
      })
      .catch((err) => {
        console.error("❌ 과제 정보 조회 실패:", err);
      });
  }, [lectureId, weekNumber, token]);

  // ✅ 파일 변경 처리
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ✅ 과제 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lectureId", lectureId);
    formData.append("weekNumber", weekNumber);

    try {
      const response = await fetch("http://localhost:8080/api/mycourses/submit", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setStatus("제출됨");
        alert(`${weekNumber}주차 과제가 성공적으로 제출되었습니다.`);
      } else {
        setStatus("제출 실패");
        alert("과제 제출에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 제출 중 오류:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="submit-assignment-container">
      <h1>{weekNumber}주차 과제 제출</h1>

      <div className="assignment-info">
        <h2>제출 상세</h2>
        <table>
          <tbody>
          <tr>
            <td>과제 제목</td>
            <td>{assignment?.title || "불러오는 중..."}</td>
          </tr>
          <tr>
            <td>설명</td>
            <td>{assignment?.description || "-"}</td>
          </tr>
          <tr>
            <td>제출 여부</td>
            <td>{status || "제출되지 않음"}</td>
          </tr>
          <tr>
            <td>채점 상태</td>
            <td>채점되지 않음</td>
          </tr>
          <tr>
            <td>시작 일시</td>
            <td>{assignment?.startDatetime || "-"}</td>
          </tr>
          <tr>
            <td>종료 일시</td>
            <td>{assignment?.endDatetime || "-"}</td>
          </tr>
          </tbody>
        </table>
        <p>제출할 파일을 선택하세요.</p>
      </div>

      {status === "제출됨" ? (
        <div className="submit-success-message" style={{ marginTop: "20px", color: "green" }}>
          ✅ 과제가 성공적으로 제출되었습니다.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {file && (
            <div className="selected-file-info" style={{ marginBottom: "10px" }}>
              선택한 파일: <strong>{file.name}</strong>
            </div>
          )}
          <div className="file-input">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx,.pptx,.jpg,.png"
            />
          </div>
          <button type="submit" className="submit-btn">
            <FaFileUpload /> 과제 제출하기
          </button>
        </form>
      )}
    </div>
  );
};

export default SubmitAssignment;
