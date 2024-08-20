import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginModal from "../components/LoginModal"; // 로그인 모달 컴포넌트 임포트

const Dashboard = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달의 열림/닫힘 상태 관리

  useEffect(() => {
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기

    if (!token) {
      // 토큰이 없으면 로그인 모달을 띄움
      setModalIsOpen(true);
    } else {
      try {
        // 토큰을 디코딩하여 유효성 검사
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // 토큰이 만료되었으면 로그인 모달을 띄움
          localStorage.removeItem("token");
          setModalIsOpen(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setModalIsOpen(true); // 오류가 발생하면 모달을 띄움
      }
    }
  }, [navigate]);

  return (
    <div>
      <h1>마이페이지</h1>
      <p>Find US에 오신것을 환영합니다.</p>

      <LoginModal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          navigate("/"); // 모달 닫힘 시 로그인 페이지로 리디렉션
        }}
      />
    </div>
  );
};

export default Dashboard;
