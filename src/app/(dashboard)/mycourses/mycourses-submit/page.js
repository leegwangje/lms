"use client";
import React, { useState } from "react";
import { FaFileUpload } from "react-icons/fa"; // 업로드 아이콘
import "@/app/(dashboard)/mycourses/Submit.css"; // CSS 파일 불러오기

const SubmitAssignment = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(""); // 제출 상태 (예: '제출됨', '제출되지 않음')

  // 과제 파일 선택 핸들러
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 과제 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      setStatus("제출됨");
      // 실제로 파일 제출 처리하는 로직을 추가할 수 있습니다.
      alert("과제가 제출되었습니다.");
    } else {
      setStatus("제출되지 않음");
      alert("파일을 선택해주세요.");
    }
  };

  return (
    <div className="submit-assignment-container">
      <h1>과제 제출하기</h1>
      <div className="assignment-info">
        <h2>제출 상세</h2>
        <table>
          <tbody>
          <tr>
            <td>제출 여부</td>
            <td>{status ? status : "제출되지 않음"}</td>
          </tr>
          <tr>
            <td>채점 상태</td>
            <td>채점되지 않음</td>
          </tr>
          <tr>
            <td>종료 일시</td>
            <td>2025-04-06 00:00</td>
          </tr>
          <tr>
            <td>마감까지 남은 기한</td>
            <td>2 일 11 시간</td>
          </tr>
          <tr>
            <td>최초 등록 일시</td>
            <td>2025-04-02 21:31</td>
          </tr>
          </tbody>
        </table>
        <p>제출할 파일을 선택하세요.</p>
      </div>

      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default SubmitAssignment;
