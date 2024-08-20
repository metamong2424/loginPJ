import React from "react";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      // 백엔드의 로그아웃 엔드포인트 호출
      const response = await fetch("http://localhost:3001/auth/logout", {
        method: "GET",
        credentials: "include", // 세션 쿠키를 포함시킴
      });

      if (response.ok) {
        // 로그아웃 후 로컬 스토리지에서 토큰 제거
        localStorage.removeItem("token");
        // 홈으로 리디렉션
        window.location.href = "/";
      } else {
        alert("Failed to log out."); // 로그아웃 실패 시 경고 메시지
      }
    } catch (error) {
      console.error("Logout error:", error); // 로그아웃 중 오류 발생 시 로그 출력
      alert("An error occurred during logout."); // 오류 발생 시 경고 메시지
    }
  };

  return <button onClick={handleLogout}>로그아웃</button>;
};

export default LogoutButton;
