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
  Menu, MenuDivider
} from '@chakra-ui/react';
import {Search, MapPin, Badge, ChevronDownIcon, User, Settings, LogOut} from 'lucide-react';
import axios from 'axios';
import {AuthResponse, AuthState, LoginFormData, LoginRequest, RegisterRequest} from "@/types/user";
import {LoginComponent} from "@/component/login";

const AUTH_SERVER = process.env.AUTH_SERVER || 'http://localhost:8080';

const HomePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  // Estado de autenticación
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Intentar recuperar la sesión guardada
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('authState');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        // Restaurar el token en los headers de axios
        if (parsed.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
        }
        return parsed;
      }
    }
    return {
      user: null,
      token: null
    };
  });

  // Guardar el estado de autenticación cuando cambie
  useEffect(() => {
    if (authState.token) {
      localStorage.setItem('authState', JSON.stringify(authState));
    } else {
      localStorage.removeItem('authState');
    }
  }, [authState]);

  const handleAuth = async (isLogin: boolean, formData: LoginFormData) => {
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      console.log("isLogin -> ", isLogin)
      console.log("formData -> ", formData)
      const response = await axios.post<AuthResponse>(`${AUTH_SERVER}${endpoint}`, formData);

      // Guardamos tanto el usuario como el token
      setAuthState({
        user: response.data,
        token: response.data.token
      });

      // Configuramos el token para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      toast({
        title: isLogin ? 'Login Successful' : 'Registration Successful',
        description: `Welcome, ${response.data.username}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Cerrar el modal después de un login exitoso
      onClose();

    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: isLogin ? 'Login Failed' : 'Registration Failed',
        description: 'There was an error. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error; // Re-lanzar el error para que el componente hijo pueda manejarlo
    }
  };

  const handleLogout = () => {
    // Limpiar el estado y el localStorage
    setAuthState({ user: null, token: null });
    localStorage.removeItem('authState');
    delete axios.defaults.headers.common['Authorization'];

    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    const validateToken = async () => {
      const savedAuth = localStorage.getItem('authState');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed.token) {
          try {
            // Hacer una petición al endpoint de validación
            await axios.get(`${AUTH_SERVER}/auth/validate`, {
              headers: {
                Authorization: `Bearer ${parsed.token}`
              }
            });
          } catch (error) {
            // Si el token no es válido, limpiar la sesión
            console.error('Token validation failed:', error);
            handleLogout();
          }
        }
      }
    };

    validateToken();
  }, []);

  return (
      <Box bg="background.900" minH="100vh">
        {/* Header Navigation */}
        <Box borderBottom="1px" borderColor="whiteAlpha.200" py={4}>
          <Container maxW="container.xl">
            <HStack justify="space-between">
              <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color="brand.500"
              >
                KUALI.ai
              </Text>
              <HStack spacing={4}>
                {authState.user ? (
                    <>
                      <Menu>
                        <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            variant="ghost"
                            display="flex"
                            alignItems="center"
                            px={3}
                            py={2}
                            transition="all 0.2s"
                            borderRadius="lg"
                            bg="whiteAlpha.100"
                            _hover={{
                              bg: "whiteAlpha.200"
                            }}
                            _active={{
                              bg: "whiteAlpha.300"
                            }}
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
                              _hover={{ bg: 'whiteAlpha.100' }}
                              fontSize="sm"
                          >
                            Perfil
                          </MenuItem>
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
                              onClick={handleLogout}
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
                      <Button variant="ghost">Empleos</Button>
                      <Button variant="ghost">Empresas</Button>
                      <Button variant="ghost">Salarios</Button>
                      <Button onClick={onOpen}>
                        Iniciar sesión
                      </Button>
                    </>
                )}
              </HStack>
            </HStack>
          </Container>
        </Box>

        {/* Hero Section */}
        <Container maxW="container.xl" py={20}>
          <Box maxW="3xl" mx="auto" textAlign="center">
            <Heading
                as="h1"
                size="2xl"
                mb={6}
                bgGradient="linear(to-r, brand.500, teal.400)"
                bgClip="text"
            >
              Encuentra el talento perfecto para tu equipo
            </Heading>
            <Text fontSize="xl" mb={12}>
              Conectamos a las mejores empresas con los profesionales más calificados
            </Text>

            {/* Search Form */}
            <VStack spacing={4} maxW="2xl" mx="auto">
              <HStack w="full" spacing={4}>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={Search} color="whiteAlpha.500" />
                  </InputLeftElement>
                  <Input
                      placeholder="Puesto, empresa o palabra clave"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={MapPin} color="whiteAlpha.500" />
                  </InputLeftElement>
                  <Input
                      placeholder="Ciudad o ubicación"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                  />
                </InputGroup>
              </HStack>
              <Button
                  size="lg"
                  w="full"
              >
                Buscar empleos
              </Button>
            </VStack>
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
              <Flex justify="center" wrap="wrap" gap={12}>
                {['Empresa 1', 'Empresa 2', 'Empresa 3', 'Empresa 4'].map((empresa, index) => (
                    <Text
                        key={index}
                        fontSize="xl"
                        color="whiteAlpha.800"
                        fontWeight="bold"
                    >
                      {empresa}
                    </Text>
                ))}
              </Flex>
            </VStack>
          </Container>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay
              bg="blackAlpha.300"
              backdropFilter="blur(10px)"
          />
          <ModalContent bg="transparent" boxShadow="none">
            <LoginComponent
                onAuth={handleAuth}
            />
          </ModalContent>
        </Modal>
      </Box>
  );
};

export default HomePage;