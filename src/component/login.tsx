import React, { useState } from 'react';
import {
    Box,
    VStack,
    Input,
    Button,
    Text,
    Link,
    Divider,
    InputGroup,
    InputLeftElement,
    useToast,
    Icon,
} from '@chakra-ui/react';
import { User, Lock, Mail } from 'lucide-react';
import {LoginFormData} from "@/types/user";



interface LoginComponentProps {
    onAuth: (isLogin: boolean, formData: LoginFormData) => Promise<void>;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({ onAuth }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        identifier: '',
        username: '',
        email: '',
        password: '',
    });

    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onAuth(isLogin, formData);
        } catch (error) {
            toast({
                title: isLogin ? 'Login Failed' : 'Registration Failed',
                description: 'There was an error. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box
            maxWidth="400px"
            margin="auto"
            p={8}
            borderRadius="lg"
            bg="background.900"
            boxShadow="xl"
        >
            <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                    <Text fontSize="2xl" fontWeight="bold">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </Text>

                    {isLogin ? (
                        <InputGroup>
                            <InputLeftElement>
                                <Icon as={User} color="gray.500" />
                            </InputLeftElement>
                            <Input
                                placeholder="Usuario o Email"
                                value={formData.identifier}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    identifier: e.target.value
                                })}
                                required
                            />
                        </InputGroup>
                    ) : (
                        <>
                            <InputGroup>
                                <InputLeftElement>
                                    <Icon as={User} color="gray.500" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Nombre de usuario"
                                    value={formData.username}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        username: e.target.value
                                    })}
                                    required
                                />
                            </InputGroup>

                            <InputGroup>
                                <InputLeftElement>
                                    <Icon as={Mail} color="gray.500" />
                                </InputLeftElement>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        email: e.target.value
                                    })}
                                    required
                                />
                            </InputGroup>
                        </>
                    )}

                    <InputGroup>
                        <InputLeftElement>
                            <Icon as={Lock} color="gray.500" />
                        </InputLeftElement>
                        <Input
                            type="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={(e) => setFormData({
                                ...formData,
                                password: e.target.value
                            })}
                            required
                        />
                    </InputGroup>

                    <Button type="submit" colorScheme="teal" width="full">
                        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </Button>

                    <Divider />

                    <Button width="full" colorScheme="gray" variant="outline" isDisabled>
                        Continuar con Google
                    </Button>
                    <Button width="full" colorScheme="facebook" variant="outline" isDisabled>
                        Continuar con Facebook
                    </Button>
                    <Button width="full" colorScheme="gray" variant="outline" isDisabled>
                        Continuar con Apple
                    </Button>

                    <Text fontSize="sm">
                        {isLogin ? (
                            <>
                                ¿No tienes cuenta?{' '}
                                <Link color="teal.500" onClick={() => setIsLogin(false)}>
                                    Regístrate
                                </Link>
                            </>
                        ) : (
                            <>
                                ¿Ya tienes cuenta?{' '}
                                <Link color="teal.500" onClick={() => setIsLogin(true)}>
                                    Inicia sesión
                                </Link>
                            </>
                        )}
                    </Text>
                </VStack>
            </form>
        </Box>
    );
};