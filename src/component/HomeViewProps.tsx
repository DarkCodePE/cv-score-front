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
                        Encuentra el talento perfecto para tu equipo
                    </Heading>
                    <Text fontSize="xl" mb={12}>
                        Conectamos a las mejores empresas con los profesionales más calificados
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
                                src="https://cdn.prod.website-files.com/6320941e9612f79b0e2f61b1/649b5794e7ee6905bc16a49b_avla%20logo.jpg"
                                alt="AVLA logo"
                                width="100%"
                                height="100%"
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>

                        <Box
                            css={css`
            filter: brightness(0.9) grayscale(100%);
            transition: all 0.3s ease;
            width: 160px;
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
                                src="https://cdn.prod.website-files.com/6320941e9612f79b0e2f61b1/66280d0af4abddab8bedd105_Concentrix%20Logo%20color.png"
                                alt="Concentrix logo"
                                width="100%"
                                height="100%"
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>

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
                                src="https://cdn.prod.website-files.com/6320941e9612f79b0e2f61b1/65943d5e1ecc1503a0f0feae_Logo_yape_partner.png"
                                alt="Yape logo"
                                width="100%"
                                height="100%"
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>

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
                                src="https://cdn.prod.website-files.com/6320941e9612f79b0e2f61b1/65943db19dcc72d1ebd9e118_Logo-Konecta.png"
                                alt="Konecta logo"
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