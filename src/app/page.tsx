'use client';
import React, {useEffect, useState} from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  HStack,
  VStack,
  Icon,
  InputGroup,
  InputLeftElement,
  Flex,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  MenuButton,
  Avatar,
  MenuItem,
  MenuList,
  Menu, MenuDivider, ModalHeader, ModalCloseButton, ModalBody
} from '@chakra-ui/react';
import {Search, MapPin, Badge, ChevronDownIcon, User, Settings, LogOut} from 'lucide-react';
import axios from 'axios';
import {AuthResponse, AuthState, LoginFormData, LoginRequest, RegisterRequest} from "@/types/user";
import {LoginComponent} from "@/component/login";
import CVUploadComponent from "@/component/cv";
import Header from "@/component/header";
import HomeView from "@/component/HomeViewProps";
import ProfileComponent from "@/component/profile";
import {useRouter} from "next/navigation";


type View = 'home' | 'profile' | 'search';
const AUTH_SERVER = process.env.AUTH_SERVER || 'http://localhost:8080';

const HomePage = () => {
  const router = useRouter();
  const toast = useToast();
  const [currentView, setCurrentView] = useState<View>('home');
  const [searchConfig, setSearchConfig] = useState({
    term: '',
    location: ''
  });

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
  const [authState, setAuthState] = useState<AuthState>(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('authState');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
        }
        return parsed;
      }
    }
    return { user: null, token: null };
  });

  const handleAuth = async (isLogin: boolean, formData: LoginFormData) => {
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${AUTH_SERVER}${endpoint}`, formData);

      setAuthState({
        user: response.data,
        token: response.data.token
      });
      localStorage.setItem('authState', JSON.stringify({
        user: response.data,
        token: response.data.token
      }));

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

  const handleProfileData = (data: any) => {
    localStorage.setItem('profileData', JSON.stringify(data));
    onCVModalClose();
    router.push('/profile');

    toast({
      title: 'Perfil Actualizado',
      description: 'Tu CV ha sido procesado exitosamente.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSearch = (term: string, location: string) => {
    // Redirigir a SearchPage con parámetros
    router.push(`/search?term=${term}&location=${location}`);
  };

  return (
      <Box bg="background.900" minH="100vh">
        <Header
            authState={authState}
            onLogout={handleLogout}
            onLoginClick={onLoginOpen}
            onProfileClick={() => router.push('/profile')}
            onLogoClick={() => router.push('/')}
        />

        <Container maxW="container.xl">
          <HomeView isAuthenticated={!!authState.user} />
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

export default HomePage;