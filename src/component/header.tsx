'use client';
import React from 'react';
import {
    Box,
    Container,
    HStack,
    Text,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    VStack,
    Icon,
} from '@chakra-ui/react';
import {User, Settings, LogOut, ChevronDown, ClipboardList} from 'lucide-react';
import { AuthState } from "@/types/user";
import SearchForm from "@/form/search";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useSearch} from "@/hook/useSearch";

interface HeaderProps {
    authState: AuthState;
    onLogout: () => void;
    onLoginClick: () => void;
    onProfileClick: () => void;
    onLogoClick: () => void;
}

const Header = ({
                    authState,
                    onLogout,
                    onLoginClick,
                    onProfileClick,
                    onLogoClick
                }: HeaderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { searchTerm, location, clearSearch } = useSearch();

    // Mostrar la barra de búsqueda si:
    // 1. Estamos en la página de búsqueda (/search)
    // 2. O si hay términos de búsqueda activos
    const isSearchPage = pathname === '/search';
    const hasActiveSearch = searchParams.has('q') || searchParams.has('location');
    const showSearch = isSearchPage && hasActiveSearch;

    const handleLogoClick = () => {
        clearSearch(); // Asegúrate de que useSearch tenga esta función para resetear los valores.
        onLogoClick();
    };
    const isAdmin = authState.user?.roles?.includes('ADMIN');
    return (
        <Box borderBottom="1px" borderColor="whiteAlpha.200" py={4}>
            <Container maxW="container.xl">
                <VStack spacing={4}>
                    {/* Primera fila: Logo y menú de usuario */}
                    <HStack justify="space-between" w="full">
                        <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color="brand.500"
                            cursor="pointer"
                            onClick={handleLogoClick}
                            _hover={{
                                opacity: 0.8,
                                transform: 'translateY(-1px)',
                                transition: 'all 0.2s'
                            }}
                        >
                            CV Analyzer
                        </Text>
                        <HStack spacing={4}>
                            {authState.user ? (
                                <>
                                    <Menu>
                                        <MenuButton
                                            as={Button}
                                            rightIcon={<ChevronDown />}
                                            variant="ghost"
                                            display="flex"
                                            alignItems="center"
                                            px={3}
                                            py={2}
                                            transition="all 0.2s"
                                            borderRadius="lg"
                                            bg="whiteAlpha.100"
                                            _hover={{ bg: "whiteAlpha.200" }}
                                            _active={{ bg: "whiteAlpha.300" }}
                                        >
                                            <HStack spacing={3}>
                                                <Avatar
                                                    size="sm"
                                                    name={authState.user.username}
                                                    bg="brand.500"
                                                    color="white"
                                                />
                                                <VStack
                                                    display={{ base: 'none', md: 'flex' }}
                                                    alignItems="flex-start"
                                                    spacing={0}
                                                    ml={2}
                                                >
                                                    <Text color="white" fontSize="sm" fontWeight="medium">
                                                        {authState.user.username}
                                                    </Text>
                                                    <Text color="whiteAlpha.600" fontSize="xs">
                                                        {authState.user.email}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        </MenuButton>
                                        <MenuList
                                            bg="gray.800"
                                            borderColor="whiteAlpha.200"
                                            boxShadow="lg"
                                            py={2}
                                        >
                                            <MenuItem
                                                icon={<Icon as={User} />}
                                                onClick={onProfileClick}
                                                _hover={{ bg: 'whiteAlpha.100' }}
                                                fontSize="sm"
                                            >
                                                Mi Perfil
                                            </MenuItem>
                                            {isAdmin && (
                                                <MenuItem
                                                    icon={<Icon as={ClipboardList} />}
                                                    onClick={() => router.push('/score')}
                                                    _hover={{ bg: 'whiteAlpha.100' }}
                                                    fontSize="sm"
                                                >
                                                    Evaluaciones
                                                </MenuItem>
                                            )}
                                            <MenuItem
                                                icon={<Icon as={Settings} />}
                                                _hover={{ bg: 'whiteAlpha.100' }}
                                                fontSize="sm"
                                            >
                                                Configuración
                                            </MenuItem>
                                            <MenuDivider borderColor="whiteAlpha.200" />
                                            <MenuItem
                                                icon={<Icon as={LogOut} />}
                                                onClick={onLogout}
                                                _hover={{ bg: 'whiteAlpha.100' }}
                                                color="red.400"
                                                fontSize="sm"
                                            >
                                                Cerrar sesión
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                    <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
                                        <Button variant="ghost" onClick={onLogoClick}>
                                            Empleos
                                        </Button>
                                        <Button variant="ghost" onClick={onLogoClick}>
                                            Empresas
                                        </Button>
                                        <Button variant="ghost" onClick={onLogoClick}>
                                            Salarios
                                        </Button>
                                    </HStack>
                                    <Button
                                        onClick={onLoginClick}
                                        colorScheme="brand"
                                    >
                                        Iniciar sesión
                                    </Button>
                                </>
                            )}
                        </HStack>
                    </HStack>

                    {/* Segunda fila: Barra de búsqueda (condicional) */}
                    {showSearch && (
                        <Box w="full" px={{ base: 0, md: 8 }}>
                            <SearchForm variant="compact" />
                        </Box>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default Header;