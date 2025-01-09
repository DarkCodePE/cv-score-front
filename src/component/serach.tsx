import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    InputGroup,
    Input,
    InputLeftElement,
    Button,
    Icon,
    Select,
    Text,
    Flex,
    Divider,
    Badge,
    useToast,
    Checkbox,
} from '@chakra-ui/react';
import { Search, MapPin } from 'lucide-react';

const SearchComponent = ({ onSearch }: { onSearch: (filters: any) => void }) => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [level, setLevel] = useState('');
    const [isRemote, setIsRemote] = useState(false);
    const toast = useToast();

    const handleSearch = () => {
        if (!title && !location) {
            toast({
                title: 'Error',
                description: 'Por favor, ingresa al menos un término de búsqueda o ubicación.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        const filters = {
            title,
            location,
            jobType,
            level,
            isRemote,
        };
        onSearch(filters);
    };

    return (
        <Box p={6} bg="whiteAlpha.100" borderRadius="lg" boxShadow="md">
            {/* Filtros principales */}
            <VStack spacing={4} align="stretch">
                <HStack spacing={4}>
                    <InputGroup>
                        <InputLeftElement>
                            <Icon as={Search} color="whiteAlpha.700" />
                        </InputLeftElement>
                        <Input
                            placeholder="Título del empleo (ej. Desarrollador)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputLeftElement>
                            <Icon as={MapPin} color="whiteAlpha.700" />
                        </InputLeftElement>
                        <Input
                            placeholder="Ubicación (ej. Lima, Perú)"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </InputGroup>
                    <Button onClick={handleSearch} colorScheme="brand" px={8}>
                        Buscar
                    </Button>
                </HStack>

                {/* Filtros avanzados */}
                <HStack spacing={4}>
                    <Select
                        placeholder="Tipo de empleo"
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        bg="whiteAlpha.100"
                    >
                        <option value="FULL_TIME">Tiempo completo</option>
                        <option value="PART_TIME">Medio tiempo</option>
                        <option value="CONTRACT">Contrato</option>
                    </Select>
                    <Select
                        placeholder="Nivel de experiencia"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        bg="whiteAlpha.100"
                    >
                        <option value="JUNIOR">Junior</option>
                        <option value="MID">Intermedio</option>
                        <option value="SENIOR">Senior</option>
                    </Select>
                    <Checkbox
                        isChecked={isRemote}
                        onChange={(e) => setIsRemote(e.target.checked)}
                        colorScheme="brand"
                    >
                        Remoto
                    </Checkbox>
                </HStack>
            </VStack>

            <Divider my={6} />

            {/* Simulación de resultados */}
            <Box>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                    Resultados de búsqueda
                </Text>
                <Flex direction="column" gap={4}>
                    {/* Aquí se deberían renderizar dinámicamente los resultados */}
                    <Box
                        bg="whiteAlpha.200"
                        p={4}
                        borderRadius="lg"
                        boxShadow="sm"
                        _hover={{ bg: 'whiteAlpha.300' }}
                    >
                        <Text fontSize="md" fontWeight="bold">
                            Ejemplo de oferta laboral
                        </Text>
                        <Text fontSize="sm" color="whiteAlpha.600">
                            Ubicación: Lima, Perú
                        </Text>
                        <Badge colorScheme="green" mt={2}>
                            Remoto
                        </Badge>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};

export default SearchComponent;
