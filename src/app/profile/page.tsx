'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Spinner,
    useDisclosure,
    VStack,
    Text,
    Heading,
    Icon,
    Button,
    useToast,
} from '@chakra-ui/react';
import ProfileComponent from "@/component/profile";
import Header from "@/component/header";
import CVUploadComponent from "@/component/cv";
import {UserCircle2, WandSparkles } from "lucide-react";
import { css, keyframes } from '@emotion/react';
import {profileService} from "@/service/profile";
import axios from "axios";
import {ProfileSchema} from "@/types/profile";
import {AuthState} from "@/types/user";

const gradientAnimation = keyframes`
    0% {
        background-position: 0% 50%;
    }
    100% {
        background-position: 100% 50%;
    }
`;

const magicButtonStyle = css`
    background: linear-gradient(270deg, #e43c8e, #56bec4, #f262a6, #6dd3d9);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${gradientAnimation} 3s ease infinite;
    border: 2px solid  #6dd3d9;
    &:hover {
        border-color: #e43c8e; /* Puedes ajustar el color del borde según tu preferencia */
        -webkit-text-fill-color: white; /* Cambia el color del texto a blanco */
    }
`;

const ProfilePage = () => {
    const router = useRouter();
    const toast = useToast();
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
    const [profileData, setProfileData] = useState<ProfileSchema>({
        id: '',
        user_id: '',
        first_name: '',
        last_name: '',
        headline: '',
        about: '',
        location: null,
        contact_info: {
            email: '',
            phone: undefined,
        },
        skills: [],
        languages: [],
        experiences: [],
        education: [],
        documents: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        // Carga authState desde localStorage en el cliente
        if (typeof window !== 'undefined') {
            const savedAuth = localStorage.getItem('authState');
            if (savedAuth) {
                const parsed = JSON.parse(savedAuth);
                setAuthState(parsed);
                axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
            }
        }
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const profile = await profileService.getProfile(userId);
            if (profile) {
                setProfileData(profile);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('profileData', JSON.stringify(profile));
                }
                return true;
            }
            return false;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return false; // Perfil no existe
            }
            console.error('Error fetching profile:', error);
            toast({
                title: 'Error',
                description: 'No se pudo cargar tu perfil. Por favor, intenta de nuevo.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return false;
        }
    };

    useEffect(() => {
        const init = async () => {
            if (!authState.user?.userId) {
                router.push('/');
                return;
            }

            const hasProfile = await fetchProfile(authState.user.userId);
            setIsLoading(false);

            // Si no tiene perfil y no está en proceso de creación, mostrar onboarding
            if (!hasProfile && !isProcessing) {
                return;
            }
        };

        if (authState) {
            init();
        }
    }, [authState, isProcessing, router]);

    const handleProfileData = async (data: ProfileSchema) => {
        setIsProcessing(true);
        try {
            if (profileData) {
                const updatedProfile = await profileService.updateProfile({
                    ...data,
                    user_id: authState?.user?.userId,
                });
                setProfileData(updatedProfile);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('profileData', JSON.stringify(updatedProfile));
                }
            } else {
                setProfileData(data);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('profileData', JSON.stringify(data));
                }

                await new Promise((resolve) => setTimeout(resolve, 1000));
                await fetchProfile(authState?.user?.userId || '');
            }

            onClose();

            toast({
                title: profileData ? 'Perfil actualizado' : 'Perfil creado',
                description: 'Tu perfil ha sido procesado exitosamente',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error handling profile data:', error);
            toast({
                title: 'Error',
                description: 'Hubo un problema al procesar tu perfil. Por favor, intenta de nuevo.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <Container h="100vh">
                <VStack justify="center" h="full">
                    <Spinner size="xl" color="brand.500" />
                </VStack>
            </Container>
        );
    }

    if (!authState) {
        router.push('/');
        return null;
    }

    const renderContent = () => {
        if (isProcessing) {
            return (
                <Container h="100vh">
                    <VStack justify="center" h="full">
                        <Spinner size="xl" color="brand.500" />
                        <Text>Procesando tu perfil...</Text>
                    </VStack>
                </Container>
            );
        }

        if (profileData) {
            return (
                <>
                    <Container maxW="container.xl" pt={6} display="flex" justifyContent="flex-end">
                        <Button
                            colorScheme="brand"
                            size="lg"
                            onClick={onOpen}
                            leftIcon={<WandSparkles size={24} />}
                            css={magicButtonStyle}
                        >
                            Actualizar perfil con IA
                        </Button>
                    </Container>
                    <ProfileComponent profileData={profileData} />
                </>
            );
        }

        return (
            <Container maxW="container.lg" py={16}>
                <VStack spacing={8} align="stretch">
                    <VStack spacing={4} textAlign="center">
                        <Icon as={UserCircle2} boxSize={16} color="brand.500" />
                        <Heading size="lg">
                            ¡Bienvenido a KUALI.ai, {authState?.user?.username}!
                        </Heading>
                        <Text fontSize="xl" color="whiteAlpha.800">
                            Completa tu perfil profesional para comenzar a encontrar las mejores oportunidades
                        </Text>
                    </VStack>

                    <VStack spacing={4} maxW="xl" mx="auto">
                        <Button
                            size="lg"
                            width="full"
                            colorScheme="brand"
                            leftIcon={<WandSparkles />}
                            onClick={onOpen}
                            isLoading={isProcessing}
                        >
                            Completar mi perfil con IA
                        </Button>
                        <Text fontSize="sm" color="whiteAlpha.600">
                            Utilizamos IA para analizar tu CV y crear tu perfil automáticamente
                        </Text>
                    </VStack>
                </VStack>
            </Container>
        );
    };

    return (
        <Box minH="100vh" bg="background.900">
            <Header
                authState={authState}
                onLogout={() => {
                    localStorage.removeItem('authState');
                    localStorage.removeItem('profileData');
                    router.push('/');
                }}
                onLoginClick={() => router.push('/')}
                onProfileClick={() => router.push('/profile')}
                onLogoClick={() => router.push('/')}
            />

            {renderContent()}

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="xl"
                isCentered
                closeOnOverlayClick={!isProcessing}
                closeOnEsc={!isProcessing}
            >
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
                <ModalContent bg="background.900">
                    <ModalHeader>
                        {profileData ? 'Actualizar perfil con IA' : 'Crear perfil con IA'}
                    </ModalHeader>
                    {!isProcessing && <ModalCloseButton />}
                    <ModalBody pb={6}>
                        <CVUploadComponent
                            onProfileData={handleProfileData}
                            userId={authState?.user?.userId || ''}
                            isProcessing={isProcessing}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ProfilePage;