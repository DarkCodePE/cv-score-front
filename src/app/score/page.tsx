'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Spinner, VStack, useToast, Button, Heading, HStack, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Header from "@/component/header";

import { ClipboardList } from 'lucide-react';
import ScoringDashboard from "@/component/score";
import {AuthState} from "@/types/user";

const ScoringPage = () => {
    const router = useRouter();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
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
        if (typeof window !== 'undefined') {
            // Verificar autenticación y rol
            const checkAuth = () => {
                const savedAuth = localStorage.getItem('authState');
                if (!savedAuth) {
                    toast({
                        title: 'Acceso denegado',
                        description: 'Debes iniciar sesión para acceder a esta página',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    router.push('/');
                    return;
                }

                const parsedAuth = JSON.parse(savedAuth);
                setAuthState(parsedAuth);

                if (!parsedAuth.user?.roles?.includes('ADMIN')) {
                    toast({
                        title: 'Acceso denegado',
                        description: 'No tienes permisos para acceder a esta página',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    router.push('/');
                    return;
                }

                setIsLoading(false);
            };

            checkAuth();
        }
    }, [router, toast]);

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

    return (
        <Box minH="100vh" bg="background.900">
            {/* Header */}
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

            {/* Contenido principal */}
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    <HStack justify="space-between">
                        <HStack spacing={4}>
                            <Icon as={ClipboardList} boxSize={8} color="brand.500" />
                            <Heading size="lg">Panel de Evaluaciones</Heading>
                        </HStack>

                        <Button
                            onClick={() => router.push('/')}
                            variant="ghost"
                            colorScheme="brand"
                        >
                            Volver al inicio
                        </Button>
                    </HStack>

                    <ScoringDashboard />
                </VStack>
            </Container>
        </Box>
    );
};

export default ScoringPage;