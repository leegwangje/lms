'use client';

import React, { useEffect, useState } from "react";
import "@/app/(dashboard)/mycourses/myCart.css";
import LectureList from "@/components/courses/LectureList";
import LectureSearch from "@/components/courses/LectureSearch";

// ✅ JWT에서 stdtId 추출
const raw = localStorage.getItem("jwt");
const token = raw ? raw : null;

let stdtId = null;
if (token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    stdtId = Number(payload.sub);
  } catch (e) {
    console.error("JWT 파싱 실패:", e);
  }
}

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const Cart = () => {
  const [courseList, setCourseList] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [priorities, setPriorities] = useState({});

  useEffect(() => {
    fetchCourseList();
    fetchCartList();
  }, []);

  const fetchCourseList = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/mycourses/cart", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("서버 응답 실패");
      const data = await response.json();
      setCourseList(data);
    } catch (error) {
      console.error("강의 목록 불러오기 실패:", error);
    }
  };

  const fetchCartList = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/mycourses/cart/list/${stdtId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("장바구니 목록 요청 실패");
      const data = await res.json();
      setCartList(data);

      const newPriorities = {};
      data.forEach(item => {
        newPriorities[item.lectureId] = item.priorityOrder;
      });
      setPriorities(newPriorities);
    } catch (err) {
      console.error("장바구니 동기화 실패:", err);
    }
  };

  const handleSearch = async (type, keyword) => {
    if (!type) {
      alert("검색조건을 선택해주세요.");
      return;
    }

    try {
      const url = keyword
        ? `http://localhost:8080/api/mycourses/find/${type}/${keyword}`
        : `http://localhost:8080/api/mycourses/find/${type}`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("서버 응답 실패");
      const data = await response.json();
      setCourseList(data);
    } catch (error) {
      console.error("강의 목록 불러오기 실패:", error);
    }
  };

  const addToCart = (course) => {
    if (cartList.find((c) => c.lectureId === course.lectureId)) {
      alert("이미 장바구니에 담긴 과목입니다.");
      return;
    }

    // ✅ RegisterCartDTO 스타일로 local에 넣기
    const newItem = {
      stdtId: stdtId,
      lectureId: course.lectureId,
      priorityOrder: null,
      courseType: course.courseType,
      department: course.department,
      subjectCode: course.subjectCode,
      subjectName: course.subjectName,
      subjectLevel: course.subjectLevel,
      credit: course.credit,
      timetable: course.timetable
    };

    const newCart = [...cartList, newItem];
    setCartList(newCart);

    const newPriorities = { ...priorities };
    newPriorities[course.lectureId] = null;
    setPriorities(newPriorities);
  };

  const removeFromCart = async (lectureId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/mycourses/cart/remove?stdtId=${stdtId}&lectureId=${lectureId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error(await res.text());

      await fetchCartList();
      alert("삭제 완료!");
    } catch (err) {
      alert("삭제 실패: " + err.message);
      console.error("❌ 삭제 실패:", err);
    }
  };

  const handlePriorityChange = (lectureId, value) => {
    const newPriorities = { ...priorities, [lectureId]: value };
    setPriorities(newPriorities);
  };

  const handleSave = async (e) => {
    e?.preventDefault();

    const payload = cartList.map((course) => ({
      stdtId,
      lectureId: course.lectureId,
      priorityOrder: parseInt(priorities[course.lectureId]) || null,
    }));

    console.log("🚚 저장할 payload:", payload);

    try {
      const res = await fetch("http://localhost:8080/api/mycourses/cart/priorities", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("우선순위 저장 실패");

      // 🔁 저장 후 다시 장바구니 데이터 불러오기
      await fetchCartList();

      // 여기선 cartList 상태를 로그로 출력
      console.log("✅ 저장 후 cartList 재조회 완료:", cartList);

      // 저장 성공 후 알림
      alert("작업이 저장되었습니다.");

    } catch (err) {
      console.error("작업 저장 실패:", err);
    }
  };

  //   if (res.ok) {
  //     alert("우선순위 저장 완료!");
  //     fetchCartList();
  //   } else {
  //     alert("저장 실패: " + await res.text());
  //   }
  // } catch (err) {
  //   console.error("우선순위 저장 오류:", err);
  //   alert("저장 중 오류 발생!");
  // }


  return (
    <div className="enrollment-container mb-3">
      <h5 className="fw-bold mb-0 border p-2 d-inline-block">검색</h5>
      <LectureSearch onSearch={handleSearch} />

      <h5 className="fw-bold mb-2 border p-2 d-inline-block mt-4">개설강좌 목록</h5>
      <LectureList
        lectures={courseList}
        buttonLabel="담기"
        onClick={addToCart}
      />

      <div className="d-flex align-items-center justify-content-between mb-2 mt-4">
        <h5 className="fw-bold mb-0 border p-2 d-inline-block">장바구니 수강목록</h5>
        <button className="btn btn-primary" onClick={handleSave}>작업저장</button>
      </div>

      <table className="table table-bordered text-center" style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead className="table-primary">
        <tr>
          <th>NO</th>
          <th>우선순위</th>
          <th>삭제</th>
          <th>이수구분</th>
          <th>개설전공학과</th>
          <th>교과목코드</th>
          <th>교과목명</th>
          <th>교과목 수준</th>
          <th>학점</th>
          <th>시간표</th>
        </tr>
        </thead>
        <tbody>
        {cartList.length === 0 ? (
          <tr>
            <td colSpan={10} className="text-muted">장바구니에 담긴 과목이 없습니다.</td>
          </tr>
        ) : (
          cartList.map((course, index) => (
            <tr key={course.lectureId}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  style={{ width: "80px" }}
                  value={priorities[course.lectureId] || ''}
                  onChange={(e) => handlePriorityChange(course.lectureId, e.target.value)}
                />
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeFromCart(course.lectureId)}
                >
                  삭제
                </button>
              </td>
              <td>{course.courseType}</td>
              <td>{course.department}</td>
              <td>{course.subjectCode}</td>
              <td>{course.subjectName}</td>
              <td>{course.subjectLevel}</td>
              <td>{course.credit}</td>
              <td>{course.timetable}</td>
            </tr>
          ))
        )}
        </tbody>
      </table>
    </div>
  );
};

export default Cart;
