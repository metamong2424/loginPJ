import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginButton from './components/LoginButton'; // 로그인 버튼 컴포넌트 임포트
import LogoutButton from './components/LogoutButton'; // 로그아웃 버튼 컴포넌트 임포트
import Dashboard from './pages/Dashboard'; // 대시보드 페이지 컴포넌트 임포트

function App() {
    useEffect(() => {
        // URL에서 쿼리 파라미터를 통해 전달된 토큰을 가져옴
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            // 토큰이 있으면 로컬 스토리지에 저장
            localStorage.setItem('token', token);

            // 브라우저 히스토리에서 URL의 쿼리 파라미터 제거 (깨끗한 URL 유지)
            window.history.replaceState({}, document.title, "/");

            // 토큰이 저장되었으므로 대시보드 페이지로 리디렉션
            window.location.href = '/dashboard';
        }
    }, []); // 컴포넌트가 마운트될 때만 실행

    return (
        <Router>
            <Routes>
                {/* 기본 경로("/")에 대한 라우트 설정 */}
                <Route path="/" element={
                    <div>
                        <h1>Google Login Example</h1>
                        <LoginButton /> {/* 로그인 버튼 표시 */}
                        <LogoutButton /> {/* 로그아웃 버튼 표시 */}
                    </div>
                } />

                {/* 대시보드 경로("/dashboard")에 대한 라우트 설정 */}
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
