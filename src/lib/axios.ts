import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useToast } from '@chakra-ui/react';

const AUTH_SERVER = process.env.AUTH_SERVER || 'http://localhost:8080';

// Interceptor para peticiones
axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Obtener token del localStorage
        const authState = localStorage.getItem('authState');
        if (authState) {
            const { token } = JSON.parse(authState);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Interceptor para respuestas
axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Token expirado o inválido
                    localStorage.removeItem('authState');
                    delete axios.defaults.headers.common['Authorization'];
                    break;
            }
        }
        return Promise.reject(error);
    }
);

// Hook personalizado para manejar errores de axios
export const useAxiosInterceptor = () => {
    const toast = useToast();

    const handleAxiosError = (error: AxiosError) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    toast({
                        title: 'Sesión expirada',
                        description: 'Por favor, inicia sesión nuevamente.',
                        status: 'warning',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;

                case 403:
                    toast({
                        title: 'Acceso denegado',
                        description: 'No tienes permisos para realizar esta acción.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;

                case 404:
                    toast({
                        title: 'No encontrado',
                        description: 'El recurso solicitado no existe.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;

                case 500:
                    toast({
                        title: 'Error del servidor',
                        description: 'Ha ocurrido un error en el servidor.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    break;

                default:
                    toast({
                        title: 'Error',
                        description: 'Ha ocurrido un error inesperado.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
            }
        } else if (error.request) {
            toast({
                title: 'Error de conexión',
                description: 'No se pudo conectar con el servidor.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return { handleAxiosError };
};

// Función para refrescar el token
export const refreshToken = async () => {
    try {
        const authState = localStorage.getItem('authState');
        if (!authState) return null;

        const { token } = JSON.parse(authState);
        const response = await axios.post('/auth/refresh', { token });

        return response.data.token;
    } catch (error) {
        localStorage.removeItem('authState');
        return null;
    }
};