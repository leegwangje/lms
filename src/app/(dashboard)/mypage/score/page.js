'use client';

import React, { useEffect, useState } from 'react';
import '@/app/(dashboard)/mypage/mypage.css';

const Score = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState({ name: '', studentId: '', department: '' });

  useEffect(() => {
    //  클라이언트에서만 실행됨 (localStorage 안전)
    let stdtId = null;
    const raw = localStorage.getItem("jwt");
    const token = raw ? raw : null;

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        stdtId = Number(payload.sub);
      } catch (e) {
        console.error("JWT 파싱 실패:", e);
        return;
      }
    }

    if (!stdtId) {
      console.error("❌ stdtId가 없습니다. JWT 토큰 확인 필요.");
      return;
    }

    const courseYear = 2025;
    const semesterCd = 10;

    const fetchGrades = async () => {
      try {
        const url = `http://localhost:8080/api/mycourses/score?stdtId=${stdtId}&courseYear=${courseYear}&semesterCd=${semesterCd}`;
        console.log("📡 호출 URL:", url);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📡 응답 status:", res.status);

        if (!res.ok) {
          const msg = await res.text();
          console.error("❌ 서버 응답 메시지:", msg);
          throw new Error("성적 조회 실패");
        }

        const result = await res.json();
        console.log("📦 응답 데이터:", result);

        const formatted = result.grades.map((g) => ({
          code: g.subjectCode,
          name: g.subjectName,
          type: g.courseType,
          grade: g.termAvgGrade,
          score: g.termAvgScore,
          credit: g.creditEarned,
        }));

        setGrades(formatted);
        setStudentInfo(result.student);
      } catch (err) {
        console.error("❌ 성적 조회 오류:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  return (
    <div className="container py-4">
      <h5 className="midterm-title">중간성적 조회</h5>

      <table className="midterm-info-table">
        <tbody>
        <tr><td className="label">이름</td><td>{studentInfo.name}</td></tr>
        <tr><td className="label">학번</td><td>{studentInfo.studentId}</td></tr>
        <tr><td className="label">학과</td><td>{studentInfo.department}</td></tr>
        </tbody>
      </table>

      <table className="midterm-grades-table">
        <thead>
        <tr>
          <th>NO</th>
          <th>교과목코드</th>
          <th>교과목명</th>
          <th>이수구분</th>
          <th>등급</th>
          <th>점수</th>
          <th>이수학점</th>
        </tr>
        </thead>
        <tbody>
        {loading ? (
          <tr><td colSpan="7" className="text-center">조회 중...</td></tr>
        ) : grades.length === 0 ? (
          <tr><td colSpan="7" className="text-center">성적 정보가 없습니다.</td></tr>
        ) : (
          grades.map((grade, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{grade.code}</td>
              <td>{grade.name}</td>
              <td>{grade.type}</td>
              <td>{grade.grade}</td>
              <td>{grade.score}</td>
              <td>{grade.credit}</td>
            </tr>
          ))
        )}
        </tbody>
      </table>
    </div>
  );
};

export default Score;
