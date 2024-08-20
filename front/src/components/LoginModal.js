import React from 'react';
import Modal from 'react-modal';

// 모달 스타일 설정
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root'); // 접근성을 위해 애플리케이션 루트 요소를 설정

const LoginModal = ({ isOpen, onRequestClose }) => {
    return (
        <Modal
            isOpen={isOpen} // 모달이 열려 있는지 여부
            onRequestClose={onRequestClose} // 모달을 닫는 함수
            style={customStyles}
            contentLabel="Login Required"
        >
            <h2>Login Required</h2>
            <div>You need to login to access the dashboard.</div>
            <button onClick={() => {
                onRequestClose(); // 모달 닫기
                window.location.href = '/'; // 로그인 페이지로 리디렉션
            }}>Go to Login</button>
        </Modal>
    );
};

export default LoginModal;
