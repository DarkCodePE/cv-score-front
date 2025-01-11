'use client';

import dynamic from 'next/dynamic';
import React, { Suspense, useEffect, useState } from 'react';
import {
    Box,
    Container,
    Spinner,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Header from "@/component/header";
import { AuthState } from "@/types/user";
import SearchPageContent from "@/component/SearchPageContent";


const SearchPage = () => {
    const router = useRouter();
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
            const savedAuth = localStorage.getItem('authState');
            if (savedAuth) {
                setAuthState(JSON.parse(savedAuth));
            }
        }
    }, []);

    if (!authState) {
        return (
            <Box bg="background.900" minH="100vh">
                <Container maxW="container.xl" py={8}>
                    <Spinner size="xl" color="brand.500" />
                </Container>
            </Box>
        );
    }

    return (
        <Box bg="background.900" minH="100vh">
            <Header
                authState={authState}
                onLogout={() => {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('authState');
                        localStorage.removeItem('profileData');
                    }
                    router.push('/');
                }}
                onLoginClick={() => router.push('/')}
                onProfileClick={() => router.push('/profile')}
                onLogoClick={() => router.push('/')}
            />
            <Suspense fallback={<Spinner size="xl" color="brand.500" />}>
                <SearchPageContent authState={authState} />
            </Suspense>
        </Box>
    );
};

// Deshabilitar el prerenderizado en el servidor
export default dynamic(() => Promise.resolve(SearchPage), { ssr: false });
