'use client'

import React, { useState } from "react";
import "@/app/(dashboard)/mycourses/mycourses.css";

const Enrollment = () => {
  const dummyCourseList = [
    { id: 1, code: "CS101", name: "프로그래밍 기초", professor: "홍길동", category: "전공필수", schedule: "월 1-2교시", level: "학부", credit: 3 },
    { id: 2, code: "CS102", name: "자료구조", professor: "이몽룡", category: "전공선택", schedule: "화 3-4교시", level: "학부", credit: 3 }
  ];

  const courseList = dummyCourseList;

  const [cartCourses, setCartCourses] = useState([
    dummyCourseList[0]
  ]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [checkedCartCourseIds, setCheckedCartCourseIds] = useState([]);
  const [level, setLevel] = useState("");
  const [professor, setProfessor] = useState("");

  const toggleEnrollment = (course) => {
    if (!enrolledCourses.find((c) => c.id === course.id)) {
      setEnrolledCourses([...enrolledCourses, course]);
    }
  };

  const handleCartCheckboxToggle = (courseId) => {
    if (checkedCartCourseIds.includes(courseId)) {
      setCheckedCartCourseIds(checkedCartCourseIds.filter((id) => id !== courseId));
    } else {
      setCheckedCartCourseIds([...checkedCartCourseIds, courseId]);
    }
  };

  const handleSelectAllCart = () => {
    const allIds = cartCourses.map((c) => c.id);
    setCheckedCartCourseIds(allIds);
  };

  const handleApplyCheckedCourses = () => {
    const selectedCourses = cartCourses.filter(
      (course) =>
        checkedCartCourseIds.includes(course.id) &&
        !enrolledCourses.find((e) => e.id === course.id)
    );
    setEnrolledCourses([...enrolledCourses, ...selectedCourses]);
    setCheckedCartCourseIds([]);
  };

  const filteredCourses = courseList.filter(
    (course) =>
      (level === "" || course.level === level) &&
      (professor === "" || course.professor.includes(professor))
  );

  const totalCredits = enrolledCourses.reduce((sum, course) => sum + course.credit, 0);

  return (
    <div className="mb-3">
      <h5 className="fw-bold mb-0 border p-2 d-inline-block">검색</h5>
      {/* 검색 */}
      <div className="search-box">
        <div className="search-box-row">
          <div className="search-box-field">
            <label className="form-label mb-0" style={{ width: '80px' }}>학과</label>
            <select className="form-control">
              <option>컴퓨터공학과</option>
            </select>
          </div>
          <div className="search-box-field">
            <label className="form-label mb-0" style={{ width: '80px' }}>강좌명</label>
            <input className="form-control" />
          </div>
        </div>

        <div className="search-box-row align-items-end">
          <div className="search-box-field">
            <label className="form-label mb-0" style={{ width: '80px' }}>교과목수준</label>
            <select className="form-control" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">전체</option>
              <option value="학부">학부</option>
            </select>
          </div>

          <div className="search-box-field" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
            <label className="form-label mb-0" style={{ width: '80px', whiteSpace: 'nowrap' }}>교수명</label>
            <input
              type="text"
              className="form-control"
              style={{ flexGrow: 1 }}
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
            />
            <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>조회</button>
          </div>
        </div>
      </div>
      {/* 장바구니 */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h5 className="fw-bold mb-0 border p-2 d-inline-block">장바구니</h5>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary custom-btn" onClick={handleSelectAllCart}>
            일괄선택
          </button>
          <button className="btn btn-outline-primary custom-btn" onClick={handleApplyCheckedCourses}>
            신청하기
          </button>
        </div>
      </div>
      <table className="table table-bordered text-center" style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead className="table-primary">
        <tr>
          <th>NO</th>
          <th>선택</th>
          <th>신청</th>
          <th>이수구분</th>
          <th>교과목코드</th>
          <th>교과목명</th>
          <th>학점</th>
          <th>담당교수</th>
          <th>시간표</th>
        </tr>
        </thead>
        <tbody>
        {cartCourses.length === 0 ? (
          <tr>
            <td colSpan={9} className="text-muted">담긴 과목이 없습니다.</td>
          </tr>
        ) : (
          cartCourses.map((course, index) => (
            <tr key={course.id}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="checkbox"
                  checked={checkedCartCourseIds.includes(course.id)}
                  onChange={() => handleCartCheckboxToggle(course.id)}
                />
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => toggleEnrollment(course)}
                  disabled={enrolledCourses.some((c) => c.id === course.id)}
                >
                  신청
                </button>
              </td>
              <td>{course.category}</td>
              <td>{course.code}</td>
              <td>{course.name}</td>
              <td>{course.credit}</td>
              <td>{course.professor}</td>
              <td>{course.schedule}</td>
            </tr>
          ))
        )}
        </tbody>
      </table>

      {/* 개설강좌 */}
      <div className="mb-4">
        <h5 className="fw-bold mb-2 border p-2 d-inline-block">개설강좌 목록</h5>
        <table className="table table-bordered text-center" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead className="table-primary">
          <tr>
            <th>NO</th>
            <th>신청</th>
            <th>이수구분</th>
            <th>교과목코드</th>
            <th>교과목명</th>
            <th>학점</th>
            <th>담당교수</th>
            <th>시간표</th>
          </tr>
          </thead>
          <tbody>
          {filteredCourses.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-muted">데이터가 없습니다.</td>
            </tr>
          ) : (
            filteredCourses.map((course, index) => (
              <tr key={course.id}>
                <td>{index + 1}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => toggleEnrollment(course)}
                    disabled={enrolledCourses.some((c) => c.id === course.id)}
                  >
                    신청
                  </button>
                </td>
                <td>{course.category}</td>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.credit}</td>
                <td>{course.professor}</td>
                <td>{course.schedule}</td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>

      {/* 신청내역 */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="fw-bold mb-0 border p-2 d-inline-block">신청내역</h5>
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: '0.9rem' }}>신청 과목 수:</span>
            <div className="bg-primary text-white text-center" style={{ width: '18px', height: '18px', fontSize: '0.75rem', lineHeight: '18px', borderRadius: '2px' }}>
              {enrolledCourses.length}
            </div>
            <span style={{ fontSize: '0.9rem' }}>총 학점:</span>
            <div className="bg-primary text-white text-center" style={{ width: '28px', height: '18px', fontSize: '0.75rem', lineHeight: '18px', borderRadius: '2px' }}>
              {totalCredits}
            </div>
          </div>
        </div>
        <table className="table table-bordered text-center" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead className="table-primary">
          <tr>
            <th>NO</th>
            <th>수강취소</th>
            <th>이수구분</th>
            <th>교과목코드</th>
            <th>교과목명</th>
            <th>학점</th>
            <th>담당교수</th>
            <th>시간표</th>
          </tr>
          </thead>
          <tbody>
          {enrolledCourses.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-muted">담긴 과목이 없습니다.</td>
            </tr>
          ) : (
            enrolledCourses.map((course, index) => (
              <tr key={course.id}>
                <td>{index + 1}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      setEnrolledCourses(enrolledCourses.filter((c) => c.id !== course.id))
                    }
                  >
                    삭제
                  </button>
                </td>
                <td>{course.category}</td>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.credit}</td>
                <td>{course.professor}</td>
                <td>{course.schedule}</td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enrollment;
