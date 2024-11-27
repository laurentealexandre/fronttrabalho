import api from './api';

export const authService = {
    login: async (credentials) => {
        
        if (credentials.email === 'admin@example.com' && credentials.password === 'admin') {
            const userData = {
                email: credentials.email,
                name: 'Administrador',
                token: 'fake-jwt-token'
            };
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        }
        throw new Error('Credenciais inválidas');
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};