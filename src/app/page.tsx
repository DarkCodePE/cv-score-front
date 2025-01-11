'use client';
import dynamic from 'next/dynamic';
import React, {ReactNode, Suspense, useEffect, useState} from 'react';
import {
  Box,
  Container,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent, Spinner,
} from '@chakra-ui/react';

import axios from 'axios';

import {LoginComponent} from "@/component/login";

import Header from "@/component/header";
import HomeView from "@/component/HomeViewProps";

import {useRouter} from "next/navigation";
import {AuthState, LoginFormData} from "@/types/user";



const AUTH_SERVER = process.env.AUTH_SERVER || 'http://localhost:8080';

const HomePage = () => {
  const router = useRouter();
  const toast = useToast();

  // Modales
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose
  } = useDisclosure();
  const {
    isOpen: isCVModalOpen,
    onOpen: onCVModalOpen,
    onClose: onCVModalClose
  } = useDisclosure();

  // Estado de autenticación
  const [authState, setAuthState] = useState<AuthState>( {
    user: {
      userId: '',
      username: '',
      email: '',
      roles: [],
      group_id: '',
      session_id: '',
      chat_status: '',
      last_login: '',
      created_at: '',
      updated_at: ''
    },
    token: null,
  });

  useEffect(() => {
    // Solo ejecuta esta lógica en el cliente
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('authState');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        setAuthState(parsed);
        if (parsed.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
        }
      }
    }
  }, []);

  const handleAuth = async (isLogin: boolean, formData: LoginFormData) => {
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${AUTH_SERVER}${endpoint}`, formData);

      const newAuthState = {
        user: response.data,
        token: response.data.token,
      };

      setAuthState(newAuthState);
      if (typeof window !== 'undefined') {
        localStorage.setItem('authState', JSON.stringify(newAuthState));
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      toast({
        title: isLogin ? 'Login Exitoso' : 'Registro Exitoso',
        description: `¡Bienvenido, ${response.data.username}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onLoginClose();
      onCVModalOpen();
    } catch (error) {
      console.error('Error during authentication:', error);
      toast({
        title: isLogin ? 'Error de Login' : 'Error de Registro',
        description: 'Hubo un error. Por favor, intenta nuevamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem('authState');
    localStorage.removeItem('profileData');
    delete axios.defaults.headers.common['Authorization'];
    router.push('/');

    toast({
      title: 'Sesión Cerrada',
      description: 'Has cerrado sesión exitosamente.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  if (!authState) {
    return (
        <Box bg="background.900" minH="100vh">
          <Container>
            <p>Loading...</p>
          </Container>
        </Box>
    );
  }
  interface SuspenseWrapperProps {
    children: ReactNode;
  }
  // Componente envuelto en Suspense
  const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({ children }) => (
      <Suspense fallback={<Spinner />}>
        {children}
      </Suspense>
  );
  return (
      <Box bg="background.900" minH="100vh">
        <SuspenseWrapper>
          <Header
              authState={authState}
              onLogout={handleLogout}
              onLoginClick={onLoginOpen}
              onProfileClick={() => router.push('/profile')}
              onLogoClick={() => router.push('/')}
          />
        </SuspenseWrapper>


        <Container maxW="container.xl">
          <HomeView isAuthenticated={!!authState?.user} />
        </Container>

        {/* Modal de Login */}
        <Modal isOpen={isLoginOpen} onClose={onLoginClose} size="md">
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent bg="transparent" boxShadow="none">
            <LoginComponent onAuth={handleAuth} />
          </ModalContent>
        </Modal>

      </Box>
  );
};

export default dynamic(() => Promise.resolve(HomePage), { ssr: false });