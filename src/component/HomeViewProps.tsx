import React, { useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Input,
    Button,
    VStack,
    HStack,
    Icon,
    InputGroup,
    InputLeftElement,
    Image,
    Flex,
} from '@chakra-ui/react';
import SearchForm from "@/form/search";
import {usePathname} from "next/navigation";
import {css, keyframes} from "@emotion/react";

interface HomeViewProps {
    isAuthenticated: boolean;
}
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
    &:hover {
        border-color: #e43c8e;
        -webkit-text-fill-color: white;
    }
`;
const clientImageStyle = css`
    filter: grayscale(100%);
    opacity: 0.7;
    transition: all 0.3s ease;
    
    &:hover {
        filter: grayscale(0%);
        opacity: 1;
        transform: translateY(-2px);
    }
`;
const HomeView = ({isAuthenticated }: HomeViewProps) => {
    const pathname = usePathname();
    const showSearch = pathname !== '/search'; // Solo mostrar en home

    return (
        <>
            {/* Hero Section */}
            <Container maxW="container.xl" py={20}>
                <Box maxW="3xl" mx="auto" textAlign="center">
                    <Heading
                        as="h1"
                        size="2xl"
                        mb={6}
                        bgGradient="linear(to-r, brand.500, teal.400)"
                        bgClip="text"
                        css={magicButtonStyle}
                    >
                        Potencia tu carrera con un CV que destaque
                    </Heading>
                    <Text fontSize="xl" mb={12}>
                        Analizamos tu currículum frente a las ofertas de empleo y te decimos cómo mejorarlo antes de postularte.
                    </Text>

                    {/* Search Form */}
                    {showSearch && (
                        <VStack spacing={4} maxW="2xl" mx="auto">
                            <SearchForm />
                        </VStack>
                    )}
                </Box>
            </Container>

            {/* Featured Section */}
            <Box borderTop="1px" borderColor="whiteAlpha.200" py={16}>
                <Container maxW="container.xl">
                    <VStack spacing={8} align="stretch">
                        <Heading
                            size="lg"
                            textAlign="center"
                        >
                            Las mejores empresas confían en nosotros
                        </Heading>
                        Entiendo, los logos se ven demasiado grandes y necesitan ajustes de estilo. Vamos a modificar el código para que se vea más similar a tu captura de pantalla:
                        typescriptCopy
                        <Flex
                        justify="center"
                        align="center"
                        wrap="wrap"
                        gap={8}
                        my={12}
                        px={4}
                        maxW="4xl"
                        mx="auto"
                    >
                            <Box
                            css={css`
            filter: brightness(0.9) grayscale(100%);
            transition: all 0.3s ease;
            width: 120px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
                filter: brightness(1) grayscale(0%);
                transform: translateY(-2px);
            }
        `}
                        >
                            <Image
                                src="https://www.ucv.edu.pe/media/logo_completo_color-6E6VDOZV.png"
                                alt="AVLA logo"
                                width="100%"
                                height="100%"
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>

                    </Flex>
                    </VStack>
                </Container>
            </Box>
        </>
    );
};

export default HomeView;