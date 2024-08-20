import axios from 'axios';

export const loginWithGoogle = async () => {
    try {
        const response = await axios.get('http://localhost:3001/auth/google');
        return response.data;
    } catch (error) {
        console.error('Login failed', error);
        return null;
    }
};
