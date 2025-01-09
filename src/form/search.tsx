import React from 'react';
import {
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Button,
    Icon,
    useToast, useDisclosure, Modal, ModalOverlay, ModalContent,
    VStack,
} from '@chakra-ui/react';
import { Search, MapPin } from 'lucide-react';

import { useRouter } from 'next/navigation';
import {useSearch} from "@/hook/useSearch";
import {LoginComponent} from "@/component/login";
import axios from "axios";
import {css, keyframes} from "@emotion/react";

interface SearchFormProps {
    variant?: 'default' | 'compact';
    onSubmit?: () => void;
}
const AUTH_SERVER = process.env.AUTH_SERVER || 'http://localhost:8080';
const gradientAnimation = keyframes`
    0% {
        background-position: 0% 50%;
    }
    100% {
        background-position: 100% 50%;
    }
`;

const shineAnimation = keyframes`
    0% {
        background-position: 200% center;
    }
    100% {
        background-position: -200% center;
    }
`;

const magicButtonStyle = css`
    background: linear-gradient(120deg, 
        #e43c8e 0%,
        #56bec4 25%,
        #f262a6 50%,
        #6dd3d9 75%,
        #e43c8e 100%
    );
    background-size: 200% auto;
    color: white;
    animation: ${shineAnimation} 3s linear infinite;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(228, 60, 142, 0.2);
    }
    &:active {
        transform: translateY(0);
    }
`;
const SearchForm = ({ variant = 'default', onSubmit }: SearchFormProps) => {
    const router = useRouter();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        searchTerm,
        location,
        setSearchTerm,
        setLocation,
        handleSearch,
    } = useSearch();

    const authState = JSON.parse(localStorage.getItem('authState') || '{"user": null}');
    const profileData = JSON.parse(localStorage.getItem('profileData') || 'null');
    const isAuthenticated = !!authState.user;
    const hasProfile = !!profileData;

    const handleAuth = async (isLogin: boolean, formData: any) => {
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await axios.post(`${AUTH_SERVER}${endpoint}`, formData);

            // Guardar datos de autenticación
            const authData = {
                user: response.data,
                token: response.data.token
            };
            localStorage.setItem('authState', JSON.stringify(authData));

            // Configurar token para futuras peticiones
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            toast({
                title: isLogin ? 'Login Exitoso' : 'Registro Exitoso',
                description: `¡Bienvenido, ${response.data.username}!`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            onClose(); // Cerrar modal de login
            // Redirigir al usuario a la página de perfil para el onboarding
            router.push('/profile');

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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("searchTerm", searchTerm);

        // Validación de autenticación
        if (!isAuthenticated) {
            onOpen(); // Abrir modal para usuarios no autenticados
            return;
        }

        // Validación de perfil
        if (!hasProfile) {
            toast({
                title: "Perfil incompleto",
                description: "Completa tu perfil profesional para comenzar a buscar empleos",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            router.push('/profile');
            return;
        }

        if (!searchTerm && !location) {
            toast({
                title: "Búsqueda vacía",
                description: "Por favor ingresa un término de búsqueda o ubicación",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            await handleSearch(searchTerm, location);

            // Construir la URL con los parámetros de búsqueda
            const params = new URLSearchParams();
            if (searchTerm) params.append('q', searchTerm);
            if (location) params.append('location', location);

            // Navegar a la página de búsqueda
            router.push(`/search?${params.toString()}`);

            if (onSubmit) onSubmit();
        } catch (error) {
            console.error('Error during search:', error);
            toast({
                title: "Error en la búsqueda",
                description: "Hubo un error al realizar la búsqueda. Por favor intenta de nuevo.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const isCompact = variant === 'compact';

    return (
        <>
            <form onSubmit={handleSubmit} style={{width: '100%'}}>
                <VStack w="full" spacing={4}>
                    {/* Inputs en un HStack que se hace columna en móvil */}
                    <HStack
                        w="full"
                        spacing={4}
                        direction={{base: 'column', md: 'row'}}
                    >
                        <InputGroup>
                            <InputLeftElement>
                                <Icon as={Search} color="whiteAlpha.500"/>
                            </InputLeftElement>
                            <Input
                                placeholder="Puesto, empresa o palabra clave"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                bg="whiteAlpha.100"
                                size={isCompact ? 'md' : 'lg'}
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLeftElement>
                                <Icon as={MapPin} color="whiteAlpha.500"/>
                            </InputLeftElement>
                            <Input
                                placeholder="Ciudad o ubicación"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                bg="whiteAlpha.100"
                                size={isCompact ? 'md' : 'lg'}
                            />
                        </InputGroup>
                    </HStack>

                    {/* Botón a ancho completo */}
                    <Button
                        type="submit"
                        colorScheme="brand"
                        size={isCompact ? 'md' : 'lg'}
                        w="full"
                        css={magicButtonStyle}
                    >
                        Buscar empleos
                    </Button>
                </VStack>
            </form>

            {/* Modal de Login */}
            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)"/>
                <ModalContent bg="transparent" boxShadow="none">
                    <LoginComponent onAuth={handleAuth}/>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SearchForm;