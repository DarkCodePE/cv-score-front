import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Heading,
    HStack,
    VStack,
    Badge,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Icon,
    Collapse,
    useToast,
    Spinner,
    Divider,
    Avatar
} from '@chakra-ui/react';
import { Search, ChevronDown, ChevronRight, Calendar, User, Briefcase, MapPin, DollarSign, RefreshCw } from 'lucide-react';
import axios from 'axios';


const SCORING_SERVER = process.env.NEXT_PUBLIC_SCORING_SERVER || 'http://localhost:8095';
const PROFILE_SERVER = process.env.NEXT_PUBLIC_PROFILE_SERVER || 'http://localhost:8094';
const JOB_SERVER = process.env.NEXT_PUBLIC_JOB_SERVER || 'http://localhost:8091';

interface JobOffer {
    title: string;
    description: string;
    location: string;
    salary_range: string;
    is_active: boolean;
}

interface Profile {
    first_name: string;
    last_name: string;
    headline: string;
    about: string;
    skills: string[];
}

interface ScoreData {
    id: string;
    job_application_id: string;
    user_id: string;
    job_offer_id: string;
    score: number;
    reasoning: string;
    created_at: string;
    jobOffer?: JobOffer;
    profile?: Profile;
}

const getScoreBadgeColor = (score: number) => {
    if (score >= 4) return 'green';
    if (score >= 3) return 'yellow';
    if (score >= 2) return 'orange';
    return 'red';
};

const ScoringDashboard = () => {
    const [scores, setScores] = useState<ScoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterScore, setFilterScore] = useState('');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const toast = useToast();

    const fetchJobOfferAndProfile = async (score: ScoreData) => {
        try {
            const [jobOfferResponse, profileResponse] = await Promise.all([
                axios.get(`${JOB_SERVER}/jobs/application/${score.job_application_id}/job-offer`),
                axios.get(`${PROFILE_SERVER}/profile/${score.user_id}`)
            ]);

            return {
                ...score,
                jobOffer: jobOfferResponse.data,
                profile: profileResponse.data
            };
        } catch (error) {
            console.error('Error fetching details:', error);
            return score;
        }
    };

    const fetchScores = async () => {
        try {
            const response = await axios.get(`${SCORING_SERVER}/evaluator/eval`);
            const scoresWithDetails = await Promise.all(
                response.data.map(fetchJobOfferAndProfile)
            );
            setScores(scoresWithDetails);
        } catch (error) {
            toast({
                title: 'Error al cargar las evaluaciones',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScores();
    }, []);

    const toggleRow = (id: string) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const filteredScores = scores.filter(score => {
        const matchesSearch = searchTerm === '' ||
            (score.profile?.first_name + ' ' + score.profile?.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
            score.jobOffer?.title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesScore = filterScore === '' || score.score === parseInt(filterScore);

        return matchesSearch && matchesScore;
    });

    return (
        <VStack spacing={8} align="stretch">
            {/* Filtros */}
            <HStack spacing={4}>
                <InputGroup maxW="400px">
                    <InputLeftElement>
                        <Icon as={Search} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Buscar por candidato u oferta"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
                <Select
                    placeholder="Filtrar por puntuación"
                    value={filterScore}
                    onChange={(e) => setFilterScore(e.target.value)}
                    maxW="200px"
                >
                    {[1, 2, 3, 4, 5].map(score => (
                        <option key={score} value={score}>
                            {score} puntos
                        </option>
                    ))}
                </Select>
                <Button
                    onClick={() => {
                        setSearchTerm('');
                        setFilterScore('');
                    }}
                    variant="outline"
                >
                    Limpiar filtros
                </Button>
                <Button
                    leftIcon={<Icon as={RefreshCw} />}
                    onClick={fetchScores}
                    colorScheme="brand"
                    variant="solid"
                >
                    Sincronizar
                </Button>
            </HStack>

            {/* Tabla de resultados */}
            {loading ? (
                <VStack py={8}>
                    <Spinner size="xl" color="brand.500" />
                    <Text>Cargando evaluaciones...</Text>
                </VStack>
            ) : (
                <Box overflowX="auto">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Candidato</Th>
                                <Th>Puesto</Th>
                                <Th>Puntuación</Th>
                                <Th>Fecha</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredScores.map((score) => (
                                <React.Fragment key={score.id}>
                                    <Tr
                                        cursor="pointer"
                                        onClick={() => toggleRow(score.id)}
                                        _hover={{ bg: 'whiteAlpha.50' }}
                                    >
                                        <Td>
                                            <Icon
                                                as={expandedRows.has(score.id) ? ChevronDown : ChevronRight}
                                                boxSize={5}
                                            />
                                        </Td>
                                        <Td>
                                            <HStack>
                                                <Avatar
                                                    size="sm"
                                                    name={`${score.profile?.first_name} ${score.profile?.last_name}`}
                                                    bg="brand.500"
                                                />
                                                <VStack align="start" spacing={0}>
                                                    <Text fontWeight="medium">
                                                        {score.profile?.first_name} {score.profile?.last_name}
                                                    </Text>
                                                    <Text fontSize="sm" color="gray.400">
                                                        {score.profile?.headline}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        </Td>
                                        <Td>
                                            <VStack align="start" spacing={1}>
                                                <Text fontWeight="medium">
                                                    {score.jobOffer?.title || 'Título no disponible'}
                                                </Text>
                                                <Text fontSize="sm" color="gray.400">
                                                    {score.jobOffer?.location || 'Ubicación no especificada'}
                                                </Text>
                                            </VStack>
                                        </Td>
                                        <Td>
                                            <Badge
                                                colorScheme={getScoreBadgeColor(score.score)}
                                                fontSize="sm"
                                                px={2}
                                                py={1}
                                                borderRadius="full"
                                            >
                                                {score.score}/5
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <Text fontSize="sm" color="gray.400">
                                                {new Date(score.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </Text>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td colSpan={5} p={0}>
                                            <Collapse in={expandedRows.has(score.id)}>
                                                <Box
                                                    p={6}
                                                    bg="gray.800"
                                                    borderBottomRadius="md"
                                                >
                                                    <VStack align="stretch" spacing={4}>
                                                        <HStack justify="space-between">
                                                            <VStack align="start" spacing={1}>
                                                                <Text fontWeight="bold" fontSize="lg">
                                                                    Detalles de la Evaluación
                                                                </Text>
                                                                <Text fontSize="sm" color="gray.400">
                                                                    ID: {score.id}
                                                                </Text>
                                                            </VStack>
                                                            {score.jobOffer?.salary_range && (
                                                                <HStack>
                                                                    <Icon as={DollarSign} color="green.400" />
                                                                    <Text color="green.400">
                                                                        {score.jobOffer.salary_range}
                                                                    </Text>
                                                                </HStack>
                                                            )}
                                                        </HStack>

                                                        <Divider />

                                                        <HStack align="start" spacing={8}>
                                                            {/* Información del Candidato */}
                                                            <VStack align="start" flex="1">
                                                                <Text fontWeight="bold">Perfil del Candidato</Text>
                                                                <Text color="gray.300">
                                                                    {score.profile?.about}
                                                                </Text>
                                                                {score.profile?.skills && (
                                                                    <HStack flexWrap="wrap" gap={2} mt={2}>
                                                                        {score.profile.skills.map((skill, index) => (
                                                                            <Badge key={index} colorScheme="brand">
                                                                                {skill}
                                                                            </Badge>
                                                                        ))}
                                                                    </HStack>
                                                                )}
                                                            </VStack>

                                                            {/* Información de la Oferta */}
                                                            <VStack align="start" flex="1">
                                                                <Text fontWeight="bold">Detalles de la Oferta</Text>
                                                                <Text color="gray.300">
                                                                    {score.jobOffer?.description}
                                                                </Text>
                                                            </VStack>
                                                        </HStack>

                                                        <Divider />

                                                        {/* Razonamiento de la evaluación */}
                                                        <VStack align="start" spacing={4}>
                                                            <Text fontWeight="bold" fontSize="lg">
                                                                Razonamiento de la Evaluación
                                                            </Text>
                                                            {score.reasoning.split('\n\n').map((paragraph, index) => {
                                                                if (paragraph.startsWith('**')) {
                                                                    // Es un título
                                                                    const title = paragraph.replace(/\*\*/g, '');
                                                                    return (
                                                                        <VStack key={index} align="start" spacing={2} w="full">
                                                                            <Text fontWeight="semibold" color="brand.400">
                                                                                {title.split(':')[0]}
                                                                            </Text>
                                                                            <Text color="gray.300" lineHeight="tall">
                                                                                {title.split(':')[1]}
                                                                            </Text>
                                                                        </VStack>
                                                                    );
                                                                }
                                                                return (
                                                                    <Text key={index} color="gray.300" lineHeight="tall">
                                                                        {paragraph}
                                                                    </Text>
                                                                );
                                                            })}
                                                        </VStack>
                                                    </VStack>
                                                </Box>
                                            </Collapse>
                                        </Td>
                                    </Tr>
                                </React.Fragment>
                            ))}
                        </Tbody>
                    </Table>

                    {filteredScores.length === 0 && (
                        <VStack py={8} spacing={2}>
                            <Text color="gray.500">
                                No se encontraron evaluaciones que coincidan con los filtros.
                            </Text>
                            <Button
                                variant="link"
                                colorScheme="brand"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterScore('');
                                }}
                            >
                                Limpiar filtros
                            </Button>
                        </VStack>
                    )}
                </Box>
            )}
        </VStack>
    );
};

export default ScoringDashboard;